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
import {
  clearQuestionnaireDraft,
  loadQuestionnaireDraft,
  saveQuestionnaireDraft,
} from '@/lib/questionnaireDraft'
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
import { toast } from '@/hooks/use-toast'

const RETURN_MESSAGE =
  'Retorno da equipe em até 5 dias para agendar sua Sessão de Devolutiva de 45 minutos'

// Limites tolerantes para anexos (alinhados com PocketBase leads)
const MAX_FILE_SIZE_BYTES = 100 * 1024 * 1024 // 100 MB por arquivo
const MAX_FILES_PER_GROUP = 15

// Extensões comumente suportadas para anexos institucionais e executivos
const ALLOWED_EXTENSIONS = new Set([
  'pdf',
  'doc',
  'docx',
  'xls',
  'xlsx',
  'csv',
  'ppt',
  'pptx',
  'txt',
  'rtf',
  'odt',
  'ods',
  'odp',
  'jpg',
  'jpeg',
  'png',
  'webp',
  'gif',
  'bmp',
  'tiff',
  'svg',
  'zip',
  'rar',
  '7z',
])

function getFileExtension(filename: string): string {
  if (!filename || typeof filename !== 'string') return ''
  const parts = filename.split('.')
  return parts.length > 1 ? parts.pop()!.toLowerCase().trim() : ''
}

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
  const [draftBannerVisible, setDraftBannerVisible] = useState(false)
  const [draftSavedTime, setDraftSavedTime] = useState<string | null>(null)
  const formTopRef = useRef<HTMLDivElement>(null)
  const isRestoredRef = useRef(false)

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

  // Restaurar rascunho salvo ao carregar o questionário do setor
  useEffect(() => {
    if (!sectorId) return
    isRestoredRef.current = false
    const draft = loadQuestionnaireDraft(sectorId)
    if (draft) {
      const hasContent =
        Object.keys(draft.answers).length > 0 ||
        Boolean(draft.cadastro.nomeCompleto) ||
        Boolean(draft.cadastro.empresa) ||
        Boolean(draft.cadastro.email) ||
        Boolean(draft.cadastro.whatsapp) ||
        Boolean(draft.autorizacaoDevolutiva) ||
        Boolean(draft.formatoInteresse) ||
        Boolean(draft.responsavelDocumentos) ||
        draft.step > 0

      if (hasContent) {
        setStep(Math.min(draft.step, TOTAL_STEPS - 1))
        setHighestReachedStep(Math.min(draft.highestReachedStep, TOTAL_STEPS - 1))
        setAnswers(draft.answers || {})
        setCadastro(draft.cadastro || emptyCadastro)
        setAutorizacaoDevolutiva(draft.autorizacaoDevolutiva || '')
        setFormatoInteresse(draft.formatoInteresse || '')
        setResponsavelDocumentos(draft.responsavelDocumentos || '')
        setDraftBannerVisible(true)
        if (draft.savedAt) {
          try {
            const date = new Date(draft.savedAt)
            setDraftSavedTime(
              date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
            )
          } catch {
            setDraftSavedTime(null)
          }
        }
      }
    } else {
      setStep(0)
      setHighestReachedStep(0)
      setAnswers({})
      setCadastro(emptyCadastro)
      setAutorizacaoDevolutiva('')
      setFormatoInteresse('')
      setResponsavelDocumentos('')
      setDraftBannerVisible(false)
      setDraftSavedTime(null)
    }
    // Marcar como restaurado para liberar o auto-save subsequente
    setTimeout(() => {
      isRestoredRef.current = true
    }, 50)
  }, [sectorId])

  // Salvar automaticamente a cada alteração após restauração inicial
  useEffect(() => {
    if (!sectorId || submittedId || !isRestoredRef.current) return

    const hasAnyData =
      Object.keys(answers).length > 0 ||
      Boolean(cadastro.nomeCompleto) ||
      Boolean(cadastro.empresa) ||
      Boolean(cadastro.email) ||
      Boolean(cadastro.whatsapp) ||
      Boolean(autorizacaoDevolutiva) ||
      Boolean(formatoInteresse) ||
      Boolean(responsavelDocumentos) ||
      step > 0

    if (!hasAnyData) return

    saveQuestionnaireDraft({
      sectorId,
      step,
      highestReachedStep,
      answers,
      cadastro,
      autorizacaoDevolutiva,
      formatoInteresse,
      responsavelDocumentos,
    })
  }, [
    sectorId,
    step,
    highestReachedStep,
    answers,
    cadastro,
    autorizacaoDevolutiva,
    formatoInteresse,
    responsavelDocumentos,
    submittedId,
  ])

  function handleDiscardDraft() {
    if (!sectorId) return
    clearQuestionnaireDraft(sectorId)
    setAnswers({})
    setCadastro(emptyCadastro)
    setAutorizacaoDevolutiva('')
    setFormatoInteresse('')
    setResponsavelDocumentos('')
    setFiles({
      contratoSocial: [],
      certificacoes: [],
      documentacaoAdicional: [],
    })
    setStep(0)
    setHighestReachedStep(0)
    setStepErrors([])
    setDraftBannerVisible(false)
    setDraftSavedTime(null)
  }

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
    const rawFiles = Array.from(incoming)
    const validFiles: File[] = []
    const rejectedMessages: string[] = []

    for (const file of rawFiles) {
      if (!file || !(file instanceof File)) {
        continue
      }

      // Validação de arquivo corrompido / vazio
      if (file.size <= 0) {
        rejectedMessages.push(`"${file.name}": arquivo vazio (0 bytes).`)
        continue
      }

      // Validação de tamanho máximo
      if (file.size > MAX_FILE_SIZE_BYTES) {
        rejectedMessages.push(
          `"${file.name}": tamanho de ${formatFileSize(file.size)} excede o limite máximo permitido de 100 MB.`,
        )
        continue
      }

      // Validação tolerante de tipo/extensão
      const ext = getFileExtension(file.name)
      if (ext && !ALLOWED_EXTENSIONS.has(ext)) {
        rejectedMessages.push(
          `"${file.name}": extensão ".${ext}" não suportada. Formatos aceitos: PDF, DOC/DOCX, XLS/XLSX, CSV, Imagens e ZIP.`,
        )
        continue
      }

      validFiles.push(file)
    }

    if (rejectedMessages.length > 0) {
      const summary = rejectedMessages.slice(0, 3).join(' ')
      setStepErrors((prev) => [...prev, summary])
      toast({
        variant: 'destructive',
        title: 'Aviso nos arquivos selecionados',
        description: summary,
      })
    }

    if (validFiles.length > 0) {
      setFiles((prev) => {
        const existing = prev[group]
        const uniqueIncoming = validFiles.filter(
          (nf) => !existing.some((ef) => ef.name === nf.name && ef.size === nf.size),
        )
        const combined = [...existing, ...uniqueIncoming]
        if (combined.length > MAX_FILES_PER_GROUP) {
          toast({
            variant: 'destructive',
            title: 'Limite de arquivos atingido',
            description: `Permitido no máximo ${MAX_FILES_PER_GROUP} arquivos por campo. Apenas os ${MAX_FILES_PER_GROUP} primeiros foram mantidos.`,
          })
        }
        return {
          ...prev,
          [group]: combined.slice(0, MAX_FILES_PER_GROUP),
        }
      })
    }
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

        {draftBannerVisible && (
          <p className="text-xs text-amber-800 bg-amber-50 p-2.5 rounded-lg border border-amber-200">
            <strong>Atenção:</strong> Por motivos de segurança e limite de dados do navegador, os
            arquivos anexados não são salvos em rascunho local. Caso tenha adicionado anexos em uma
            sessão anterior e reiniciado o navegador, certifique-se de selecioná-los abaixo.
          </p>
        )}

        {groups.map((group) => (
          <div className="wizard-file-group" key={group.key}>
            {' '}
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
    try {
      const errors = validateCurrentStep()
      setStepErrors(errors)
      if (errors.length > 0 || !sector) return

      setSubmitting(true)
      setSubmitError('')

      // 1. Herdar CNPJ e Faturamento coletados nas etapas iniciais de qualquer um dos 12 setores
      const inheritedCnpj =
        (typeof answers.saude_cnpj === 'string' && answers.saude_cnpj) ||
        (typeof answers.servicos_cnpj === 'string' && answers.servicos_cnpj) ||
        (typeof answers.industria_cnpj === 'string' && answers.industria_cnpj) ||
        (typeof answers.varejo_cnpj === 'string' && answers.varejo_cnpj) ||
        (typeof answers.agro_cnpj === 'string' && answers.agro_cnpj) ||
        (typeof answers.tech_cnpj === 'string' && answers.tech_cnpj) ||
        (typeof answers.const_cnpj === 'string' && answers.const_cnpj) ||
        (typeof answers.log_cnpj === 'string' && answers.log_cnpj) ||
        (typeof answers.edu_cnpj === 'string' && answers.edu_cnpj) ||
        (typeof answers.acad_cnpj === 'string' && answers.acad_cnpj) ||
        (typeof answers.trade_cnpj === 'string' && answers.trade_cnpj) ||
        (typeof answers.fac_cnpj === 'string' && answers.fac_cnpj) ||
        (typeof answers.cnpj === 'string' && answers.cnpj) ||
        ''
      const inheritedFaturamento =
        (typeof answers.saude_1_1 === 'string' && answers.saude_1_1) ||
        (typeof answers.servicos_1_1 === 'string' && answers.servicos_1_1) ||
        (typeof answers.industria_1_1 === 'string' && answers.industria_1_1) ||
        (typeof answers.varejo_1_1 === 'string' && answers.varejo_1_1) ||
        (typeof answers.agro_1_1 === 'string' && answers.agro_1_1) ||
        (typeof answers.tech_1_1 === 'string' && answers.tech_1_1) ||
        (typeof answers.const_1_1 === 'string' && answers.const_1_1) ||
        (typeof answers.log_1_1 === 'string' && answers.log_1_1) ||
        (typeof answers.edu_1_1 === 'string' && answers.edu_1_1) ||
        (typeof answers.acad_1_1 === 'string' && answers.acad_1_1) ||
        (typeof answers.trade_1_1 === 'string' && answers.trade_1_1) ||
        (typeof answers.fac_1_1 === 'string' && answers.fac_1_1) ||
        (typeof answers.faturamentoAnual === 'string' && answers.faturamentoAnual) ||
        ''
      const inheritedRazaoSocial =
        (typeof answers.saude_razaoSocial === 'string' && answers.saude_razaoSocial) ||
        (typeof answers.servicos_razaoSocial === 'string' && answers.servicos_razaoSocial) ||
        (typeof answers.industria_razaoSocial === 'string' && answers.industria_razaoSocial) ||
        (typeof answers.varejo_razaoSocial === 'string' && answers.varejo_razaoSocial) ||
        (typeof answers.agro_razaoSocial === 'string' && answers.agro_razaoSocial) ||
        (typeof answers.tech_razaoSocial === 'string' && answers.tech_razaoSocial) ||
        (typeof answers.const_razaoSocial === 'string' && answers.const_razaoSocial) ||
        (typeof answers.log_razaoSocial === 'string' && answers.log_razaoSocial) ||
        (typeof answers.edu_razaoSocial === 'string' && answers.edu_razaoSocial) ||
        (typeof answers.acad_razaoSocial === 'string' && answers.acad_razaoSocial) ||
        (typeof answers.trade_razaoSocial === 'string' && answers.trade_razaoSocial) ||
        (typeof answers.fac_razaoSocial === 'string' && answers.fac_razaoSocial) ||
        (typeof answers.razaoSocial === 'string' && answers.razaoSocial) ||
        ''
      const inheritedRespondente =
        (typeof answers.saude_respondente === 'string' && answers.saude_respondente) ||
        (typeof answers.servicos_respondente === 'string' && answers.servicos_respondente) ||
        (typeof answers.industria_respondente === 'string' && answers.industria_respondente) ||
        (typeof answers.varejo_respondente === 'string' && answers.varejo_respondente) ||
        (typeof answers.agro_respondente === 'string' && answers.agro_respondente) ||
        (typeof answers.tech_respondente === 'string' && answers.tech_respondente) ||
        (typeof answers.const_respondente === 'string' && answers.const_respondente) ||
        (typeof answers.log_respondente === 'string' && answers.log_respondente) ||
        (typeof answers.edu_respondente === 'string' && answers.edu_respondente) ||
        (typeof answers.acad_respondente === 'string' && answers.acad_respondente) ||
        (typeof answers.trade_respondente === 'string' && answers.trade_respondente) ||
        (typeof answers.fac_respondente === 'string' && answers.fac_respondente) ||
        (typeof answers.respondente === 'string' && answers.respondente) ||
        ''
      const inheritedCargo =
        (typeof answers.saude_cargo === 'string' && answers.saude_cargo) ||
        (typeof answers.servicos_cargo === 'string' && answers.servicos_cargo) ||
        (typeof answers.industria_cargo === 'string' && answers.industria_cargo) ||
        (typeof answers.varejo_cargo === 'string' && answers.varejo_cargo) ||
        (typeof answers.agro_cargo === 'string' && answers.agro_cargo) ||
        (typeof answers.tech_cargo === 'string' && answers.tech_cargo) ||
        (typeof answers.const_cargo === 'string' && answers.const_cargo) ||
        (typeof answers.log_cargo === 'string' && answers.log_cargo) ||
        (typeof answers.edu_cargo === 'string' && answers.edu_cargo) ||
        (typeof answers.acad_cargo === 'string' && answers.acad_cargo) ||
        (typeof answers.trade_cargo === 'string' && answers.trade_cargo) ||
        (typeof answers.fac_cargo === 'string' && answers.fac_cargo) ||
        (typeof answers.cargo === 'string' && answers.cargo) ||
        ''

      // Verificar se o visitante escolheu previamente um plano no botão Selecionar Plano
      let memorizedPlan: string | null = null
      try {
        memorizedPlan = getChosenPlan()
      } catch (err) {
        console.warn('Não foi possível recuperar o plano escolhido da sessão:', err)
      }

      // 2. Consolidar "Outro" nas respostas de forma segura e tolerante
      const consolidatedAnswers: Record<string, string> = {}
      for (const [key, rawVal] of Object.entries(answers)) {
        if (rawVal === undefined || rawVal === null) continue
        consolidatedAnswers[key] = String(rawVal)
      }

      if (memorizedPlan) {
        consolidatedAnswers.plano_escolhido = memorizedPlan
      }

      // Consolidar perguntas com "Outro"
      for (const [qId, val] of Object.entries(answers)) {
        if (typeof val === 'string' && val.trim().toLowerCase() === 'outro') {
          const outroText =
            (typeof answers[`${qId}_outro`] === 'string' && answers[`${qId}_outro`]?.trim()) ||
            (typeof answers[`${qId}Outro`] === 'string' && answers[`${qId}Outro`]?.trim()) ||
            (qId.endsWith('_segmento')
              ? (typeof answers[`${qId}Outro`] === 'string' && answers[`${qId}Outro`]?.trim()) ||
                (typeof answers[`${qId}_outro`] === 'string' && answers[`${qId}_outro`]?.trim())
              : '')
          if (outroText) {
            consolidatedAnswers[qId] = `Outro: ${outroText}`
          }
        }
      }

      const consolidatedCadastro = {
        nomeCompleto: cadastro.nomeCompleto || inheritedRespondente || '',
        empresa: cadastro.empresa || inheritedRazaoSocial || '',
        email: cadastro.email || '',
        whatsapp: cadastro.whatsapp || '',
        cargo: inheritedCargo || '',
        cnpj: inheritedCnpj || '',
        faturamento: inheritedFaturamento || '',
        planoEscolhido: memorizedPlan || undefined,
      }

      // 3. Validação preventiva e filtragem dos arquivos antes de montar o FormData
      const sanitizeFileList = (list: File[], groupLabel: string): File[] => {
        const result: File[] = []
        for (const file of list) {
          if (!file || !(file instanceof File)) continue
          if (file.size <= 0) {
            console.warn(`Arquivo ignorado (vazio): ${file.name} em ${groupLabel}`)
            continue
          }
          if (file.size > MAX_FILE_SIZE_BYTES) {
            throw new Error(
              `O arquivo "${file.name}" tem ${formatFileSize(file.size)}, acima do limite máximo suportado de 100 MB. Remova-o ou selecione uma versão menor para prosseguir.`,
            )
          }
          result.push(file)
        }
        return result.slice(0, MAX_FILES_PER_GROUP)
      }

      const cleanContratoSocial = sanitizeFileList(files.contratoSocial, 'Contrato Social')
      const cleanCertificacoes = sanitizeFileList(files.certificacoes, 'Certificações')
      const cleanDocAdicional = sanitizeFileList(
        files.documentacaoAdicional,
        'Documentação Adicional',
      )

      // 4. Preparar FormData único para create atômico com arquivos
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

      // Anexar apenas os arquivos sanitizados
      for (const file of cleanContratoSocial) {
        formData.append('contrato_social', file)
      }
      for (const file of cleanCertificacoes) {
        formData.append('certificacoes', file)
      }
      for (const file of cleanDocAdicional) {
        formData.append('documentacao_adicional', file)
      }

      const created = await pb.collection('leads').create(formData)

      // Limpar o rascunho do setor após envio bem-sucedido
      try {
        clearQuestionnaireDraft(sector.id)
      } catch (draftErr) {
        console.warn('Aviso ao limpar rascunho:', draftErr)
      }
      setDraftBannerVisible(false)

      // Salvar estado da submissão no leadSession para habilitar o Cenário B em "Selecionar Plano"
      try {
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
      } catch (sessionErr) {
        console.warn('Aviso ao salvar sessão do lead:', sessionErr)
      }

      toast({
        title: 'Questionário enviado com sucesso!',
        description: 'Recebemos as respostas da sua empresa e os documentos anexados.',
      })

      setSubmittedId(created.id)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    } catch (error: any) {
      console.error('Erro na submissão do questionário:', error)
      const errorMsg =
        error?.message && !error?.status
          ? error.message
          : getErrorMessage(error) ||
            'Ocorreu um erro ao enviar o questionário. Verifique os campos e tente novamente.'

      setSubmitError(errorMsg)
      toast({
        variant: 'destructive',
        title: 'Não foi possível enviar o formulário',
        description: errorMsg,
      })
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
        {cadastro.email && (
          <p className="text-xs text-muted-foreground mt-2">
            Enviamos uma confirmação automática para <strong>{cadastro.email}</strong>.
          </p>
        )}
        {(files.contratoSocial.length > 0 ||
          files.certificacoes.length > 0 ||
          files.documentacaoAdicional.length > 0) && (
          <p className="text-xs text-emerald-700 bg-emerald-50 py-1.5 px-3 rounded-lg border border-emerald-200 mt-2 inline-block">
            ✓{' '}
            {files.contratoSocial.length +
              files.certificacoes.length +
              files.documentacaoAdicional.length}{' '}
            documento(s) anexado(s) e recebido(s) com sucesso.
          </p>
        )}
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
            {/* Aviso discreto de rascunho restaurado com opção de reiniciar */}
            {draftBannerVisible && (
              <div className="mb-6 p-4 rounded-xl border border-emerald-300 bg-emerald-50 text-emerald-900 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-sm animate-in fade-in duration-300">
                <div className="flex items-start sm:items-center gap-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5 sm:mt-0" />
                  <div className="text-xs sm:text-sm leading-relaxed">
                    <span className="font-semibold text-emerald-950">
                      Rascunho recuperado com sucesso.
                    </span>{' '}
                    Restauramos o preenchimento salvo anteriormente neste navegador
                    {draftSavedTime ? ` (às ${draftSavedTime})` : ''}.
                  </div>
                </div>
                <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={handleDiscardDraft}
                    className="h-8 text-xs font-semibold text-red-600 hover:text-red-700 hover:bg-red-50 border border-red-200"
                    title="Apagar respostas salvas e reiniciar questionário"
                  >
                    <Trash2 className="w-3.5 h-3.5 mr-1" />
                    Começar do zero
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => setDraftBannerVisible(false)}
                    className="h-8 text-xs text-emerald-700 hover:text-emerald-900 hover:bg-emerald-100/60"
                    title="Fechar aviso"
                  >
                    Entendido
                  </Button>
                </div>
              </div>
            )}

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
