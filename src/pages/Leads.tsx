import { useState, useEffect, useMemo, useCallback } from 'react'
import { Link } from 'react-router-dom'
import pb from '@/lib/pocketbase/client'
import type { LeadRecord, LeadStatus } from '@/services/leads'
import { fetchLeads, parseLeadCadastro } from '@/services/leads'
import { useAuth } from '@/services/auth'
import { useRealtime } from '@/hooks/use-realtime'
import { leadSectors } from '@/data/sectors'
import LeadsLogin from '@/components/leads/LeadsLogin'
import LeadDetailModal from '@/components/leads/LeadDetailModal'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Search,
  Filter,
  LogOut,
  RefreshCw,
  Building2,
  Mail,
  Phone,
  FileText,
  Calendar,
  Layers,
  CheckCircle,
  AlertCircle,
  ExternalLink,
  ChevronRight,
  Shield,
  Loader2,
  ArrowUpDown,
} from 'lucide-react'

const statusBadges: Record<string, { label: string; className: string }> = {
  novo: { label: 'Novo', className: 'bg-blue-100 text-blue-800 border-blue-200' },
  em_analise: { label: 'Em Análise', className: 'bg-amber-100 text-amber-800 border-amber-200' },
  devolutiva_agendada: {
    label: 'Devolutiva Agendada',
    className: 'bg-purple-100 text-purple-800 border-purple-200',
  },
  concluido: {
    label: 'Concluído',
    className: 'bg-emerald-100 text-emerald-800 border-emerald-200',
  },
  descartado: { label: 'Descartado', className: 'bg-gray-100 text-gray-700 border-gray-200' },
}

export function LeadsPage() {
  const { user, isValid, logout } = useAuth()
  const [leads, setLeads] = useState<LeadRecord[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Filtros
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedSector, setSelectedSector] = useState<string>('all')
  const [selectedStatus, setSelectedStatus] = useState<string>('all')

  // Lead selecionado para modal de detalhe
  const [selectedLead, setSelectedLead] = useState<LeadRecord | null>(null)
  const [modalOpen, setModalOpen] = useState(false)

  // Carregar leads
  const loadLeads = useCallback(async () => {
    if (!isValid) return
    setLoading(true)
    setError(null)
    try {
      const data = await fetchLeads({ sort: '-created' })
      setLeads(data.items)
    } catch (err: unknown) {
      console.error('Erro ao carregar leads:', err)
      const message =
        err && typeof err === 'object' && 'message' in err
          ? String(err.message)
          : 'Erro ao carregar a lista de leads.'
      setError(message)
    } finally {
      setLoading(false)
    }
  }, [isValid])

  useEffect(() => {
    if (isValid) {
      loadLeads()
    }
  }, [isValid, loadLeads])

  // Inscrição em tempo real para novos leads e atualizações
  useRealtime<LeadRecord>(
    'leads',
    (e) => {
      if (e.action === 'create') {
        setLeads((prev) => [e.record, ...prev])
      } else if (e.action === 'update') {
        setLeads((prev) => prev.map((item) => (item.id === e.record.id ? e.record : item)))
        if (selectedLead && selectedLead.id === e.record.id) {
          setSelectedLead(e.record)
        }
      } else if (e.action === 'delete') {
        setLeads((prev) => prev.filter((item) => item.id !== e.record.id))
        if (selectedLead && selectedLead.id === e.record.id) {
          setModalOpen(false)
        }
      }
    },
    isValid,
  )

  // Filtragem local
  const filteredLeads = useMemo(() => {
    return leads.filter((lead) => {
      const cadastro = parseLeadCadastro(lead)
      const term = searchTerm.toLowerCase().trim()

      const matchTerm =
        !term ||
        (cadastro.nomeCompleto && cadastro.nomeCompleto.toLowerCase().includes(term)) ||
        (cadastro.empresa && cadastro.empresa.toLowerCase().includes(term)) ||
        (cadastro.email && cadastro.email.toLowerCase().includes(term)) ||
        (cadastro.cnpj && cadastro.cnpj.toLowerCase().includes(term)) ||
        (lead.setor && lead.setor.toLowerCase().includes(term))

      const matchSector =
        selectedSector === 'all' ||
        lead.setor_id === selectedSector ||
        lead.setor.toLowerCase() === selectedSector.toLowerCase()

      const matchStatus = selectedStatus === 'all' || (lead.status || 'novo') === selectedStatus

      return matchTerm && matchSector && matchStatus
    })
  }, [leads, searchTerm, selectedSector, selectedStatus])

  // Se não estiver logado, exibe tela de login
  if (!isValid) {
    return <LeadsLogin onSuccess={() => loadLeads()} />
  }

  return (
    <div className="min-h-screen bg-[#F5F7FA] pb-16 pt-6">
      <div className="site-container max-w-7xl mx-auto px-4 sm:px-6">
        {/* Barra de Topo do Painel */}
        <header className="bg-white rounded-2xl border border-gray-200/80 p-5 mb-6 shadow-sm flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[#EAF3FD] text-[#0066CC]">
                <Shield className="w-3.5 h-3.5" /> Área Interna VETOR MASTER
              </span>
              <span className="text-xs text-gray-500">• Atualização em tempo real ativa</span>
            </div>
            <h1 className="text-2xl font-bold text-[#333333] tracking-tight">
              Consulta de Dossiês &amp; Leads
            </h1>
            <p className="text-sm text-gray-600 mt-0.5">
              Acompanhamento centralizado de todos os questionários estratégicos e documentos
              enviados.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="text-right hidden sm:block">
              <span className="text-xs font-medium text-gray-500 block">Usuário conectado</span>
              <span className="text-sm font-semibold text-gray-800">
                {user?.name || user?.email || 'Administrador'}
              </span>
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={loadLeads}
              disabled={loading}
              title="Recarregar lista"
              className="h-9 text-gray-700 hover:text-[#0066CC] border-gray-300"
            >
              <RefreshCw className={`w-4 h-4 mr-1.5 ${loading ? 'animate-spin' : ''}`} />
              Atualizar
            </Button>

            <Button
              variant="ghost"
              size="sm"
              onClick={logout}
              className="h-9 text-red-600 hover:text-red-700 hover:bg-red-50"
            >
              <LogOut className="w-4 h-4 mr-1.5" /> Sair
            </Button>
          </div>
        </header>

        {/* Resumo Rápido */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mb-6">
          <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
            <span className="text-xs font-medium text-gray-500 block">Total de Dossiês</span>
            <span className="text-2xl font-bold text-[#0066CC] mt-1 block">{leads.length}</span>
          </div>
          <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
            <span className="text-xs font-medium text-gray-500 block">Novos / Aguardando</span>
            <span className="text-2xl font-bold text-amber-600 mt-1 block">
              {leads.filter((l) => !l.status || l.status === 'novo').length}
            </span>
          </div>
          <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
            <span className="text-xs font-medium text-gray-500 block">Em Análise / Agendado</span>
            <span className="text-2xl font-bold text-purple-600 mt-1 block">
              {
                leads.filter((l) => l.status === 'em_analise' || l.status === 'devolutiva_agendada')
                  .length
              }
            </span>
          </div>
          <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
            <span className="text-xs font-medium text-gray-500 block">Concluídos</span>
            <span className="text-2xl font-bold text-[#22B14C] mt-1 block">
              {leads.filter((l) => l.status === 'concluido').length}
            </span>
          </div>
        </div>

        {/* Filtros e Busca */}
        <div className="bg-white rounded-xl border border-gray-200 p-4 mb-6 shadow-sm">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
            {/* Campo de Busca */}
            <div className="md:col-span-5 relative">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Buscar por nome, empresa, e-mail, CNPJ ou setor..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9 h-10 border-gray-300 text-sm focus:border-[#0066CC] focus:ring-[#0066CC]"
              />
            </div>

            {/* Filtro de Setor */}
            <div className="md:col-span-4">
              <Select value={selectedSector} onValueChange={setSelectedSector}>
                <SelectTrigger className="h-10 text-sm border-gray-300">
                  <span className="truncate">
                    {selectedSector === 'all'
                      ? 'Todos os 12 Setores'
                      : leadSectors.find((s) => s.id === selectedSector)?.name || selectedSector}
                  </span>
                </SelectTrigger>
                <SelectContent className="max-h-72">
                  <SelectItem value="all">Todos os 12 Setores</SelectItem>
                  {leadSectors.map((s) => (
                    <SelectItem key={s.id} value={s.id}>
                      {s.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Filtro de Status */}
            <div className="md:col-span-3">
              <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                <SelectTrigger className="h-10 text-sm border-gray-300">
                  <span className="truncate">
                    {selectedStatus === 'all'
                      ? 'Todos os Status'
                      : statusBadges[selectedStatus]?.label || selectedStatus}
                  </span>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos os Status</SelectItem>
                  <SelectItem value="novo">Novo</SelectItem>
                  <SelectItem value="em_analise">Em Análise</SelectItem>
                  <SelectItem value="devolutiva_agendada">Devolutiva Agendada</SelectItem>
                  <SelectItem value="concluido">Concluído</SelectItem>
                  <SelectItem value="descartado">Descartado</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Mensagem de Erro de Acesso / API */}
        {error && (
          <div
            className="mb-6 p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm flex items-start gap-3"
            role="alert"
          >
            <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
            <div className="flex-1">
              <strong className="block font-semibold">Falha ao consultar os dossiês</strong>
              <span>{error}</span>
            </div>
            <Button
              size="sm"
              variant="outline"
              onClick={loadLeads}
              className="border-red-300 text-red-700"
            >
              Tentar novamente
            </Button>
          </div>
        )}

        {/* Conteúdo Principal / Listagem */}
        {loading && leads.length === 0 ? (
          <div className="bg-white rounded-2xl border border-gray-200 p-12 text-center shadow-sm">
            <Loader2 className="w-8 h-8 text-[#0066CC] animate-spin mx-auto mb-3" />
            <h3 className="text-base font-semibold text-gray-800">
              Carregando dossiês recebidos...
            </h3>
            <p className="text-sm text-gray-500 mt-1">
              Conectando ao banco de dados do VETOR MASTER.
            </p>
          </div>
        ) : filteredLeads.length === 0 ? (
          <div className="bg-white rounded-2xl border border-gray-200 p-12 text-center shadow-sm">
            <FileText className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <h3 className="text-lg font-bold text-gray-800">Nenhum dossiê encontrado</h3>
            <p className="text-sm text-gray-500 max-w-md mx-auto mt-1">
              {leads.length === 0
                ? 'Nenhum dossiê recebido ainda. Quando um executivo preencher o questionário estratégico em qualquer um dos 12 setores, o lead aparecerá aqui em tempo real.'
                : 'Nenhum dossiê corresponde aos filtros ou termo de busca selecionados. Tente limpar os filtros.'}
            </p>
            {(searchTerm || selectedSector !== 'all' || selectedStatus !== 'all') && (
              <Button
                variant="outline"
                size="sm"
                className="mt-4"
                onClick={() => {
                  setSearchTerm('')
                  setSelectedSector('all')
                  setSelectedStatus('all')
                }}
              >
                Limpar filtros
              </Button>
            )}
          </div>
        ) : (
          <div className="space-y-3">
            <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider px-2 flex justify-between">
              <span>
                Mostrando {filteredLeads.length} de {leads.length} dossiê(s)
              </span>
              <span>Mais recente primeiro</span>
            </div>

            <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden divide-y divide-gray-100">
              {filteredLeads.map((lead) => {
                const cadastro = parseLeadCadastro(lead)
                const statusMeta = statusBadges[lead.status || 'novo'] || statusBadges.novo
                const formattedDate = lead.created
                  ? new Date(lead.created).toLocaleDateString('pt-BR', {
                      day: '2-digit',
                      month: '2-digit',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })
                  : 'Recente'

                const filesCount =
                  (Array.isArray(lead.contrato_social)
                    ? lead.contrato_social.length
                    : lead.contrato_social
                      ? 1
                      : 0) +
                  (Array.isArray(lead.certificacoes)
                    ? lead.certificacoes.length
                    : lead.certificacoes
                      ? 1
                      : 0) +
                  (Array.isArray(lead.documentacao_adicional)
                    ? lead.documentacao_adicional.length
                    : lead.documentacao_adicional
                      ? 1
                      : 0)

                return (
                  <div
                    key={lead.id}
                    onClick={() => {
                      setSelectedLead(lead)
                      setModalOpen(true)
                    }}
                    className="p-4 sm:p-5 hover:bg-[#F8FAFC] transition-colors cursor-pointer group flex flex-col md:flex-row md:items-center justify-between gap-4"
                  >
                    {/* Coluna 1: Empresa & Setor */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1 flex-wrap">
                        <Badge
                          variant="outline"
                          className="bg-[#0066CC]/5 text-[#0066CC] border-[#0066CC]/20 text-[11px] font-semibold"
                        >
                          {lead.setor || 'Setor'}
                        </Badge>
                        <Badge
                          variant="outline"
                          className={`text-[11px] font-medium ${statusMeta.className}`}
                        >
                          {statusMeta.label}
                        </Badge>
                        {filesCount > 0 && (
                          <span className="text-[11px] text-gray-500 font-medium inline-flex items-center gap-1 bg-gray-100 px-2 py-0.5 rounded">
                            <FileText className="w-3 h-3 text-gray-600" />
                            {filesCount} anexo(s)
                          </span>
                        )}
                      </div>

                      <h2 className="text-base sm:text-lg font-bold text-gray-900 group-hover:text-[#0066CC] transition-colors truncate">
                        {cadastro.empresa || 'Empresa não informada'}
                      </h2>

                      <div className="mt-1 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-gray-600">
                        <span className="flex items-center gap-1">
                          <strong className="text-gray-900 font-medium">
                            {cadastro.nomeCompleto || 'Nome não informado'}
                          </strong>
                          {cadastro.cargo ? ` · ${cadastro.cargo}` : ''}
                        </span>
                        {cadastro.email && (
                          <span className="flex items-center gap-1 text-gray-500">
                            <Mail className="w-3.5 h-3.5" />
                            {cadastro.email}
                          </span>
                        )}
                        {cadastro.whatsapp && (
                          <span className="flex items-center gap-1 text-gray-500">
                            <Phone className="w-3.5 h-3.5" />
                            {cadastro.whatsapp}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Coluna 2: Faturamento & Data */}
                    <div className="flex items-center justify-between md:justify-end gap-4 shrink-0 text-right">
                      <div className="text-left md:text-right">
                        {cadastro.faturamento ? (
                          <span className="text-xs font-semibold text-gray-800 block">
                            {cadastro.faturamento}
                          </span>
                        ) : null}
                        <span className="text-[11px] text-gray-500 flex items-center md:justify-end gap-1 mt-0.5">
                          <Calendar className="w-3 h-3" />
                          {formattedDate}
                        </span>
                      </div>

                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-9 px-3 text-[#0066CC] bg-[#EAF3FD] group-hover:bg-[#0066CC] group-hover:text-white transition-all text-xs font-medium"
                      >
                        Ver Dossiê
                        <ChevronRight className="w-4 h-4 ml-1" />
                      </Button>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {/* Modal de Detalhe Completo do Dossiê */}
        <LeadDetailModal
          lead={selectedLead}
          open={modalOpen}
          onOpenChange={setModalOpen}
          onStatusUpdated={(updated) => {
            setLeads((prev) => prev.map((l) => (l.id === updated.id ? updated : l)))
            setSelectedLead(updated)
          }}
        />
      </div>
    </div>
  )
}
export default LeadsPage
