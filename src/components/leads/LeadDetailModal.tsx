import { useState } from 'react'
import type { LeadRecord, LeadStatus } from '@/services/leads'
import {
  parseLeadCadastro,
  parseLeadRespostas,
  getFileUrl,
  updateLeadStatus,
} from '@/services/leads'
import { getQuestionnaireSections } from '@/data/questionnaireSectors'
import { findSector } from '@/data/sectors'
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
} from 'lucide-react'

interface LeadDetailModalProps {
  lead: LeadRecord | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onStatusUpdated?: (updatedLead: LeadRecord) => void
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
}: LeadDetailModalProps) {
  const [updatingStatus, setUpdatingStatus] = useState(false)
  const [collapsedSections, setCollapsedSections] = useState<Record<string, boolean>>({})

  if (!lead) return null

  const cadastro = parseLeadCadastro(lead)
  const respostas = parseLeadRespostas(lead)
  const sectorInfo = findSector(lead.setor_id)
  const sections = getQuestionnaireSections(lead.setor_id)

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
      const updated = await updateLeadStatus(lead.id, newStatus)
      if (onStatusUpdated) onStatusUpdated(updated)
    } catch (err) {
      console.error('Falha ao atualizar status', err)
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

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto p-0 gap-0 bg-[#FBFDFF] border-[#0066CC]/20 text-[#333333]">
        {/* Cabeçalho */}
        <DialogHeader className="p-6 bg-white border-b border-gray-200 sticky top-0 z-10 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                <Badge
                  variant="outline"
                  className="bg-[#0066CC]/10 text-[#0066CC] border-[#0066CC]/30 font-semibold"
                >
                  {lead.setor || sectorInfo?.name || 'Setor não especificado'}
                </Badge>
                <span className="text-xs text-gray-500 flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" />
                  Recebido em {createdDate}
                </span>
              </div>
              <DialogTitle className="text-2xl font-bold text-[#333333] flex items-center gap-2">
                <span>{cadastro.empresa || 'Empresa não informada'}</span>
              </DialogTitle>
              <DialogDescription className="text-sm text-gray-600 mt-0.5">
                Contato principal:{' '}
                <strong className="text-gray-900">
                  {cadastro.nomeCompleto || 'Não informado'}
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
                  <span className="font-medium text-gray-900">{cadastro.nomeCompleto || '—'}</span>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <Building2 className="w-4 h-4 text-gray-400 mt-0.5 shrink-0" />
                <div>
                  <span className="text-xs text-gray-500 block">Empresa / Razão Social</span>
                  <span className="font-medium text-gray-900">{cadastro.empresa || '—'}</span>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <Mail className="w-4 h-4 text-gray-400 mt-0.5 shrink-0" />
                <div>
                  <span className="text-xs text-gray-500 block">E-mail Corporativo</span>
                  {cadastro.email ? (
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
                  {cadastro.whatsapp ? (
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
                    {cadastro.cnpj || '—'}
                  </span>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <DollarSign className="w-4 h-4 text-gray-400 mt-0.5 shrink-0" />
                <div>
                  <span className="text-xs text-gray-500 block">Faixa de Faturamento</span>
                  <span className="font-medium text-gray-900">{cadastro.faturamento || '—'}</span>
                </div>
              </div>
            </div>

            {/* Condições de Devolutiva e Interesse */}
            <div className="mt-4 pt-4 border-t border-gray-100 grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs bg-slate-50 p-3 rounded-lg">
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

          {/* 3. Dossiê Completo de Respostas por Seção */}
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
                            <p className="text-xs text-gray-500 line-clamp-1">{section.subtitle}</p>
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
                          const val = respostas[question.id]
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
                                <span className="text-xs italic text-gray-400">Não respondido</span>
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
                    .filter(([key]) => !sections.some((s) => s.questions.some((q) => q.id === key)))
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
        </div>

        {/* Rodapé da Modal */}
        <div className="p-4 bg-gray-50 border-t border-gray-200 flex justify-end">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Fechar Dossiê
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
export default LeadDetailModal
