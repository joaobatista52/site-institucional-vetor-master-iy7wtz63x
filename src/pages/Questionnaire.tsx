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
import { revenueRanges } from '@/data/questionnaireBase'
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
  faturamento: string
  cnpj: string
}

const emptyCadastro: CadastroData = {
  nomeCompleto: '',
  empresa: '',
  email: '',
  whatsapp: '',
  faturamento: '',
  cnpj: '',
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
  return value
    .replace(/\D/g, '')
    .slice(0, 11)
    .replace(/(\d{2})(\d)/, '($1) $2')
    .replace(/(\d{5})(\d)/, '$1-$2')
}

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

function isValidCNPJ(cnpj: string): boolean {
  const digits = cnpj.replace(/\D/g, '')
  return digits.length === 14
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

  function addFiles(group: FileGroup, incoming: FileList | null) {
    if (!incoming || incoming.length === 0) return
    setFiles((prev) => ({
      ...prev,
      [group]: [...prev[group], ...Array.from(incoming)].slice(0, 10),
    }))
  }

  function removeFile(group: FileGroup, index: number) {
    setFiles((prev) => ({ ...prev, [group]: prev[group].filter((_, i) => i !== index) }))
  }

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
      if (!isValidEmail(cadastro.email)) errors.push('Informe um e-mail válido.')
      if (cadastro.whatsapp.replace(/\D/g, '').length < 10)
        errors.push('Informe um WhatsApp válido com DDD.')
      if (!cadastro.faturamento) errors.push('Selecione a faixa de faturamento.')
      if (!isValidCNPJ(cadastro.cnpj)) errors.push('Informe um CNPJ válido (14 dígitos).')
      return errors
    }

    return errors
  }

  function handleNext() {
    const errors = validateCurrentStep()
    setStepErrors(errors)
    if (errors.length > 0) return
    setStepErrors([])
    setStep((prev) => Math.min(prev + 1, TOTAL_STEPS - 1))
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

    return (
      <Input
        id={question.id}
        value={value}
        onChange={(event) => setAnswer(question.id, event.target.value)}
        placeholder={question.placeholder}
      />
    )
  }

  function renderFilesStep() {
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
        title: 'Documentação adicional (opcional, mas muito importante)',
        help: 'Relatórios gerenciais, apresentações institucionais, indicadores específicos e demais arquivos que auxiliem a análise (PDF, XLS, DOC, JPG, PNG).',
      },
    ]

    return (
      <div className="wizard-files">
        {groups.map((group) => (
          <div className="wizard-file-group" key={group.key}>
            <div className="wizard-file-group-head">
              <Paperclip aria-hidden="true" />
              <div>
                <h4>{group.title}</h4>
                <p>{group.help}</p>
              </div>
            </div>
            <label className="wizard-file-dropzone">
              <FileUp aria-hidden="true" />
              <span>Clique para anexar arquivos</span>
              <input
                type="file"
                multiple
                onChange={(event) => {
                  addFiles(group.key, event.target.files)
                  event.target.value = ''
                }}
              />
            </label>
            {files[group.key].length > 0 && (
              <ul className="wizard-file-list">
                {files[group.key].map((file, index) => (
                  <li key={`${file.name}-${index}`}>
                    <span>{file.name}</span>
                    <button
                      type="button"
                      onClick={() => removeFile(group.key, index)}
                      aria-label={`Remover ${file.name}`}
                    >
                      <Trash2 aria-hidden="true" />
                    </button>
                  </li>
                ))}
              </ul>
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
          <h4>Autorização da Devolutiva de 45 minutos</h4>
          <p>
            A Sessão de Devolutiva é uma reunião executiva de 45 minutos em que a equipe VETOR
            MASTER apresenta o Diagnóstico Estratégico e o plano de ação. Autoriza o contato para
            agendamento?
          </p>
          <div className="wizard-choice-row">
            {['Sim, autorizo', 'Não autorizo'].map((option) => (
              <button
                key={option}
                type="button"
                className={`wizard-choice ${autorizacaoDevolutiva === option ? 'is-selected' : ''}`}
                onClick={() => setAutorizacaoDevolutiva(option)}
              >
                {option}
              </button>
            ))}
          </div>
        </div>

        <div className="wizard-next-block">
          <h4>Formato de interesse</h4>
          <p>
            Qual modelo de atuação faz mais sentido para a sua empresa neste momento? A escolha
            orienta a leitura do diagnóstico, mas não impede a mudança depois da devolutiva.
          </p>
          <div className="wizard-choice-row">
            {engagementFormats.map((format) => (
              <button
                key={format}
                type="button"
                className={`wizard-choice ${formatoInteresse === format ? 'is-selected' : ''}`}
                onClick={() => setFormatoInteresse(format)}
              >
                {format}
              </button>
            ))}
          </div>
        </div>

        <div className="wizard-next-block">
          <h4>Responsável pelos documentos</h4>
          <p>
            Informe quem responde pela documentação anexada (contrato social, certificações e
            relatórios), caso a equipe precise de complementos.
          </p>
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
            <Label htmlFor="cadastro-whatsapp">WhatsApp *</Label>
            <Input
              id="cadastro-whatsapp"
              value={cadastro.whatsapp}
              onChange={(event) =>
                setCadastro((prev) => ({ ...prev, whatsapp: maskPhone(event.target.value) }))
              }
              placeholder="(00) 00000-0000"
            />
          </div>
          <div className="wizard-field">
            <Label htmlFor="cadastro-faturamento">Faturamento anual *</Label>
            <Select
              value={cadastro.faturamento}
              onValueChange={(next) => setCadastro((prev) => ({ ...prev, faturamento: next }))}
            >
              <SelectTrigger id="cadastro-faturamento">
                <SelectValue placeholder="Selecione a faixa de faturamento" />
              </SelectTrigger>
              <SelectContent>
                {revenueRanges.map((range) => (
                  <SelectItem key={range} value={range}>
                    {range}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="wizard-field">
            <Label htmlFor="cadastro-cnpj">CNPJ *</Label>
            <Input
              id="cadastro-cnpj"
              value={cadastro.cnpj}
              onChange={(event) =>
                setCadastro((prev) => ({ ...prev, cnpj: maskCNPJ(event.target.value) }))
              }
              placeholder="00.000.000/0000-00"
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
      const payload: Record<string, unknown> = {
        setor: sector.name,
        setor_id: sector.id,
        cadastro: JSON.stringify(cadastro),
        respostas: JSON.stringify(answers),
        autorizacao_devolutiva: autorizacaoDevolutiva,
        formato_interesse: formatoInteresse,
        responsavel_documentos: responsavelDocumentos,
        status: 'novo',
      }

      const created = await pb.collection('leads').create(payload)

      const uploads = [
        ...files.contratoSocial.map((file) => ({ file, field: 'contrato_social' })),
        ...files.certificacoes.map((file) => ({ file, field: 'certificacoes' })),
        ...files.documentacaoAdicional.map((file) => ({ file, field: 'documentacao_adicional' })),
      ]
      if (uploads.length > 0) {
        const formData = new FormData()
        for (const upload of uploads) formData.append(upload.field, upload.file)
        await pb.collection('leads').update(created.id, formData)
      }

      setSubmittedId(created.id)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    } catch (error) {
      setSubmitError(getErrorMessage(error))
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
              {stepTitles.map((title, index) => (
                <li
                  key={title}
                  className={index === step ? 'is-current' : index < step ? 'is-done' : ''}
                >
                  <span className="wizard-progress-number">
                    {index < step ? (
                      <Check aria-hidden="true" />
                    ) : (
                      String(index + 1).padStart(2, '0')
                    )}
                  </span>
                  <span>{title}</span>
                </li>
              ))}
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
            <header className="wizard-panel-header">
              <span className="wizard-panel-eyebrow">
                ETAPA {String(step + 1).padStart(2, '0')} / {String(TOTAL_STEPS).padStart(2, '0')}
              </span>
              <h2>{stepTitles[step]}</h2>
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
                    <Label htmlFor={question.id}>
                      {question.label}
                      {question.required ? <span className="wizard-required"> *</span> : null}
                    </Label>
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
