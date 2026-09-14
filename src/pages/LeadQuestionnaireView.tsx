import { useEffect, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import {
  AlertTriangle,
  ArrowLeft,
  CheckCircle2,
  Download,
  FileText,
  Loader2,
  ShieldCheck,
} from 'lucide-react'
import pb from '@/lib/pocketbase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { downloadQuestionnaireAsPdf, type QuestionnairePdfData } from '@/services/questionnairePdf'

export default function LeadQuestionnaireView() {
  const [searchParams] = useSearchParams()
  const initialProtocolo = searchParams.get('protocolo') || ''
  const initialToken = searchParams.get('token') || ''

  const [protocolo, setProtocolo] = useState(initialProtocolo)
  const [token, setToken] = useState(initialToken)
  const [emailFallback, setEmailFallback] = useState('')

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [data, setData] = useState<QuestionnairePdfData | null>(null)

  const fetchQuestionnaire = async (proto: string, tok?: string, mail?: string) => {
    if (!proto.trim()) {
      setError('Por favor, informe o protocolo do questionário.')
      return
    }

    setLoading(true)
    setError(null)
    try {
      const params = new URLSearchParams()
      params.set('protocolo', proto.trim())
      if (tok && tok.trim()) params.set('token', tok.trim())
      if (mail && mail.trim()) params.set('email', mail.trim().toLowerCase())

      const res = await pb.send<QuestionnairePdfData>(
        `/backend/v1/lead-questionnaire/download?${params.toString()}`,
        { method: 'GET' },
      )
      setData(res)
    } catch (err: any) {
      console.error('Erro ao buscar questionário:', err)
      const msg =
        err?.data?.message ||
        err?.message ||
        'Não foi possível localizar o questionário com os dados informados. Verifique o número de protocolo ou confirme o e-mail corporativo utilizado.'
      setError(msg)
      setData(null)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (initialProtocolo) {
      fetchQuestionnaire(initialProtocolo, initialToken)
    }
  }, [initialProtocolo, initialToken])

  const handleManualSearch = (e: React.FormEvent) => {
    e.preventDefault()
    fetchQuestionnaire(protocolo, token, emailFallback)
  }

  const handleDownloadPdf = () => {
    if (!data) return
    downloadQuestionnaireAsPdf(data)
  }

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="mb-6">
          <Link
            to="/"
            className="inline-flex items-center text-sm font-semibold text-[#0066CC] hover:underline gap-1.5"
          >
            <ArrowLeft className="w-4 h-4" /> Voltar à página inicial
          </Link>
        </div>

        {/* Card Principal */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
          {/* Topo Institucional Azul #0066CC */}
          <div className="bg-[#0066CC] p-6 sm:p-8 text-white text-center">
            <span className="inline-block px-3 py-1 bg-white/20 rounded-full text-xs font-bold uppercase tracking-wider mb-2">
              VETOR MASTER · Dossiê Estratégico
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Cópia do seu Questionário Respondido
            </h1>
            <p className="mt-2 text-sm text-blue-100 max-w-xl mx-auto">
              Acesse e baixe a qualquer momento o relatório completo das respostas fornecidas pela
              sua empresa no padrão visual institucional em PDF.
            </p>
          </div>

          <div className="p-6 sm:p-8">
            {/* Se ainda não carregou os dados ou deseja consultar outro protocolo */}
            {!data && (
              <form onSubmit={handleManualSearch} className="space-y-4 max-w-md mx-auto mb-6">
                <div>
                  <Label
                    htmlFor="proto-input"
                    className="text-xs font-bold uppercase text-slate-700"
                  >
                    Número do Protocolo
                  </Label>
                  <Input
                    id="proto-input"
                    value={protocolo}
                    onChange={(e) => setProtocolo(e.target.value)}
                    placeholder="Ex: j9z9cbjkmgy26bf"
                    className="mt-1 font-mono"
                    required
                  />
                </div>

                {!initialToken && (
                  <div>
                    <Label
                      htmlFor="email-input"
                      className="text-xs font-bold uppercase text-slate-700"
                    >
                      E-mail corporativo cadastrado (confirmação de segurança)
                    </Label>
                    <Input
                      id="email-input"
                      type="email"
                      value={emailFallback}
                      onChange={(e) => setEmailFallback(e.target.value)}
                      placeholder="seu.email@empresa.com.br"
                      className="mt-1"
                    />
                  </div>
                )}

                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-[#0066CC] hover:bg-[#0055b3] text-white font-bold h-11"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" /> Buscando questionário...
                    </>
                  ) : (
                    'Consultar questionário'
                  )}
                </Button>
              </form>
            )}

            {/* Mensagem de Erro */}
            {error && (
              <div className="p-4 rounded-xl border border-red-200 bg-red-50 text-red-700 flex items-start gap-3 my-4">
                <AlertTriangle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
                <div className="text-sm">
                  <strong className="block font-semibold">
                    Não foi possível carregar os dados:
                  </strong>
                  {error}
                </div>
              </div>
            )}

            {/* Quando o questionário foi carregado com sucesso */}
            {data && (
              <div className="space-y-6">
                <div className="p-4 rounded-xl border border-emerald-200 bg-emerald-50 text-emerald-800 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2.5">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                    <span className="text-sm font-semibold">
                      Questionário autenticado e carregado com sucesso!
                    </span>
                  </div>
                  <span className="text-xs font-mono bg-white px-2.5 py-1 rounded border border-emerald-200 text-emerald-900 font-bold">
                    #{data.id}
                  </span>
                </div>

                {/* Resumo da Empresa e Setor */}
                <div className="border border-slate-200 rounded-xl p-5 bg-slate-50 space-y-3">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                    <div>
                      <span className="text-xs text-slate-500 block">Empresa / Razão Social:</span>
                      <strong className="text-slate-900 text-base">
                        {data.cadastro?.empresa || 'Empresa'}
                      </strong>
                    </div>
                    <div>
                      <span className="text-xs text-slate-500 block">Setor de Diagnóstico:</span>
                      <strong className="text-[#0066CC] text-base">{data.setor}</strong>
                    </div>
                    <div>
                      <span className="text-xs text-slate-500 block">Respondente:</span>
                      <span className="text-slate-800 font-medium">
                        {data.cadastro?.nomeCompleto || '—'}{' '}
                        {data.cadastro?.cargo ? `(${data.cadastro.cargo})` : ''}
                      </span>
                    </div>
                    <div>
                      <span className="text-xs text-slate-500 block">E-mail de Contato:</span>
                      <span className="text-slate-800 font-medium">
                        {data.cadastro?.email || '—'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Botão de Ação Destacado */}
                <div className="text-center py-4 space-y-3">
                  <Button
                    onClick={handleDownloadPdf}
                    size="lg"
                    className="bg-[#22B14C] hover:bg-[#1da244] text-white font-extrabold px-8 py-6 text-base rounded-xl shadow-md hover:shadow-lg transition-all w-full sm:w-auto"
                  >
                    <Download className="w-5 h-5 mr-2" />
                    Baixar uma cópia do seu questionário (PDF)
                  </Button>
                  <p className="text-xs text-slate-500 max-w-md mx-auto">
                    O documento em PDF inclui todas as respostas do seu diagnóstico setorial, termo
                    de confidencialidade e protocolo oficial VETOR MASTER.
                  </p>
                </div>

                <div className="pt-6 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
                  <div className="flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-emerald-600" />
                    Ambiente seguro e autenticado VETOR MASTER
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setData(null)
                      setError(null)
                    }}
                    className="text-xs text-[#0066CC]"
                  >
                    <FileText className="w-3.5 h-3.5 mr-1" /> Consultar outro protocolo
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
