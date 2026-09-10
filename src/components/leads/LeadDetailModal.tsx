import { useState } from 'react'
import type { LeadRecord, LeadStatus } from '@/services/leads'
import {
  parseLeadCadastro,
  parseLeadRespostas,
  getFileUrl,
  updateLeadStatus,
} from '@/services/leads'
import { isAuthError } from '@/lib/pocketbase/errors'
import { getQuestionnaireSections } from '@/data/questionnaireSectors'
import { findSector } from '@/data/sectors'
import {
  validateLeadForExport,
  exportDossieAsJson,
  downloadAllLeadAttachmentsZip,
  type DossieValidationResult,
} from '@/services/dossieExport'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Building2,
  Calendar,
  Clock,
  Download,
  FileText,
  Mail,
  Phone,
  User,
  DollarSign,
  Briefcase,
  Paperclip,
  CheckCircle2,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  FileJson,
  Archive,
  Loader2,
  AlertTriangle,
  Check,
} from 'lucide-react'

interface LeadDetailModalProps {
  lead: LeadRecord | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onStatusUpdated?: (updatedLead: LeadRecord) => void
  onAuthError?: () => void
}

const statusOptions: { value: LeadStatus; label: string; color: string }[] = [
  { value: 'novo', label: 'Novo', color: 'bg-blue-100 text-blue-800 border-blue-300' },
  {
    value: 'em_analise',
    label: 'Em Análise',
    color: 'bg-amber-100 text-amber-800 border-amber-300',
  },
  {
    value: 'devolutiva_agendada',
    label: 'Devolutiva Agendada',
    color: 'bg-purple-100 text-purple-800 border-purple-300',
  },
  {
    value: 'concluido',
    label: 'Concluído',
    color: 'bg-emerald-100 text-emerald-800 border-emerald-300',
  },
  { value: 'descartado', label: 'Descartado', color: 'bg-gray-100 text-gray-700 border-gray-300' },
]

export function LeadDetailModal({
  lead,
  open,
  onOpenChange,
  onStatusUpdated,
  onAuthError,
}: LeadDetailModalProps) {
  const [updatingStatus, setUpdatingStatus] = useState(false)
  const [collapsedSections, setCollapsedSections] = useState<Record<string, boolean>>({})
  const [statusError, setStatusError] = useState<string | null>(null)

  // Estados de exportação de dossiê e download em lote
  const [exportingJson, setExportingJson] = useState(false)
  const [exportingZip, setExportingZip] = useState(false)
  const [exportProgressText, setExportProgressText] = useState<string | null>(null)
  const [exportSuccessMessage, setExportSuccessMessage] = useState<string | null>(null)
  const [exportErrors, setExportErrors] = useState<string[]>([])

  if (!lead) return null

  const cadastro = parseLeadCadastro(lead) as Record<string, unknown>
  const respostas = parseLeadRespostas(lead) as Record<string, unknown>
  const sectorInfo = findSector(lead.setor_id)
  const sections = getQuestionnaireSections(lead.setor_id)

  const leadOrigem = typeof cadastro.origem === 'string' ? cadastro.origem : ''
  const isSaasWaitlist =
    leadOrigem === 'Lista de Prioridade SaaS' ||
    cadastro.origemTipo === 'saas_prioridade' ||
    respostas.origem === 'Lista de Prioridade SaaS'

  const createdDate = lead.created
    ? new Date(lead.created).toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      })
    : 'Data não registrada'

  const handleStatusChange = async (newStatus: LeadStatus) => {
    try {
      setUpdatingStatus(true)
      setStatusError(null)
      const updated = await updateLeadStatus(lead.id, newStatus)
      if (onStatusUpdated) onStatusUpdated(updated)
    } catch (err) {
      console.error('Falha ao atualizar status', err)
      if (isAuthError(err)) {
        if (onAuthError) {
          onAuthError()
          return
        }
      }
      setStatusError('Erro ao atualizar status. Verifique sua permissão.')
    } finally {
      setUpdatingStatus(false)
    }
  }

  const toggleSection = (id: string) => {
    setCollapsedSections((prev) => ({
      ...prev,
      [id]: !prev[id],
    }))
  }

  // Anexos
  const contratoFiles = Array.isArray(lead.contrato_social)
    ? lead.contrato_social
    : lead.contrato_social
      ? [lead.contrato_social]
      : []

  const certFiles = Array.isArray(lead.certificacoes)
    ? lead.certificacoes
    : lead.certificacoes
      ? [lead.certificacoes]
      : []

  const docFiles = Array.isArray(lead.documentacao_adicional)
    ? lead.documentacao_adicional
    : lead.documentacao_adicional
      ? [lead.documentacao_adicional]
      : []

  const totalFiles = contratoFiles.length + certFiles.length + docFiles.length

  // Ação de exportar Dossiê em JSON
  const handleExportJson = async () => {
    try {
      setExportErrors([])
      setExportSuccessMessage(null)

      if (isSaasWaitlist) {
        setExportErrors([
          'O Dossiê Estratégico Schema V6.7 não se aplica a inscrições da "Lista de Prioridade SaaS" (apenas a questionários diagnósticos completos de 72h). Os dados deste lead estão exibidos diretamente na tela.',
        ])
        return
      }

      // Validação prévia
      const validation = validateLeadForExport(lead)
      if (!validation.valid) {
        setExportErrors(validation.errors)
        return
      }

      setExportingJson(true)
      setExportProgressText('Iniciando geração do dossiê JSON...')

      const result = await exportDossieAsJson(lead, (msg) => {
        setExportProgressText(msg)
      })

      setExportSuccessMessage(`Dossiê exportado com sucesso: "${result.filename}"`)
    } catch (err: unknown) {
      console.error('Erro na exportação do dossiê:', err)
      const msg = err instanceof Error ? err.message : 'Falha ao gerar dossiê JSON.'
      setExportErrors([msg])
    } finally {
      setExportingJson(false)
      setExportProgressText(null)
    }
  }

  // Ação de baixar todos os anexos em lote (ZIP)
  const handleDownloadAllAttachments = async () => {
    try {
      setExportErrors([])
      setExportSuccessMessage(null)

      if (totalFiles === 0) {
        setExportErrors(['Este lead não possui nenhum documento ou anexo para baixar.'])
        return
      }

      setExportingZip(true)
      setExportProgressText('Iniciando pacote de anexos em lote...')

      const result = await downloadAllLeadAttachmentsZip(lead, (msg) => {
        setExportProgressText(msg)
      })

      setExportSuccessMessage(
        `Todos os ${result.totalFiles} anexos foram compactados e baixados: "${result.zipFilename}"`,
      )
    } catch (err: unknown) {
      console.error('Erro ao baixar anexos em lote:', err)
      const msg = err instanceof Error ? err.message : 'Falha ao baixar anexos.'
      setExportErrors([msg])
    } finally {
      setExportingZip(false)
      setExportProgressText(null)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto p-0 gap-0 bg-[#FBFDFF] border-[#0066CC]/20 text-[#333333]">
        {/* Cabeçalho */}
        <DialogHeader className="p-6 bg-white border-b border-gray-200 sticky top-0 z-10 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                {isSaasWaitlist ? (
                  <Badge className="bg-[#22B14C] hover:bg-[#1ea144] text-white border-transparent font-bold">
                    Origem: Lista de Prioridade SaaS
                  </Badge>
                ) : (
                  <Badge
                    variant="outline"
                    className="bg-gray-100 text-gray-700 border-gray-200 font-medium"
                  >
                    Origem: Questionário Estratégico
                  </Badge>
                )}
                <Badge
                  variant="outline"
                  className="bg-[#0066CC]/10 text-[#0066CC] border-[#0066CC]/30 font-semibold"
                >
                  {lead.setor || sectorInfo?.name || 'Setor não especificado'}
                </Badge>
                <Badge className="bg-[#0066CC] text-white border-transparent font-medium hover:bg-[#0055b3]">
                  Plano:{' '}
                  {(typeof cadastro.planoEscolhido === 'string' && cadastro.planoEscolhido) ||
                    (respostas.plano_escolhido as string) ||
                    (isSaasWaitlist ? 'SaaS (R$ 1.190/mês)' : 'Não especificado')}
                </Badge>
                <span className="text-xs text-gray-500 flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" />
                  Recebido em {createdDate}
                </span>
              </div>
              <DialogTitle className="text-2xl font-bold text-[#333333] flex items-center gap-2">
                <span>
                  {(typeof cadastro.empresa === 'string' && cadastro.empresa) ||
                    'Empresa não informada'}
                </span>
              </DialogTitle>{' '}
              <DialogDescription className="text-sm text-gray-600 mt-0.5">
                Contato principal:{' '}
                <strong className="text-gray-900">
                  {(typeof cadastro.nomeCompleto === 'string' && cadastro.nomeCompleto) ||
                    'Não informado'}
                </strong>
                {cadastro.cargo ? ` (${cadastro.cargo})` : ''}
              </DialogDescription>
            </div>

            {/* Controle de Status */}
            <div className="flex items-center gap-2 shrink-0">
              <span className="text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Status:
              </span>
              <Select
                value={lead.status || 'novo'}
                onValueChange={(val) => handleStatusChange(val as LeadStatus)}
                disabled={updatingStatus}
              >
                <SelectTrigger className="w-[180px] h-9 text-xs font-medium bg-white border-gray-300">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {statusOptions.map((opt) => (
                    <SelectItem key={opt.value} value={opt.value}>
                      <span className="flex items-center gap-1.5">{opt.label}</span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </DialogHeader>

        {/* Corpo com abas de informação */}
        <div className="p-6 space-y-6">
          {statusError && (
            <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-lg">
              {statusError}
            </div>
          )}

          {/* Barra de Ações Rápidas de Exportação */}
          <div className="bg-white rounded-xl border border-[#0066CC]/20 p-4 shadow-sm bg-gradient-to-r from-white via-sky-50/30 to-emerald-50/20">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div>
                <span className="text-xs font-bold text-[#0066CC] uppercase tracking-wider block">
                  {isSaasWaitlist
                    ? 'Origem: Lista de Prioridade SaaS'
                    : 'Exportação & Pacote Executivo · Schema V6.7'}
                </span>
                <p className="text-xs text-gray-600 mt-0.5">
                  {isSaasWaitlist
                    ? 'Lead registrado para aviso de abertura do nível SaaS com acesso antecipado e condição especial de fundador. O Dossiê Schema V6.7 não se aplica a este formato.'
                    : 'Gere o dossiê oficial enriquecido com o dicionário de perguntas e hashes SHA-256 ou baixe os anexos em lote.'}
                </p>
              </div>

              <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap">
                {!isSaasWaitlist ? (
                  <Button
                    onClick={handleExportJson}
                    disabled={exportingJson || exportingZip}
                    className="bg-[#0066CC] hover:bg-[#0055b3] text-white text-xs font-semibold h-9 shadow-sm"
                    title="Gera arquivo JSON conforme especificação Schema V6.7 v1.0"
                  >
                    {exportingJson ? (
                      <>
                        <Loader2 className="w-3.5 h-3.5 mr-1.5 animate-spin" />
                        Exportando JSON...
                      </>
                    ) : (
                      <>
                        <FileJson className="w-3.5 h-3.5 mr-1.5" />
                        Exportar dossiê (JSON)
                      </>
                    )}
                  </Button>
                ) : (
                  <Badge className="bg-[#22B14C] text-white text-xs font-bold py-1.5 px-3">
                    Acesso de Fundador Solicitado
                  </Badge>
                )}

                <Button
                  variant="outline"
                  onClick={handleDownloadAllAttachments}
                  disabled={exportingJson || exportingZip || totalFiles === 0}
                  className="border-[#22B14C]/40 text-[#22B14C] hover:bg-[#22B14C]/10 text-xs font-semibold h-9 bg-white"
                  title={
                    totalFiles === 0
                      ? 'Nenhum anexo disponível para download'
                      : `Baixa os ${totalFiles} arquivo(s) em pacote compactado ZIP`
                  }
                >
                  {exportingZip ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 mr-1.5 animate-spin" />
                      Baixando lote...
                    </>
                  ) : (
                    <>
                      <Archive className="w-3.5 h-3.5 mr-1.5" />
                      Baixar anexos ({totalFiles})
                    </>
                  )}
                </Button>
              </div>
            </div>

            {/* Progresso de download/exportação */}
            {exportProgressText && (
              <div className="mt-3 pt-3 border-t border-gray-200/60 flex items-center gap-2 text-xs text-[#0066CC] font-medium animate-pulse">
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                <span>{exportProgressText}</span>
              </div>
            )}

            {/* Sucesso na exportação */}
            {exportSuccessMessage && (
              <div className="mt-3 pt-3 border-t border-emerald-200 flex items-center justify-between gap-2 text-xs text-emerald-800 bg-emerald-50/80 p-2.5 rounded-lg">
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-[#22B14C] shrink-0" />
                  <span>{exportSuccessMessage}</span>
                </div>
                <button
                  type="button"
                  onClick={() => setExportSuccessMessage(null)}
                  className="text-gray-400 hover:text-gray-600 text-xs font-bold px-1"
                >
                  ✕
                </button>
              </div>
            )}

            {/* Erros / Alertas de validação prévia */}
            {exportErrors.length > 0 && (
              <div className="mt-3 pt-3 border-t border-red-200 bg-red-50/90 p-3 rounded-lg text-xs text-red-800 space-y-1">
                <div className="flex items-center gap-1.5 font-bold text-red-900 mb-1">
                  <AlertTriangle className="w-4 h-4 text-red-600 shrink-0" />
                  <span>Atenção na validação prévia da exportação:</span>
                </div>
                <ul className="list-disc list-inside space-y-0.5 pl-1">
                  {exportErrors.map((err, i) => (
                    <li key={i}>{err}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
          {/* 1. Card de Informações Cadastrais */}
          <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
            <h3 className="text-sm font-bold text-[#0066CC] uppercase tracking-wider mb-4 flex items-center gap-2">
              <User className="w-4 h-4" /> Dados de Cadastro do Respondente
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
              <div className="flex items-start gap-2.5">
                <User className="w-4 h-4 text-gray-400 mt-0.5 shrink-0" />
                <div>
                  <span className="text-xs text-gray-500 block">Nome do Executivo</span>
                  <span className="font-medium text-gray-900">
                    {(typeof cadastro.nomeCompleto === 'string' && cadastro.nomeCompleto) || '—'}
                  </span>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <Building2 className="w-4 h-4 text-gray-400 mt-0.5 shrink-0" />
                <div>
                  <span className="text-xs text-gray-500 block">Empresa / Razão Social</span>
                  <span className="font-medium text-gray-900">
                    {(typeof cadastro.empresa === 'string' && cadastro.empresa) || '—'}
                  </span>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <Mail className="w-4 h-4 text-gray-400 mt-0.5 shrink-0" />
                <div>
                  <span className="text-xs text-gray-500 block">E-mail Corporativo</span>
                  {typeof cadastro.email === 'string' && cadastro.email ? (
                    <a
                      href={`mailto:${cadastro.email}`}
                      className="font-medium text-[#0066CC] hover:underline break-all"
                    >
                      {cadastro.email}
                    </a>
                  ) : (
                    <span className="text-gray-400">—</span>
                  )}
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <Phone className="w-4 h-4 text-gray-400 mt-0.5 shrink-0" />
                <div>
                  <span className="text-xs text-gray-500 block">WhatsApp / Telefone</span>
                  {typeof cadastro.whatsapp === 'string' && cadastro.whatsapp ? (
                    <a
                      href={`https://wa.me/55${cadastro.whatsapp.replace(/\D/g, '')}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-medium text-emerald-700 hover:underline inline-flex items-center gap-1"
                    >
                      {cadastro.whatsapp}
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  ) : (
                    <span className="text-gray-400">—</span>
                  )}
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <Briefcase className="w-4 h-4 text-gray-400 mt-0.5 shrink-0" />
                <div>
                  <span className="text-xs text-gray-500 block">CNPJ Informado</span>
                  <span className="font-mono text-gray-900 font-medium">
                    {(typeof cadastro.cnpj === 'string' && cadastro.cnpj) || '—'}
                  </span>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <DollarSign className="w-4 h-4 text-gray-400 mt-0.5 shrink-0" />
                <div>
                  <span className="text-xs text-gray-500 block">Faixa de Faturamento</span>
                  <span className="font-medium text-gray-900">
                    {(typeof cadastro.faturamento === 'string' && cadastro.faturamento) || '—'}
                  </span>
                </div>
              </div>
            </div>

            {/* Condições de Devolutiva e Interesse */}
            <div className="mt-4 pt-4 border-t border-gray-100 grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs bg-slate-50 p-3 rounded-lg">
              <div>
                <span className="text-gray-500 block">Autorização Devolutiva:</span>
                <span className="font-semibold text-gray-800">
                  {lead.autorizacao_devolutiva || 'Não preenchido'}
                </span>
              </div>
              <div>
                <span className="text-gray-500 block">Formato de Interesse:</span>
                <span className="font-semibold text-gray-800">
                  {lead.formato_interesse || 'Não preenchido'}
                </span>
              </div>
              <div>
                <span className="text-gray-500 block">Plano Selecionado:</span>
                <span className="font-semibold text-[#0066CC]">
                  {(typeof cadastro.planoEscolhido === 'string' && cadastro.planoEscolhido) ||
                    (respostas.plano_escolhido as string) ||
                    (isSaasWaitlist ? 'SaaS (R$ 1.190/mês)' : 'Não especificado')}
                </span>
              </div>
              <div>
                <span className="text-gray-500 block">Responsável Documentos:</span>
                <span className="font-semibold text-gray-800">
                  {lead.responsavel_documentos || 'Não preenchido'}
                </span>
              </div>
            </div>
          </div>

          {/* 2. Documentos e Anexos */}
          <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-bold text-[#0066CC] uppercase tracking-wider flex items-center gap-2">
                <Paperclip className="w-4 h-4" /> Anexos e Documentação ({totalFiles})
              </h3>

              {totalFiles > 0 && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleDownloadAllAttachments}
                  disabled={exportingZip}
                  className="h-8 text-xs border-emerald-300 text-emerald-800 hover:bg-emerald-50 hover:text-emerald-900"
                >
                  <Archive className="w-3.5 h-3.5 mr-1 text-[#22B14C]" />
                  Baixar todos os anexos ({totalFiles})
                </Button>
              )}
            </div>

            {totalFiles === 0 ? (
              <p className="text-sm text-gray-500 italic">
                Nenhum documento anexado pelo participante.
              </p>
            ) : (
              <div className="space-y-3">
                {contratoFiles.length > 0 && (
                  <div>
                    <span className="text-xs font-semibold text-gray-700 block mb-1.5">
                      Contrato Social / Ato Constitutivo:
                    </span>
                    <div className="flex flex-wrap gap-2">
                      {contratoFiles.map((file, idx) => (
                        <Button
                          key={idx}
                          variant="outline"
                          size="sm"
                          asChild
                          className="h-8 text-xs bg-gray-50 hover:bg-[#EAF3FD] hover:text-[#0066CC] border-gray-200"
                        >
                          <a
                            href={getFileUrl(lead, file)}
                            target="_blank"
                            rel="noopener noreferrer"
                            download
                          >
                            <FileText className="w-3.5 h-3.5 mr-1 text-[#0066CC]" />
                            {file}
                            <Download className="w-3.5 h-3.5 ml-1.5 opacity-60" />
                          </a>
                        </Button>
                      ))}
                    </div>
                  </div>
                )}

                {certFiles.length > 0 && (
                  <div>
                    <span className="text-xs font-semibold text-gray-700 block mb-1.5">
                      Certificações / Atestados:
                    </span>
                    <div className="flex flex-wrap gap-2">
                      {certFiles.map((file, idx) => (
                        <Button
                          key={idx}
                          variant="outline"
                          size="sm"
                          asChild
                          className="h-8 text-xs bg-gray-50 hover:bg-[#EAF3FD] hover:text-[#0066CC] border-gray-200"
                        >
                          <a
                            href={getFileUrl(lead, file)}
                            target="_blank"
                            rel="noopener noreferrer"
                            download
                          >
                            <FileText className="w-3.5 h-3.5 mr-1 text-[#22B14C]" />
                            {file}
                            <Download className="w-3.5 h-3.5 ml-1.5 opacity-60" />
                          </a>
                        </Button>
                      ))}
                    </div>
                  </div>
                )}

                {docFiles.length > 0 && (
                  <div>
                    <span className="text-xs font-semibold text-gray-700 block mb-1.5">
                      Documentação Adicional / Relatórios:
                    </span>
                    <div className="flex flex-wrap gap-2">
                      {docFiles.map((file, idx) => (
                        <Button
                          key={idx}
                          variant="outline"
                          size="sm"
                          asChild
                          className="h-8 text-xs bg-gray-50 hover:bg-[#EAF3FD] hover:text-[#0066CC] border-gray-200"
                        >
                          <a
                            href={getFileUrl(lead, file)}
                            target="_blank"
                            rel="noopener noreferrer"
                            download
                          >
                            <FileText className="w-3.5 h-3.5 mr-1 text-purple-600" />
                            {file}
                            <Download className="w-3.5 h-3.5 ml-1.5 opacity-60" />
                          </a>
                        </Button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* 3. Dossiê Completo de Respostas por Seção OU Detalhes da Lista de Prioridade */}
          {isSaasWaitlist ? (
            <div className="bg-white rounded-xl border border-[#22B14C]/30 p-6 shadow-sm space-y-4">
              <div className="flex items-center gap-2.5 text-[#22B14C]">
                <CheckCircle2 className="w-5 h-5 shrink-0" />
                <h3 className="text-base font-bold text-gray-900">
                  Inscrição Confirmada na Lista de Prioridade SaaS
                </h3>
              </div>
              <p className="text-sm text-gray-600 leading-relaxed">
                Este lead realizou a inscrição diretamente pelo card do{' '}
                <strong>nível SaaS (R$ 1.190/mês)</strong> na página inicial. Foi informado sobre a
                garantia de <strong>acesso antecipado exclusivo</strong> e{' '}
                <strong>condição especial de fundador</strong> quando a plataforma abrir.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs bg-emerald-50/60 p-4 rounded-lg border border-emerald-100">
                <div>
                  <span className="text-gray-500 font-medium block">Origem Registrada:</span>
                  <span className="font-bold text-gray-900">Lista de Prioridade SaaS</span>
                </div>
                <div>
                  <span className="text-gray-500 font-medium block">Plano de Interesse:</span>
                  <span className="font-bold text-[#0066CC]">SaaS (R$ 1.190/mês)</span>
                </div>
                <div>
                  <span className="text-gray-500 font-medium block">Setor Informado:</span>
                  <span className="font-bold text-gray-900">{lead.setor}</span>
                </div>
                <div>
                  <span className="text-gray-500 font-medium block">Faturamento Estimado:</span>
                  <span className="font-bold text-gray-900">
                    {(typeof cadastro.faturamento === 'string' && cadastro.faturamento) ||
                      'Não informado'}
                  </span>
                </div>
                <div>
                  <span className="text-gray-500 font-medium block">
                    E-mail Automático Disparado:
                  </span>
                  <span className="font-semibold text-emerald-800">
                    Sim (Confirmação ao Lead + Notificação à Equipe)
                  </span>
                </div>
                <div>
                  <span className="text-gray-500 font-medium block">Dossiê V6.7 Aplicável:</span>
                  <span className="font-semibold text-gray-500">
                    Não (Aplicável somente a questionários 72h)
                  </span>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-bold text-[#333333]">
                    Dossiê Estratégico · Respostas por Seção
                  </h3>
                  <p className="text-xs text-gray-500">
                    Organizado conforme as seções estruturadas do questionário de {lead.setor}.
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setCollapsedSections({})}
                    className="text-xs text-gray-600 h-8"
                  >
                    Expandir todas
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      const all: Record<string, boolean> = {}
                      sections.forEach((s) => (all[s.id] = true))
                      setCollapsedSections(all)
                    }}
                    className="text-xs text-gray-600 h-8"
                  >
                    Recolher todas
                  </Button>
                </div>
              </div>

              {sections.length === 0 ? (
                <div className="bg-white p-6 rounded-xl border border-gray-200 text-center text-gray-500">
                  Respostas em formato bruto disponível abaixo:
                  <pre className="mt-4 p-4 bg-gray-50 rounded-lg text-left text-xs overflow-x-auto">
                    {JSON.stringify(respostas, null, 2)}
                  </pre>
                </div>
              ) : (
                sections.map((section, sIndex) => {
                  const isCollapsed = !!collapsedSections[section.id]
                  // Contar quantas perguntas dessa seção têm resposta preenchida
                  const answeredInThis = section.questions.filter(
                    (q) => respostas[q.id] !== undefined && respostas[q.id] !== '',
                  ).length

                  return (
                    <div
                      key={section.id}
                      className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden transition-all"
                    >
                      <button
                        type="button"
                        onClick={() => toggleSection(section.id)}
                        className="w-full px-5 py-4 flex items-center justify-between text-left hover:bg-gray-50/80 transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <span className="w-6 h-6 rounded-full bg-[#0066CC]/10 text-[#0066CC] font-bold text-xs flex items-center justify-center shrink-0">
                            {sIndex + 1}
                          </span>
                          <div>
                            <h4 className="font-semibold text-sm text-[#333333] flex items-center gap-2">
                              {section.title}
                              <span className="text-xs font-normal text-gray-500">
                                ({answeredInThis}/{section.questions.length} respondidas)
                              </span>
                            </h4>
                            {section.subtitle && (
                              <p className="text-xs text-gray-500 line-clamp-1">
                                {section.subtitle}
                              </p>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center gap-2 text-gray-400">
                          {isCollapsed ? (
                            <ChevronDown className="w-5 h-5" />
                          ) : (
                            <ChevronUp className="w-5 h-5" />
                          )}
                        </div>
                      </button>

                      {!isCollapsed && (
                        <div className="px-5 pb-5 pt-2 border-t border-gray-100 divide-y divide-gray-100">
                          {section.questions.map((question) => {
                            let val = respostas[question.id]

                            // Ponto 4: Tratamento de "Outro"
                            // Procurar especificação se existir campo complementar
                            const outroText =
                              (respostas[`${question.id}_outro`] as string) ||
                              (respostas[`${question.id}Outro`] as string) ||
                              (question.id.endsWith('_segmento')
                                ? (respostas[`${question.id}Outro`] as string) ||
                                  (respostas[`${question.id}_outro`] as string)
                                : '')

                            const isValEmpty = val === undefined || val === '' || val === null
                            const isValOutro =
                              typeof val === 'string' && val.trim().toLowerCase() === 'outro'

                            // Se valor for vazio mas existe outroText
                            if (isValEmpty && outroText && outroText.trim()) {
                              val = `Outro: ${outroText.trim()}`
                            } else if (isValOutro) {
                              if (outroText && outroText.trim()) {
                                val = `Outro: ${outroText.trim()}`
                              } else {
                                val = 'Outro (não detalhado)'
                              }
                            }

                            // Ponto 2: Varejo - "e-commerce" agregável
                            // No dossiê, quando segmento != ecommerce e resposta = Sim, exibir "«segmento escolhido» + E-commerce complementar"
                            if (question.id === 'varejo_segmento') {
                              const ecomIntegrated = respostas['varejo_1_ecommerce_integrado'] as
                                | string
                                | undefined
                              const isYesEcom =
                                ecomIntegrated &&
                                (ecomIntegrated.toLowerCase().startsWith('sim') ||
                                  ecomIntegrated.includes('omnichannel'))
                              const segmentStr = typeof val === 'string' ? val : ''
                              const isNotEcommerce =
                                segmentStr && !segmentStr.toLowerCase().includes('e-commerce')

                              if (isNotEcommerce && isYesEcom) {
                                val = `${segmentStr} + E-commerce complementar`
                              }
                            }

                            const hasAnswer = val !== undefined && val !== '' && val !== null

                            return (
                              <div key={question.id} className="py-3 text-sm">
                                <span className="text-xs font-medium text-gray-500 block mb-1">
                                  {question.label}
                                </span>
                                {hasAnswer ? (
                                  <div className="text-gray-900 bg-gray-50/70 p-2.5 rounded-lg border border-gray-100/80 font-normal whitespace-pre-wrap leading-relaxed text-[13.5px]">
                                    {String(val)}
                                  </div>
                                ) : (
                                  <span className="text-xs italic text-gray-400">
                                    Não respondido
                                  </span>
                                )}
                              </div>
                            )
                          })}
                        </div>
                      )}
                    </div>
                  )
                })
              )}

              {/* Respostas extras não mapeadas nas seções (por exemplo campos consolidados gerais) */}
              {Object.keys(respostas).some(
                (k) => !sections.some((s) => s.questions.some((q) => q.id === k)),
              ) && (
                <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden p-5">
                  <h4 className="font-semibold text-sm text-gray-700 mb-3">
                    Outros campos e parâmetros registrados:
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                    {Object.entries(respostas)
                      .filter(
                        ([key]) => !sections.some((s) => s.questions.some((q) => q.id === key)),
                      )
                      .map(([key, val]) => (
                        <div key={key} className="bg-gray-50 p-2.5 rounded border border-gray-100">
                          <span className="font-mono text-gray-500 block text-[11px]">{key}:</span>
                          <span className="text-gray-900 font-medium">{String(val)}</span>
                        </div>
                      ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Rodapé da Modal */}
        <div className="p-4 bg-gray-50 border-t border-gray-200 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div className="flex items-center gap-2 flex-wrap">
            {!isSaasWaitlist && (
              <Button
                size="sm"
                onClick={handleExportJson}
                disabled={exportingJson || exportingZip}
                className="bg-[#0066CC] hover:bg-[#0055b3] text-white text-xs h-9"
              >
                {exportingJson ? (
                  <Loader2 className="w-3.5 h-3.5 mr-1.5 animate-spin" />
                ) : (
                  <FileJson className="w-3.5 h-3.5 mr-1.5" />
                )}
                Exportar dossiê (JSON)
              </Button>
            )}

            {totalFiles > 0 && (
              <Button
                variant="outline"
                size="sm"
                onClick={handleDownloadAllAttachments}
                disabled={exportingZip || exportingJson}
                className="text-xs h-9 border-[#22B14C]/50 text-[#22B14C] hover:bg-[#22B14C]/10"
              >
                {exportingZip ? (
                  <Loader2 className="w-3.5 h-3.5 mr-1.5 animate-spin" />
                ) : (
                  <Archive className="w-3.5 h-3.5 mr-1.5" />
                )}
                Baixar todos os anexos ({totalFiles})
              </Button>
            )}
          </div>

          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Fechar Dossiê
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
export default LeadDetailModal
