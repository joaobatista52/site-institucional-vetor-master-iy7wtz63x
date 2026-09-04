import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import {
  AlertTriangle,
  ArrowLeft,
  ArrowRight,
  Check,
  CheckCircle2,
  ClipboardList,
  Clock3,
  FileUp,
  Loader2,
  Paperclip,
  Send,
  Trash2,
  X,
} from 'lucide-react'

import pb from '@/lib/pocketbase/client'
import { getErrorMessage } from '@/lib/pocketbase/errors'
import { findSector } from '@/data/sectors'
import { engagementFormats } from '@/data/questionnaire'
import type { Question } from '@/data/questionnaire'
import { getQuestionnaireSections } from '@/data/questionnaireSectors'
import { getChosenPlan, saveStoredLead } from '@/lib/leadSession'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

const RETURN_MESSAGE =
  'Retorno da equipe em até 5 dias para agendar sua Sessão de Devolutiva de 45 minutos'

type FileGroup = 'contratoSocial' | 'certificacoes' | 'documentacaoAdicional'

interface WizardFiles {
  contratoSocial: File[]
  certificacoes: File[]
  documentacaoAdicional: File[]
}

interface CadastroData {
  nomeCompleto: string
  empresa: string
  email: string
  whatsapp: string
}

const emptyCadastro: CadastroData = {
  nomeCompleto: '',
  empresa: '',
  email: '',
  whatsapp: '',
}

// 9 seções de perguntas + Próximos Passos + Documentação + Cadastro = 12 etapas
const TOTAL_STEPS = 12

function maskCNPJ(value: string): string {
  return value
    .replace(/\D/g, '')
    .slice(0, 14)
    .replace(/(\d{2})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d)/, '$1/$2')
    .replace(/(\d{4})(\d)/, '$1-$2')
}

function maskPhone(value: string): string {
  const digits = value.replace(/\D/g, '').slice(0, 11)
  if (digits.length <= 2) {
    return digits.length > 0 ? `(${digits}` : ''
  }
  if (digits.length <= 6) {
    return `(${digits.slice(0, 2)}) ${digits.slice(2)}`
  }
  if (digits.length <= 10) {
    // Formato telefone fixo (XX) XXXX-XXXX (10 dígitos)
    return `(${digits.slice(0, 2)}) ${digits.slice(2, 6)}-${digits.slice(6)}`
  }
  // Formato celular móvel (XX) 9XXXX-XXXX (11 dígitos)
  return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7, 11)}`
}

function maskDate(value: string): string {
  return value
    .replace(/\D/g, '')
    .slice(0, 8)
    .replace(/(\d{2})(\d)/, '$1/$2')
    .replace(/(\d{2})(\d)/, '$1/$2')
}

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

function yesNoOptions(
  question: import('@/data/questionnaire').Question,
): { value: string; label: string }[] {
  return [
    { value: 'Sim', label: 'Sim' },
    { value: 'Não', label: 'Não' },
    { value: 'Parcialmente', label: 'Parcialmente' },
  ].map((option) => ({
    value: option.value,
    label: question.type === 'yes-no' ? option.label : option.label,
  }))
}

export default function Questionnaire() {
  const { sectorId } = useParams()
  const navigate = useNavigate()
  const sector = findSector(sectorId)

  // Capturar e persistir plano escolhido via URL (?plano=...) se presente
  useEffect(() => {
    try {
      const searchParams = new URLSearchParams(window.location.search)
      const urlPlan = searchParams.get('plano')
      if (urlPlan && urlPlan.trim()) {
        sessionStorage.setItem('vetor_chosen_plan', urlPlan.trim())
      }
    } catch {
      // Ignorar indisponibilidade de sessionStorage
    }
  }, [])
  const [step, setStep] = useState(0)
  const [answers, setAnswers] = useState<Record<string, string>>({})
  const [cadastro, setCadastro] = useState<CadastroData>(emptyCadastro)
  const [files, setFiles] = useState<WizardFiles>({
    contratoSocial: [],
    certificacoes: [],
    documentacaoAdicional: [],
  })
  const [autorizacaoDevolutiva, setAutorizacaoDevolutiva] = useState<string>('')
  const [formatoInteresse, setFormatoInteresse] = useState<string>('')
  const [responsavelDocumentos, setResponsavelDocumentos] = useState<string>('')
  const [highestReachedStep, setHighestReachedStep] = useState<number>(0)
  const [stepErrors, setStepErrors] = useState<string[]>([])
  const [submitting, setSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState('')
  const [submittedId, setSubmittedId] = useState<string | null>(null)
  const formTopRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!sector) navigate('/setores', { replace: true })
  }, [sector, navigate])

  // Cada setor carrega sua própria versão das seções (perguntas literais do PDF
  // "Questionários_Consolidados_12_Setores_V6.7", incluindo as variações de
  // Comércio Internacional e Facilities).
  const sections = useMemo(() => getQuestionnaireSections(sectorId), [sectorId])
  const nextStepsStep = sections.length
  const docsStep = sections.length + 1
  const cadastroStep = sections.length + 2

  const totalQuestions = useMemo(
    () => sections.reduce((count, section) => count + section.questions.length, 0),
    [sections],
  )
  const answeredCount = useMemo(
    () => Object.values(answers).filter((value) => value.trim() !== '').length,
    [answers],
  )

  const scrollToTop = useCallback(() => {
    formTopRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }, [])

  useEffect(() => {
    scrollToTop()
  }, [step, scrollToTop])

  const currentSection = step < sections.length ? sections[step] : null

  function setAnswer(id: string, value: string) {
    setAnswers((prev) => ({ ...prev, [id]: value }))
  }

  function formatFileSize(bytes: number): string {
    if (bytes < 1024) return `${bytes} B`
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
  }

  function addFiles(group: FileGroup, incoming: FileList | null) {
    if (!incoming || incoming.length === 0) return
    const newFiles = Array.from(incoming)
    setFiles((prev) => {
      // Evitar duplicatas exatas pelo nome + tamanho
      const existing = prev[group]
      const uniqueIncoming = newFiles.filter(
        (nf) => !existing.some((ef) => ef.name === nf.name && ef.size === nf.size),
      )
      return {
        ...prev,
        [group]: [...existing, ...uniqueIncoming].slice(0, 15),
      }
    })
  }

  function removeFile(group: FileGroup, index: number) {
    setFiles((prev) => ({ ...prev, [group]: prev[group].filter((_, i) => i !== index) }))
  }

  const isStepComplete = useCallback(
    (stepIndex: number): boolean => {
      if (stepIndex < sections.length) {
        const sec = sections[stepIndex]
        if (!sec) return false
        for (const question of sec.questions) {
          const val = (answers[question.id] ?? '').trim()
          if (question.required && val === '') {
            return false
          }
        }
        return true
      }

      if (stepIndex === nextStepsStep) {
        return (
          Boolean(autorizacaoDevolutiva) &&
          Boolean(formatoInteresse) &&
          Boolean(responsavelDocumentos.trim())
        )
      }

      if (stepIndex === docsStep) {
        // Documentação é opcional conforme enunciado e UI
        return true
      }

      if (stepIndex === cadastroStep) {
        return (
          Boolean(cadastro.nomeCompleto.trim()) &&
          Boolean(cadastro.empresa.trim()) &&
          isValidEmail(cadastro.email) &&
          cadastro.whatsapp.replace(/\D/g, '').length === 11
        )
      }

      return false
    },
    [
      sections,
      answers,
      nextStepsStep,
      docsStep,
      cadastroStep,
      autorizacaoDevolutiva,
      formatoInteresse,
      responsavelDocumentos,
      cadastro,
    ],
  )

  function validateCurrentStep(): string[] {
    const errors: string[] = []

    if (currentSection) {
      for (const question of currentSection.questions) {
        const value = (answers[question.id] ?? '').trim()
        if (question.required && value === '') {
          errors.push(`Responda: ${question.label}`)
        }
      }
      return errors
    }

    if (step === nextStepsStep) {
      if (!autorizacaoDevolutiva) errors.push('Autorize (ou não) a devolutiva de 45 minutos.')
      if (!formatoInteresse) errors.push('Selecione o formato de interesse.')
      if (!responsavelDocumentos.trim())
        errors.push('Informe o responsável pelos documentos anexados.')
      return errors
    }

    if (step === cadastroStep) {
      if (!cadastro.nomeCompleto.trim()) errors.push('Informe o nome completo.')
      if (!cadastro.empresa.trim()) errors.push('Informe a empresa.')
      if (!isValidEmail(cadastro.email)) errors.push('Informe um e-mail corporativo válido.')
      const phoneDigits = cadastro.whatsapp.replace(/\D/g, '')
      if (phoneDigits.length !== 11) {
        errors.push('Informe um celular/WhatsApp com DDD válido de 11 dígitos: (XX) 9XXXX-XXXX.')
      }
      return errors
    }

    return errors
  }

  function handleNext() {
    const errors = validateCurrentStep()
    setStepErrors(errors)
    if (errors.length > 0) return
    setStepErrors([])
    setStep((prev) => {
      const nextStep = Math.min(prev + 1, TOTAL_STEPS - 1)
      setHighestReachedStep((curr) => Math.max(curr, nextStep))
      return nextStep
    })
  }

  function handleBack() {
    setStepErrors([])
    setStep((prev) => Math.max(prev - 1, 0))
  }

  function renderQuestionInput(question: Question) {
    const value = answers[question.id] ?? ''
    const options = question.type === 'yes-no' ? yesNoOptions(question) : (question.options ?? [])

    if (question.type === 'textarea') {
      return (
        <Textarea
          id={question.id}
          value={value}
          onChange={(event) => setAnswer(question.id, event.target.value)}
          placeholder={question.placeholder}
          rows={3}
        />
      )
    }

    if (question.type === 'select' || question.type === 'yes-no') {
      return (
        <Select value={value} onValueChange={(next) => setAnswer(question.id, next)}>
          <SelectTrigger id={question.id}>
            <SelectValue placeholder="Selecione uma opção" />
          </SelectTrigger>
          <SelectContent>
            {options.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      )
    }

    const isCnpjField = question.id.endsWith('_cnpj') || question.id === 'cnpj'
    const isDateField =
      question.id.endsWith('_data') ||
      question.id === 'data' ||
      /data/i.test(question.label) ||
      question.placeholder?.toLowerCase().includes('dd/mm')
    const isPhoneField =
      question.id.endsWith('_celular') ||
      question.id.endsWith('_telefone') ||
      question.id.endsWith('_whatsapp') ||
      question.id === 'celular' ||
      question.id === 'telefone' ||
      question.id === 'whatsapp' ||
      /celular|whatsapp|telefone/i.test(question.label)

    return (
      <Input
        id={question.id}
        value={value}
        onChange={(event) => {
          let val = event.target.value
          if (isCnpjField) {
            val = maskCNPJ(val)
          } else if (isDateField) {
            val = maskDate(val)
          } else if (isPhoneField) {
            val = maskPhone(val)
          }
          setAnswer(question.id, val)
        }}
        placeholder={
          isDateField ? 'DD/MM/AAAA' : isPhoneField ? '(00) 90000-0000' : question.placeholder
        }
      />
    )
  }

  function renderFilesStep() {
    const isComercio = sectorId === 'comercio-internacional'
    const isFacilities = sectorId === 'facilities'

    const docItems = isComercio
      ? [
          'Balanço Patrimonial',
          'DRE',
          'Organograma',
          'Relatórios de Vendas',
          'Contratos de Câmbio',
          'Planilha de Landed Cost',
        ]
      : isFacilities
        ? [
            'Balanço Patrimonial',
            'DRE',
            'Organograma',
            'Relatórios de Vendas',
            'Contratos',
            'Planilha de Margem por Contrato',
          ]
        : ['Balanço Patrimonial', 'DRE', 'Organograma', 'Relatórios de Vendas']

    const groups: { key: FileGroup; title: string; help: string }[] = [
      {
        key: 'contratoSocial',
        title: 'Contrato social',
        help: 'Contrato social, estatuto ou alterações contratuais (PDF, DOC, JPG, PNG).',
      },
      {
        key: 'certificacoes',
        title: 'Comprovantes de certificações',
        help: 'Certificados e comprovantes das certificações informadas (PDF, JPG, PNG).',
      },
      {
        key: 'documentacaoAdicional',
        title: 'DOCUMENTAÇÃO ADICIONAL (OPCIONAL)',
        help: `Itens sugeridos para envio: ${docItems.join(' • ')} (além de Fluxo de Caixa e relatórios gerenciais).`,
      },
    ]

    return (
      <div className="wizard-files">
        {/* Banner claro e destacado com limites permitidos */}
        <div className="p-4 rounded-xl border border-blue-200 bg-[#EAF3FD] text-[#004f9f] space-y-1.5 shadow-sm">
          <div className="flex items-center gap-2 font-bold text-sm text-[#0066CC]">
            <Paperclip className="w-4 h-4 text-[#0066CC]" />
            <span>Limites e Formatos Suportados de Arquivos</span>
          </div>
          <p className="text-xs sm:text-[13px] text-gray-700 leading-relaxed">
            • <strong>Tamanho máximo permitido:</strong> até <strong>100 MB por arquivo</strong>.
            <br />• <strong>Quantidade máxima:</strong> até <strong>15 arquivos por campo</strong>.
            <br />• <strong>Formatos aceitos:</strong> PDF, Word (.doc, .docx), Excel (.xls, .xlsx,
            .csv), Imagens (JPG, PNG, WEBP), Arquivos Compactados (ZIP) e TXT.
          </p>
        </div>

        {groups.map((group) => (
          <div className="wizard-file-group" key={group.key}>
            <div className="wizard-file-group-head">
              <Paperclip aria-hidden="true" />
              <div>
                <h4>{group.title}</h4>
                <p>{group.help}</p>
              </div>
            </div>
            <label
              htmlFor={`file-input-${group.key}`}
              className="wizard-file-dropzone cursor-pointer"
            >
              <FileUp aria-hidden="true" />
              <span>Clique para selecionar ou anexar arquivos</span>
              <input
                id={`file-input-${group.key}`}
                type="file"
                multiple
                className="sr-only"
                onChange={(event) => {
                  if (event.target.files && event.target.files.length > 0) {
                    addFiles(group.key, event.target.files)
                  }
                  event.target.value = ''
                }}
              />
            </label>
            {files[group.key].length > 0 ? (
              <div className="mt-3">
                <div className="flex items-center justify-between text-xs font-semibold text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-md border border-emerald-200 mb-2">
                  <span className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    {files[group.key].length} arquivo(s) pronto(s) para envio:
                  </span>
                </div>
                <ul className="wizard-file-list">
                  {files[group.key].map((file, index) => (
                    <li key={`${file.name}-${file.size}-${index}`}>
                      <div className="flex items-center gap-2 min-w-0">
                        <Paperclip className="w-4 h-4 text-[#0066CC] shrink-0" />
                        <span className="truncate font-medium">{file.name}</span>
                        <span className="text-xs text-gray-500 shrink-0">
                          ({formatFileSize(file.size)})
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.preventDefault()
                          e.stopPropagation()
                          removeFile(group.key, index)
                        }}
                        aria-label={`Remover ${file.name}`}
                        title="Remover arquivo"
                      >
                        <Trash2 aria-hidden="true" />
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            ) : (
              <p className="text-xs text-muted-foreground mt-2 italic">
                Nenhum arquivo anexado ainda neste grupo.
              </p>
            )}
          </div>
        ))}
      </div>
    )
  }

  function renderNextStepsStep() {
    return (
      <div className="wizard-next-steps">
        <div className="wizard-next-block">
          <p className="font-semibold text-foreground text-sm sm:text-base mb-1">
            • 9.1 Você receberá um Diagnóstico Executivo com recomendações prioritárias.
          </p>
          <p className="text-xs sm:text-sm text-muted-foreground">
            A Sessão de Devolutiva é uma reunião executiva de 45 minutos em que a equipe VETOR
            MASTER apresenta o Diagnóstico Estratégico e o plano de ação.
          </p>
        </div>

        <div className="wizard-next-block">
          <h4>• 9.2 Autoriza sessão de devolutiva de 45 min?</h4>
          <div className="wizard-choice-row">
            {['Sim', 'Não'].map((option) => (
              <button
                key={option}
                type="button"
                className={`wizard-choice ${autorizacaoDevolutiva === option ? 'is-selected' : ''}`}
                onClick={() => setAutorizacaoDevolutiva(option)}
              >
                ( ) {option}
              </button>
            ))}
          </div>
        </div>

        <div className="wizard-next-block">
          <h4>• 9.3 Formato de interesse:</h4>
          <div className="wizard-choice-row">
            {['MaaS', 'Híbrido', 'CaaS', 'Ainda não sei'].map((format) => (
              <button
                key={format}
                type="button"
                className={`wizard-choice ${formatoInteresse === format ? 'is-selected' : ''}`}
                onClick={() => setFormatoInteresse(format)}
              >
                ( ) {format}
              </button>
            ))}
          </div>
        </div>

        <div className="wizard-next-block">
          <h4>• 9.4 Responsável pelos documentos:</h4>
          <Input
            value={responsavelDocumentos}
            onChange={(event) => setResponsavelDocumentos(event.target.value)}
            placeholder="Nome e cargo do responsável"
          />
        </div>
      </div>
    )
  }

  function renderCadastroStep() {
    const isLast = step === TOTAL_STEPS - 1
    return (
      <div className="wizard-cadastro">
        <div className="wizard-cadastro-grid">
          <div className="wizard-field">
            <Label htmlFor="cadastro-nome">Nome completo *</Label>
            <Input
              id="cadastro-nome"
              value={cadastro.nomeCompleto}
              onChange={(event) =>
                setCadastro((prev) => ({ ...prev, nomeCompleto: event.target.value }))
              }
              placeholder="Seu nome"
            />
          </div>
          <div className="wizard-field">
            <Label htmlFor="cadastro-empresa">Empresa *</Label>
            <Input
              id="cadastro-empresa"
              value={cadastro.empresa}
              onChange={(event) =>
                setCadastro((prev) => ({ ...prev, empresa: event.target.value }))
              }
              placeholder="Razão social ou nome fantasia"
            />
          </div>
          <div className="wizard-field">
            <Label htmlFor="cadastro-email">E-mail corporativo *</Label>
            <Input
              id="cadastro-email"
              type="email"
              value={cadastro.email}
              onChange={(event) => setCadastro((prev) => ({ ...prev, email: event.target.value }))}
              placeholder="voce@empresa.com.br"
            />
          </div>
          <div className="wizard-field">
            <Label htmlFor="cadastro-whatsapp">Celular / WhatsApp (11 dígitos) *</Label>
            <Input
              id="cadastro-whatsapp"
              value={cadastro.whatsapp}
              onChange={(event) =>
                setCadastro((prev) => ({ ...prev, whatsapp: maskPhone(event.target.value) }))
              }
              placeholder="(00) 90000-0000"
              maxLength={15}
            />
          </div>
        </div>
        {isLast && (
          <div className="wizard-submit-note">
            <Clock3 aria-hidden="true" />
            <span>{RETURN_MESSAGE}</span>
          </div>
        )}
      </div>
    )
  }

  async function handleSubmit() {
    const errors = validateCurrentStep()
    setStepErrors(errors)
    if (errors.length > 0 || !sector) return

    setSubmitting(true)
    setSubmitError('')

    try {
      // Herdar CNPJ e Faturamento coletados nas etapas iniciais de qualquer um dos 12 setores
      const inheritedCnpj =
        answers.saude_cnpj ||
        answers.servicos_cnpj ||
        answers.industria_cnpj ||
        answers.varejo_cnpj ||
        answers.agro_cnpj ||
        answers.tech_cnpj ||
        answers.const_cnpj ||
        answers.log_cnpj ||
        answers.edu_cnpj ||
        answers.acad_cnpj ||
        answers.trade_cnpj ||
        answers.fac_cnpj ||
        answers.cnpj ||
        ''
      const inheritedFaturamento =
        answers.saude_1_1 ||
        answers.servicos_1_1 ||
        answers.industria_1_1 ||
        answers.varejo_1_1 ||
        answers.agro_1_1 ||
        answers.tech_1_1 ||
        answers.const_1_1 ||
        answers.log_1_1 ||
        answers.edu_1_1 ||
        answers.acad_1_1 ||
        answers.trade_1_1 ||
        answers.fac_1_1 ||
        answers.faturamentoAnual ||
        ''
      const inheritedRazaoSocial =
        answers.saude_razaoSocial ||
        answers.servicos_razaoSocial ||
        answers.industria_razaoSocial ||
        answers.varejo_razaoSocial ||
        answers.agro_razaoSocial ||
        answers.tech_razaoSocial ||
        answers.const_razaoSocial ||
        answers.log_razaoSocial ||
        answers.edu_razaoSocial ||
        answers.acad_razaoSocial ||
        answers.trade_razaoSocial ||
        answers.fac_razaoSocial ||
        answers.razaoSocial ||
        ''
      const inheritedRespondente =
        answers.saude_respondente ||
        answers.servicos_respondente ||
        answers.industria_respondente ||
        answers.varejo_respondente ||
        answers.agro_respondente ||
        answers.tech_respondente ||
        answers.const_respondente ||
        answers.log_respondente ||
        answers.edu_respondente ||
        answers.acad_respondente ||
        answers.trade_respondente ||
        answers.fac_respondente ||
        answers.respondente ||
        ''
      const inheritedCargo =
        answers.saude_cargo ||
        answers.servicos_cargo ||
        answers.industria_cargo ||
        answers.varejo_cargo ||
        answers.agro_cargo ||
        answers.tech_cargo ||
        answers.const_cargo ||
        answers.log_cargo ||
        answers.edu_cargo ||
        answers.acad_cargo ||
        answers.trade_cargo ||
        answers.fac_cargo ||
        answers.cargo ||
        ''

      // Verificar se o visitante escolheu previamente um plano no botão Selecionar Plano
      const memorizedPlan = getChosenPlan()

      // Ponto 4: Consolidar "Outro" nas respostas
      // Quando answers[qId] === 'outro' (case-insensitive) e existir answers[`${qId}_outro`] ou variante como SegmentoOutro,
      // consolidar como `Outro: ${texto}` no campo principal.
      const consolidatedAnswers: Record<string, string> = { ...answers }

      // Adicionar plano_escolhido em respostas para garantir redundância (Ponto 1)
      if (memorizedPlan) {
        consolidatedAnswers.plano_escolhido = memorizedPlan
      }

      // Consolidar perguntas com "Outro"
      for (const [qId, val] of Object.entries(answers)) {
        if (typeof val === 'string' && val.trim().toLowerCase() === 'outro') {
          // Procurar campos complementares: qId_outro, qIdOutro, ou `${qId}Outro`
          const outroText =
            answers[`${qId}_outro`]?.trim() ||
            answers[`${qId}Outro`]?.trim() ||
            (qId.endsWith('_segmento')
              ? answers[`${qId}Outro`]?.trim() || answers[`${qId}_outro`]?.trim()
              : '')
          if (outroText) {
            consolidatedAnswers[qId] = `Outro: ${outroText}`
          }
        }
      }

      const consolidatedCadastro = {
        ...cadastro,
        empresa: cadastro.empresa || inheritedRazaoSocial,
        nomeCompleto: cadastro.nomeCompleto || inheritedRespondente,
        cargo: inheritedCargo,
        cnpj: inheritedCnpj,
        faturamento: inheritedFaturamento,
        planoEscolhido: memorizedPlan || undefined,
      }

      // Preparar FormData único para create atômico com arquivos
      const formData = new FormData()
      formData.append('setor', sector.name)
      formData.append('setor_id', sector.id)
      formData.append('cadastro', JSON.stringify(consolidatedCadastro))
      formData.append('respostas', JSON.stringify(consolidatedAnswers))
      // Normalizar autorizacao_devolutiva para o formato aceito pelo schema
      let normalizedAutorizacao = autorizacaoDevolutiva
      if (autorizacaoDevolutiva === 'Sim') {
        normalizedAutorizacao = 'Sim, autorizo'
      } else if (autorizacaoDevolutiva === 'Não') {
        normalizedAutorizacao = 'Não autorizo'
      }
      if (normalizedAutorizacao) {
        formData.append('autorizacao_devolutiva', normalizedAutorizacao)
      }
      if (formatoInteresse) formData.append('formato_interesse', formatoInteresse)
      if (responsavelDocumentos) formData.append('responsavel_documentos', responsavelDocumentos)
      formData.append('status', 'novo')

      // Anexar apenas instâncias válidas de File com nome e tamanho > 0
      for (const file of files.contratoSocial) {
        if (file instanceof File && file.size > 0) {
          formData.append('contrato_social', file)
        }
      }
      for (const file of files.certificacoes) {
        if (file instanceof File && file.size > 0) {
          formData.append('certificacoes', file)
        }
      }
      for (const file of files.documentacaoAdicional) {
        if (file instanceof File && file.size > 0) {
          formData.append('documentacao_adicional', file)
        }
      }

      const created = await pb.collection('leads').create(formData)

      // Salvar estado da submissão no leadSession para habilitar o Cenário B em "Selecionar Plano"
      saveStoredLead({
        leadId: created.id,
        empresa: consolidatedCadastro.empresa,
        nomeCompleto: consolidatedCadastro.nomeCompleto,
        email: consolidatedCadastro.email,
        setor: sector.name,
        submittedAt: new Date().toISOString(),
        planoEscolhido: memorizedPlan || undefined,
        statusDevolutiva: 'aguardando',
      })

      setSubmittedId(created.id)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    } catch (error) {
      console.error('Erro na submissão do questionário:', error)
      const errorMsg = getErrorMessage(error)
      setSubmitError(errorMsg)
    } finally {
      setSubmitting(false)
    }
  }

  if (!sector) return null

  if (submittedId) {
    return (
      <div className="wizard-success">
        <CheckCircle2 aria-hidden="true" />
        <h1>Questionário Estratégico enviado com sucesso.</h1>
        <p>
          Obrigado, {cadastro.nomeCompleto.split(' ')[0] || 'executivo'}. Recebemos as respostas da
          empresa <strong>{cadastro.empresa}</strong> para o setor de <strong>{sector.name}</strong>
          .
        </p>
        <div className="wizard-success-message" role="status">
          <Clock3 aria-hidden="true" />
          <span>{RETURN_MESSAGE}</span>
        </div>
        <div className="wizard-success-actions">
          <Button className="conversion-button" asChild>
            <Link to="/">Voltar à página inicial</Link>
          </Button>
          <Button variant="outline" asChild>
            <Link to="/setores">Ver outros setores</Link>
          </Button>
        </div>
      </div>
    )
  }

  const stepTitles = [
    ...sections.map((section) => section.title),
    'Próximos Passos',
    'Documentação Adicional',
    'Cadastro',
  ]

  return (
    <div className="wizard-page">
      <section className="wizard-hero">
        <div className="site-container">
          <div className="wizard-hero-topline">
            <Link to="/setores" className="wizard-back-link">
              <ArrowLeft aria-hidden="true" /> Todos os setores
            </Link>
            <span className="wizard-hero-sector">SETOR · {sector.name.toUpperCase()}</span>
          </div>
          <h1>Questionário Estratégico</h1>
          <p>
            {sector.tagline} {answeredCount}/{totalQuestions} perguntas respondidas — o diagnóstico
            considera a realidade do setor de {sector.name}.
          </p>
        </div>
      </section>

      <section className="wizard-body">
        <div className="site-container wizard-layout">
          <aside className="wizard-progress" aria-label="Progresso do questionário">
            <div className="wizard-progress-head">
              <ClipboardList aria-hidden="true" />
              <span>ETAPAS</span>
            </div>
            <ol>
              {stepTitles.map((title, index) => {
                const complete = isStepComplete(index)
                // Regra de navegação solicitada pelo usuário:
                // 1. O usuário precisa poder IR E VOLTAR para qualquer etapa já iniciada (index <= highestReachedStep), inclusive parcialmente preenchida.
                // 2. Etapas futuras ainda não alcançadas (index > highestReachedStep) permanecem bloqueadas até as anteriores serem alcançadas/preenchidas.
                // 3. A barra lateral é totalmente clicável para as etapas acessíveis.
                const canNavigate = index <= highestReachedStep

                return (
                  <li
                    key={title}
                    className={`${index === step ? 'is-current' : complete ? 'is-done' : ''} ${
                      canNavigate ? 'is-clickable' : 'is-disabled'
                    }`}
                    onClick={() => {
                      if (!canNavigate) return
                      setStepErrors([])
                      setStep(index)
                      scrollToTop()
                    }}
                    role="button"
                    tabIndex={canNavigate ? 0 : -1}
                    aria-disabled={!canNavigate}
                    onKeyDown={(e) => {
                      if (!canNavigate) return
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault()
                        setStepErrors([])
                        setStep(index)
                        scrollToTop()
                      }
                    }}
                    aria-label={`Etapa ${index + 1}: ${title}${!canNavigate ? ' (bloqueada)' : ''}`}
                  >
                    <span className="wizard-progress-number">
                      {complete && index !== step ? (
                        <Check aria-hidden="true" />
                      ) : (
                        String(index + 1).padStart(2, '0')
                      )}
                    </span>
                    <span>{title}</span>
                  </li>
                )
              })}
            </ol>
            <div className="wizard-progress-bar">
              <div
                className="wizard-progress-bar-fill"
                style={{ width: `${((step + 1) / TOTAL_STEPS) * 100}%` }}
              />
            </div>
            <span className="wizard-progress-caption">
              Etapa {step + 1} de {TOTAL_STEPS}
            </span>
          </aside>

          <div className="wizard-panel" ref={formTopRef}>
            {/* Caixa Institucional VETOR MASTER */}
            <div className="mb-6 p-5 rounded-xl border border-[#0066CC] bg-[#EAF3FD] text-[#333333] space-y-3">
              <div className="p-3.5 rounded-lg border-2 border-[#0066CC] bg-white flex items-center gap-3 shadow-sm">
                <AlertTriangle className="w-5 h-5 text-[#0066CC] shrink-0" />
                <span className="text-xs sm:text-sm font-bold text-[#0066CC] uppercase tracking-wide">
                  TODAS AS PERGUNTAS DEVEM SER RESPONDIDAS PARA A ELABORAÇÃO COMPLETA DO DOSSIÊ
                  ESTRATÉGICO.
                </span>
              </div>
              <p className="text-sm sm:text-[15px] font-medium leading-relaxed">
                Este documento é a base para o nosso trabalho. Diferente de formulários comuns, este
                é um <strong>Dossiê Estratégico</strong>. Quanto mais precisas e transparentes forem
                suas respostas, mais cirúrgico será o plano de ação gerado pelo nosso sistema de
                Inteligência Estratégica
              </p>
              <p className="text-sm sm:text-[15px] font-medium leading-relaxed text-[#004f9f]">
                Não oferecemos teorias de gaveta. O Dossiê de Planejamento Estratégico é um raio-x
                cirúrgico da sua operação atual. Baseado nas suas respostas, você receberá um mapa
                claro apontando os gargalos que estão travando seu crescimento e as alavancas
                imediatas para proteger seu caixa e otimizar sua gestão.
              </p>
            </div>

            <header className="wizard-panel-header">
              <span className="wizard-panel-eyebrow">
                ETAPA {String(step + 1).padStart(2, '0')} / {String(TOTAL_STEPS).padStart(2, '0')}
              </span>
              <h2>
                Setor de {sector.name} — {stepTitles[step]}
              </h2>
              {currentSection && <p>{currentSection.subtitle}</p>}
              {step === nextStepsStep && (
                <p>
                  Autorização da devolutiva, formato de interesse e responsável pelos documentos.
                </p>
              )}
              {step === docsStep && (
                <p>
                  Anexe arquivos complementares que auxiliem a análise — relatórios gerenciais,
                  apresentações institucionais e indicadores específicos.
                </p>
              )}
              {step === cadastroStep && (
                <p>
                  Últimos dados para a equipe VETOR MASTER retornar com o agendamento da devolutiva.
                </p>
              )}
            </header>

            {stepErrors.length > 0 && (
              <div className="wizard-errors" role="alert">
                <AlertTriangle aria-hidden="true" />
                <ul>
                  {stepErrors.map((error) => (
                    <li key={error}>{error}</li>
                  ))}
                </ul>
              </div>
            )}

            {currentSection && (
              <div className="wizard-questions">
                {currentSection.questions.map((question) => (
                  <div className="wizard-question" key={question.id}>
                    <Label htmlFor={question.id}>{question.label}</Label>
                    {renderQuestionInput(question)}
                    {question.helpText ? (
                      <span className="wizard-help">{question.helpText}</span>
                    ) : null}
                  </div>
                ))}
              </div>
            )}

            {step === nextStepsStep && renderNextStepsStep()}
            {step === docsStep && renderFilesStep()}
            {step === cadastroStep && renderCadastroStep()}

            {submitError && (
              <div className="wizard-errors" role="alert">
                <X aria-hidden="true" />
                <span>{submitError}</span>
              </div>
            )}

            <footer className="wizard-nav">
              <Button
                variant="outline"
                onClick={handleBack}
                disabled={step === 0 || submitting}
                className="wizard-nav-back"
              >
                <ArrowLeft aria-hidden="true" /> Voltar
              </Button>

              {step < TOTAL_STEPS - 1 && (
                <Button className="conversion-button" onClick={handleNext} disabled={submitting}>
                  Avançar <ArrowRight aria-hidden="true" />
                </Button>
              )}

              {step === TOTAL_STEPS - 1 && (
                <Button className="conversion-button" onClick={handleSubmit} disabled={submitting}>
                  {submitting ? (
                    <>
                      <Loader2 className="wizard-spinner" aria-hidden="true" /> Enviando…
                    </>
                  ) : (
                    <>
                      Enviar questionário <Send aria-hidden="true" />
                    </>
                  )}
                </Button>
              )}
            </footer>
          </div>
        </div>
      </section>
    </div>
  )
}
