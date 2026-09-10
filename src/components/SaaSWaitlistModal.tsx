import { useState } from 'react'
import pb from '@/lib/pocketbase/client'
import { leadSectors } from '@/data/sectors'
import { revenueRanges } from '@/data/questionnaireBase'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  CheckCircle2,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Building2,
  Mail,
  Phone,
  User,
  Briefcase,
  DollarSign,
  Loader2,
  AlertCircle,
  Award,
  Layers,
} from 'lucide-react'

interface SaaSWaitlistModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onExploreMaas?: () => void
}

interface FormData {
  nome: string
  empresa: string
  email: string
  whatsapp: string
  setorId: string
  faturamento: string
}

interface FormErrors {
  nome?: string
  empresa?: string
  email?: string
  whatsapp?: string
  setorId?: string
  faturamento?: string
}

export function SaaSWaitlistModal({ open, onOpenChange, onExploreMaas }: SaaSWaitlistModalProps) {
  const [formData, setFormData] = useState<FormData>({
    nome: '',
    empresa: '',
    email: '',
    whatsapp: '',
    setorId: '',
    faturamento: '',
  })

  const [errors, setErrors] = useState<FormErrors>({})
  const [submitting, setSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [isSuccess, setIsSuccess] = useState(false)
  const [createdProtocol, setCreatedProtocol] = useState<string>('')

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }))
    }
  }

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {}

    if (!formData.nome.trim()) {
      newErrors.nome = 'Informe seu nome completo.'
    }

    if (!formData.empresa.trim()) {
      newErrors.empresa = 'Informe o nome da sua empresa.'
    }

    const emailTrim = formData.email.trim()
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailTrim) {
      newErrors.email = 'Informe seu e-mail corporativo.'
    } else if (!emailRegex.test(emailTrim)) {
      newErrors.email = 'Informe um e-mail válido (ex: seu.nome@suaempresa.com.br).'
    }

    const phoneDigits = formData.whatsapp.replace(/\D/g, '')
    if (!formData.whatsapp.trim()) {
      newErrors.whatsapp = 'Informe seu WhatsApp.'
    } else if (phoneDigits.length < 10) {
      newErrors.whatsapp = 'Informe um WhatsApp com DDD válido (ex: 11 99999-9999).'
    }

    if (!formData.setorId) {
      newErrors.setorId = 'Selecione o setor da sua empresa.'
    }

    if (!formData.faturamento) {
      newErrors.faturamento = 'Selecione a faixa de faturamento anual estimada.'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitError(null)

    if (!validateForm()) {
      return
    }

    setSubmitting(true)
    try {
      const selectedSector = leadSectors.find((s) => s.id === formData.setorId)
      const setorNome = selectedSector ? selectedSector.name : formData.setorId

      const record = await pb.collection('leads').create({
        setor: setorNome,
        setor_id: formData.setorId,
        formato_interesse: 'MaaS', // Compatível com enum ('MaaS' | 'Híbrido' | 'CaaS' | 'Ainda não sei')
        autorizacao_devolutiva: 'Sim, autorizo',
        status: 'novo',
        cadastro: {
          origem: 'Lista de Prioridade SaaS',
          origemTipo: 'saas_prioridade',
          planoEscolhido: 'SaaS (R$ 1.190/mês)',
          nomeCompleto: formData.nome.trim(),
          empresa: formData.empresa.trim(),
          email: formData.email.trim().toLowerCase(),
          whatsapp: formData.whatsapp.trim(),
          faturamento: formData.faturamento,
          cargo: 'Executivo / Fundador',
        },
        respostas: {
          origem: 'Lista de Prioridade SaaS',
          plano_escolhido: 'SaaS (R$ 1.190/mês)',
          setor_nome: setorNome,
          faturamento_anual: formData.faturamento,
          acesso_antecipado_solicitado: true,
          condicao_fundador_solicitada: true,
        },
      })

      setCreatedProtocol(record.id)
      setIsSuccess(true)
    } catch (err: unknown) {
      console.error('Erro ao enviar inscrição para a lista de prioridade SaaS:', err)
      let msg = 'Ocorreu um erro ao registrar sua inscrição. Por favor, tente novamente.'
      if (
        err &&
        typeof err === 'object' &&
        'message' in err &&
        typeof (err as { message: unknown }).message === 'string'
      ) {
        msg = (err as { message: string }).message
      }
      setSubmitError(msg)
    } finally {
      setSubmitting(false)
    }
  }

  const handleModalClose = (openState: boolean) => {
    if (!openState) {
      // Pequeno timeout para resetar estado após transição de fechamento
      setTimeout(() => {
        setIsSuccess(false)
        setSubmitError(null)
        setErrors({})
        setFormData({
          nome: '',
          empresa: '',
          email: '',
          whatsapp: '',
          setorId: '',
          faturamento: '',
        })
      }, 250)
    }
    onOpenChange(openState)
  }

  const handleNavigateToSolutions = () => {
    handleModalClose(false)
    if (onExploreMaas) {
      onExploreMaas()
    } else {
      const solutionsEl = document.getElementById('solucoes')
      if (solutionsEl) {
        solutionsEl.scrollIntoView({ behavior: 'smooth', block: 'start' })
      }
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleModalClose}>
      <DialogContent className="max-w-xl max-h-[92vh] overflow-y-auto p-0 gap-0 bg-[#FBFDFF] border-[#0066CC]/20 text-[#333333] shadow-2xl">
        {/* Cabeçalho Institucional */}
        <DialogHeader className="p-6 bg-gradient-to-b from-[#0066CC] to-[#0052a3] text-white relative">
          <div className="flex items-center gap-2 mb-2">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-[#22B14C] text-white shadow-sm uppercase tracking-wider">
              <Sparkles className="w-3 h-3" /> Acesso Antecipado
            </span>
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-medium bg-white/15 text-white/95">
              <ShieldCheck className="w-3 h-3" /> VETOR MASTER SaaS
            </span>
          </div>

          <DialogTitle className="text-xl sm:text-2xl font-bold text-white tracking-tight leading-snug">
            {isSuccess ? 'Você está na Lista de Prioridade!' : 'Entrar na Lista de Prioridade SaaS'}
          </DialogTitle>

          <DialogDescription className="text-sm text-blue-100 mt-1 leading-relaxed">
            {isSuccess
              ? 'Recebemos seus dados. Você terá acesso prioritário e condição de fundador assim que a plataforma abrir.'
              : 'Garanta sua posição privilegiada para o nível SaaS (R$ 1.190/mês) com inteligência contínua sob demanda.'}
          </DialogDescription>
        </DialogHeader>

        {isSuccess ? (
          /* Tela de Confirmação Sucesso */
          <div className="p-6 sm:p-8 space-y-6">
            <div className="text-center space-y-3">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-[#22B14C] mx-auto flex items-center justify-center shadow-inner">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <h3 className="text-xl font-bold text-gray-900">Agradecemos pelo seu interesse!</h3>
              <p className="text-sm text-gray-600 max-w-md mx-auto leading-relaxed">
                Confirmamos seu cadastro na <strong>Lista de Prioridade SaaS</strong>. Um e-mail de
                confirmação detalhado acabou de ser enviado para{' '}
                <strong className="text-gray-900">{formData.email}</strong>.
              </p>
            </div>

            {/* Caixa de Benefício do Fundador */}
            <div className="bg-[#EAF3FD] border-l-4 border-[#22B14C] rounded-lg p-4 sm:p-5">
              <div className="flex items-start gap-3">
                <Award className="w-5 h-5 text-[#22B14C] shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-sm font-bold text-[#1A365D] uppercase tracking-wide">
                    Acesso Antecipado &amp; Condição Especial de Fundador
                  </h4>
                  <p className="text-xs sm:text-sm text-gray-700 mt-1 leading-relaxed">
                    Você será comunicado <strong>assim que o SaaS abrir</strong> para começar a usar
                    a ferramenta antes do mercado geral, garantindo condições exclusivas e
                    vitalícias de membro fundador.
                  </p>
                </div>
              </div>
            </div>

            {/* Resumo do Lead */}
            <div className="bg-white border border-gray-200 rounded-xl p-4 text-xs sm:text-sm divide-y divide-gray-100">
              <div className="flex justify-between py-2">
                <span className="text-gray-500 font-medium">Empresa:</span>
                <span className="font-semibold text-gray-900">{formData.empresa}</span>
              </div>
              <div className="flex justify-between py-2">
                <span className="text-gray-500 font-medium">Executivo:</span>
                <span className="font-semibold text-gray-900">{formData.nome}</span>
              </div>
              <div className="flex justify-between py-2">
                <span className="text-gray-500 font-medium">Setor de Atuação:</span>
                <span className="font-semibold text-[#0066CC]">
                  {leadSectors.find((s) => s.id === formData.setorId)?.name || formData.setorId}
                </span>
              </div>
              <div className="flex justify-between py-2">
                <span className="text-gray-500 font-medium">Faturamento Estimado:</span>
                <span className="font-semibold text-gray-900">{formData.faturamento}</span>
              </div>
              <div className="flex justify-between py-2">
                <span className="text-gray-500 font-medium">Protocolo:</span>
                <span className="font-mono text-xs text-gray-600">#{createdProtocol}</span>
              </div>
            </div>

            {/* Caixa de Sugestão do MaaS Híbrido */}
            <div className="bg-gradient-to-r from-blue-50/70 to-emerald-50/50 border border-[#0066CC]/20 rounded-xl p-4 sm:p-5">
              <div className="flex items-start gap-3">
                <Layers className="w-5 h-5 text-[#0066CC] shrink-0 mt-0.5" />
                <div className="space-y-2 flex-1">
                  <h4 className="text-sm font-bold text-gray-900">
                    Precisa de direção executiva e diagnóstico imediato?
                  </h4>
                  <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                    Enquanto o SaaS é preparado, o <strong>MaaS Híbrido (R$ 3.290/mês)</strong> já
                    está ativo com diagnósticos estratégicos determinísticos em até 72h e supervisão
                    direta de especialistas para destravar a sua empresa.
                  </p>
                  <div className="pt-2 flex flex-col sm:flex-row gap-2.5">
                    <Button
                      type="button"
                      onClick={handleNavigateToSolutions}
                      className="bg-[#0066CC] hover:bg-[#0055b3] text-white text-xs font-semibold h-9 shadow-sm"
                    >
                      Conhecer o MaaS Híbrido
                      <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => handleModalClose(false)}
                      className="text-xs text-gray-600 h-9"
                    >
                      Fechar
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* Formulário Curto da Lista de Prioridade */
          <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-5">
            {submitError && (
              <div
                className="p-3.5 rounded-lg bg-red-50 border border-red-200 text-red-700 text-xs sm:text-sm flex items-start gap-2.5"
                role="alert"
              >
                <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                <div>
                  <strong className="block font-semibold">Falha no envio:</strong>
                  <span>{submitError}</span>
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Nome */}
              <div className="space-y-1.5 sm:col-span-1">
                <Label
                  htmlFor="saas-nome"
                  className="text-xs font-semibold text-gray-700 flex items-center gap-1.5"
                >
                  <User className="w-3.5 h-3.5 text-[#0066CC]" /> Nome Completo *
                </Label>
                <Input
                  id="saas-nome"
                  type="text"
                  placeholder="Ex: João da Silva"
                  value={formData.nome}
                  onChange={(e) => handleInputChange('nome', e.target.value)}
                  className={`h-10 text-sm ${errors.nome ? 'border-red-500 focus-visible:ring-red-400' : 'border-gray-300'}`}
                />
                {errors.nome && <p className="text-[11px] text-red-600 mt-1">{errors.nome}</p>}
              </div>

              {/* Empresa */}
              <div className="space-y-1.5 sm:col-span-1">
                <Label
                  htmlFor="saas-empresa"
                  className="text-xs font-semibold text-gray-700 flex items-center gap-1.5"
                >
                  <Building2 className="w-3.5 h-3.5 text-[#0066CC]" /> Empresa / Organização *
                </Label>
                <Input
                  id="saas-empresa"
                  type="text"
                  placeholder="Ex: Soluções Integradas Ltda"
                  value={formData.empresa}
                  onChange={(e) => handleInputChange('empresa', e.target.value)}
                  className={`h-10 text-sm ${errors.empresa ? 'border-red-500 focus-visible:ring-red-400' : 'border-gray-300'}`}
                />
                {errors.empresa && (
                  <p className="text-[11px] text-red-600 mt-1">{errors.empresa}</p>
                )}
              </div>

              {/* E-mail */}
              <div className="space-y-1.5 sm:col-span-1">
                <Label
                  htmlFor="saas-email"
                  className="text-xs font-semibold text-gray-700 flex items-center gap-1.5"
                >
                  <Mail className="w-3.5 h-3.5 text-[#0066CC]" /> E-mail Corporativo *
                </Label>
                <Input
                  id="saas-email"
                  type="email"
                  placeholder="joao@empresa.com.br"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  className={`h-10 text-sm ${errors.email ? 'border-red-500 focus-visible:ring-red-400' : 'border-gray-300'}`}
                />
                {errors.email && <p className="text-[11px] text-red-600 mt-1">{errors.email}</p>}
              </div>

              {/* WhatsApp */}
              <div className="space-y-1.5 sm:col-span-1">
                <Label
                  htmlFor="saas-whatsapp"
                  className="text-xs font-semibold text-gray-700 flex items-center gap-1.5"
                >
                  <Phone className="w-3.5 h-3.5 text-[#0066CC]" /> WhatsApp com DDD *
                </Label>
                <Input
                  id="saas-whatsapp"
                  type="tel"
                  placeholder="(11) 98765-4321"
                  value={formData.whatsapp}
                  onChange={(e) => handleInputChange('whatsapp', e.target.value)}
                  className={`h-10 text-sm ${errors.whatsapp ? 'border-red-500 focus-visible:ring-red-400' : 'border-gray-300'}`}
                />
                {errors.whatsapp && (
                  <p className="text-[11px] text-red-600 mt-1">{errors.whatsapp}</p>
                )}
              </div>

              {/* Setor */}
              <div className="space-y-1.5 sm:col-span-1">
                <Label
                  htmlFor="saas-setor"
                  className="text-xs font-semibold text-gray-700 flex items-center gap-1.5"
                >
                  <Briefcase className="w-3.5 h-3.5 text-[#0066CC]" /> Setor de Atuação *
                </Label>
                <Select
                  value={formData.setorId}
                  onValueChange={(val) => handleInputChange('setorId', val)}
                >
                  <SelectTrigger
                    id="saas-setor"
                    className={`h-10 text-sm bg-white ${errors.setorId ? 'border-red-500' : 'border-gray-300'}`}
                  >
                    <SelectValue placeholder="Selecione um dos 12 setores..." />
                  </SelectTrigger>
                  <SelectContent className="max-h-64">
                    {leadSectors.map((sector) => (
                      <SelectItem key={sector.id} value={sector.id}>
                        {sector.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.setorId && (
                  <p className="text-[11px] text-red-600 mt-1">{errors.setorId}</p>
                )}
              </div>

              {/* Faturamento Anual Estimado */}
              <div className="space-y-1.5 sm:col-span-1">
                <Label
                  htmlFor="saas-faturamento"
                  className="text-xs font-semibold text-gray-700 flex items-center gap-1.5"
                >
                  <DollarSign className="w-3.5 h-3.5 text-[#0066CC]" /> Faturamento Anual Estimado *
                </Label>
                <Select
                  value={formData.faturamento}
                  onValueChange={(val) => handleInputChange('faturamento', val)}
                >
                  <SelectTrigger
                    id="saas-faturamento"
                    className={`h-10 text-sm bg-white ${errors.faturamento ? 'border-red-500' : 'border-gray-300'}`}
                  >
                    <SelectValue placeholder="Selecione a faixa anual..." />
                  </SelectTrigger>
                  <SelectContent className="max-h-64">
                    {revenueRanges.map((range) => (
                      <SelectItem key={range} value={range}>
                        {range}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.faturamento && (
                  <p className="text-[11px] text-red-600 mt-1">{errors.faturamento}</p>
                )}
              </div>
            </div>

            {/* Aviso Institucional e Botão de Ação */}
            <div className="pt-2 border-t border-gray-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <span className="text-[11px] text-gray-500 flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-[#22B14C] shrink-0" />
                Seus dados são protegidos e usados apenas para aviso do lançamento.
              </span>

              <Button
                type="submit"
                disabled={submitting}
                className="conversion-button bg-[#22B14C] hover:bg-[#1ea144] text-white font-bold h-11 px-6 shadow-md transition-all sm:w-auto w-full"
              >
                {submitting ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Registrando...
                  </>
                ) : (
                  <>
                    Entrar na lista de prioridade
                    <ArrowRight className="w-4 h-4 ml-1.5" />
                  </>
                )}
              </Button>
            </div>
          </form>
        )}
      </DialogContent>
    </Dialog>
  )
}

export default SaaSWaitlistModal
