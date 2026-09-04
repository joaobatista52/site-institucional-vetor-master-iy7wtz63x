import { useState } from 'react'
import { ArrowRight, CheckCircle2, Clock3, FileText, ShieldCheck, Sparkles } from 'lucide-react'

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { getStoredLead, saveChosenPlan, type StoredQuestionnaireLead } from '@/lib/leadSession'

export interface PlanData {
  name: string
  price: string
  description: string
  badge: string
  detail: string
  featured?: boolean
}

interface PlanSelectionModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  plan: PlanData | null
  onProceedToQuestionnaire: () => void
}

export function PlanSelectionModal({
  open,
  onOpenChange,
  plan,
  onProceedToQuestionnaire,
}: PlanSelectionModalProps) {
  const [completedAgreement, setCompletedAgreement] = useState(false)
  const storedLead: StoredQuestionnaireLead | null = open ? getStoredLead() : null
  const hasSubmittedQuestionnaire = Boolean(storedLead && storedLead.leadId)

  if (!plan) return null

  const handleConfirmScenarioA = () => {
    saveChosenPlan(plan.name)
    onOpenChange(false)
    onProceedToQuestionnaire()
  }

  const handleConfirmScenarioB = () => {
    saveChosenPlan(plan.name)
    setCompletedAgreement(true)
  }

  const handleClose = () => {
    setCompletedAgreement(false)
    onOpenChange(false)
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        if (!next) {
          setCompletedAgreement(false)
        }
        onOpenChange(next)
      }}
    >
      <DialogContent className="max-w-xl p-0 overflow-hidden border-blue-200">
        <div className="bg-gradient-to-r from-[#0066CC] to-[#004f9f] text-white p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs uppercase tracking-wider font-bold text-blue-100 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              Assinatura Inteligente · VETOR MASTER
            </span>
            <Badge className="bg-white/15 text-white border-white/30 text-xs">{plan.badge}</Badge>
          </div>
          <DialogHeader className="text-left space-y-1">
            <DialogTitle className="text-2xl text-white font-extrabold">{plan.name}</DialogTitle>
            <DialogDescription className="text-blue-100 text-sm">
              {plan.description}
            </DialogDescription>
          </DialogHeader>
          <div className="mt-4 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-white">{plan.price}</span>
            <span className="text-sm text-blue-200 font-medium">/mês</span>
          </div>
        </div>

        <div className="p-6 space-y-5 bg-white">
          {hasSubmittedQuestionnaire ? (
            /* CENÁRIO B: Questionário já enviado anteriormente, sem devolutiva */
            completedAgreement ? (
              <div className="space-y-4 py-2 text-center">
                <div className="w-14 h-14 rounded-full bg-emerald-50 text-emerald-600 mx-auto flex items-center justify-center border border-emerald-200">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900">Escolha de Plano Confirmada!</h3>
                  <p className="text-sm text-gray-600 mt-1 max-w-md mx-auto">
                    Registramos seu interesse no plano <strong>{plan.name}</strong> para a empresa{' '}
                    <strong>{storedLead?.empresa || 'sua empresa'}</strong>.
                  </p>
                </div>

                <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-200 text-left text-xs sm:text-sm text-emerald-900 space-y-2">
                  <div className="flex items-center gap-2 font-bold text-emerald-800">
                    <Clock3 className="w-4 h-4 shrink-0 text-emerald-600" />
                    <span>Próximo Passo: Aguardando Devolutiva Executiva em até 5 dias</span>
                  </div>
                  <p className="text-emerald-800/90 leading-relaxed">
                    Seu Dossiê Estratégico já está sendo processado pelo nosso motor determinístico.
                    Na sua Sessão de Devolutiva de 45 minutos, nossa equipe executiva apresentará os
                    gargalos identificados e ativará o plano <strong>{plan.name}</strong> sem
                    necessidade de novas etapas.
                  </p>
                </div>

                <Button className="conversion-button w-full mt-3" onClick={handleClose}>
                  Concluir e Fechar
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="p-4 bg-blue-50/70 border border-blue-200 rounded-xl space-y-2">
                  <div className="flex items-center gap-2 text-xs font-bold text-[#0066CC] uppercase tracking-wide">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    Questionário Estratégico já enviado
                  </div>
                  <p className="text-sm text-gray-700 leading-relaxed">
                    Identificamos o envio do Dossiê Estratégico da empresa{' '}
                    <strong>{storedLead?.empresa}</strong> (setor de {storedLead?.setor}).
                  </p>
                  <p className="text-xs text-gray-500">
                    Você pode confirmar agora a contratação do plano <strong>{plan.name}</strong>. A
                    formalização e ativação serão integradas diretamente à sua devolutiva executiva.
                  </p>
                </div>

                <div className="p-4 rounded-xl border border-gray-100 bg-gray-50 space-y-2 text-xs sm:text-sm text-gray-600">
                  <div className="font-semibold text-gray-900 flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-[#0066CC]" /> O que está incluído no seu
                    plano:
                  </div>
                  <p>{plan.detail}</p>
                </div>

                <div className="flex items-center justify-end gap-3 pt-2">
                  <Button variant="outline" onClick={handleClose}>
                    Cancelar
                  </Button>
                  <Button className="conversion-button" onClick={handleConfirmScenarioB}>
                    Concluir Escolha do Plano <ArrowRight className="w-4 h-4 ml-1.5" />
                  </Button>
                </div>
              </div>
            )
          ) : (
            /* CENÁRIO A: Visitante nunca respondeu ao questionário */
            <div className="space-y-4">
              <div className="p-4 bg-amber-50/80 border border-amber-200 rounded-xl space-y-2">
                <div className="flex items-center gap-2 text-xs font-bold text-amber-900 uppercase tracking-wide">
                  <FileText className="w-4 h-4 text-amber-600" />
                  Etapa Obrigatória: Dossiê Estratégico
                </div>
                <p className="text-sm text-amber-950 leading-relaxed font-medium">
                  Para ativar o plano <strong>{plan.name}</strong> com precisão executiva e zero
                  alucinação, o primeiro passo é o preenchimento do{' '}
                  <strong>Questionário Estratégico</strong>.
                </p>
                <p className="text-xs text-amber-900/80 leading-relaxed">
                  Vamos memorizar a sua escolha deste plano. Ao finalizar o questionário do seu
                  setor, sua preferência pelo plano {plan.name} já estará vinculada ao seu cadastro
                  e será considerada na devolutiva executiva de 45 minutos.
                </p>
              </div>

              <div className="p-4 rounded-xl border border-gray-100 bg-gray-50 space-y-2 text-xs sm:text-sm text-gray-600">
                <div className="font-semibold text-gray-900 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-[#0066CC]" /> Benefício do plano {plan.name}:
                </div>
                <p>{plan.detail}</p>
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <Button variant="outline" onClick={handleClose}>
                  Voltar
                </Button>
                <Button className="conversion-button" onClick={handleConfirmScenarioA}>
                  Confirmar Escolha e Iniciar Questionário <ArrowRight className="w-4 h-4 ml-1.5" />
                </Button>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
export default PlanSelectionModal
