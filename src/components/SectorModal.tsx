import { useNavigate } from 'react-router-dom'
import { ArrowRight, CheckCircle2 } from 'lucide-react'
import { leadSectors, type LeadSector } from '@/data/sectors'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Badge } from '@/components/ui/badge'

interface SectorModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  title?: string
  description?: string
}

export function SectorModal({
  open,
  onOpenChange,
  title = 'Selecione o seu setor',
  description = 'Escolha o segmento da sua empresa para direcionarmos o Questionário Estratégico com foco nos indicadores e gargalos da sua operação.',
}: SectorModalProps) {
  const navigate = useNavigate()

  function handleSelect(sectorId: string) {
    onOpenChange(false)
    navigate(`/questionario/${sectorId}`)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[85vh] p-6 sm:p-8 overflow-y-auto bg-white text-[#333333] border-slate-200 shadow-2xl">
        <DialogHeader className="text-left space-y-2">
          <div className="flex items-center gap-2">
            <Badge
              variant="outline"
              className="border-[#0066CC]/30 text-[#0066CC] bg-[#EAF3FD] text-xs font-bold tracking-wider"
            >
              DIAGNÓSTICO ESTRATÉGICO
            </Badge>
            <span className="text-xs text-slate-500 font-medium">· 12 Setores Estruturados</span>
          </div>
          <DialogTitle className="text-xl sm:text-2xl font-extrabold text-[#333333]">
            {title}
          </DialogTitle>
          <DialogDescription className="text-sm text-slate-600 leading-relaxed">
            {description}
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 pt-2">
          {leadSectors.map((sector, index) => {
            const Icon = sector.icon
            const isFeatured = index < 3
            return (
              <button
                key={sector.id}
                type="button"
                onClick={() => handleSelect(sector.id)}
                className={`group relative flex flex-col items-start text-left p-3.5 rounded-xl border transition-all duration-200 cursor-pointer ${
                  isFeatured
                    ? 'border-[#0066CC] bg-[#F5F9FF] shadow-sm hover:border-[#0066CC] hover:bg-[#EAF3FD] hover:shadow-md'
                    : 'border-slate-200 bg-white hover:border-[#0066CC]/60 hover:bg-slate-50 hover:shadow-sm'
                }`}
              >
                <div className="flex items-center justify-between w-full mb-2">
                  <div
                    className={`p-2 rounded-lg ${
                      isFeatured
                        ? 'bg-[#EAF3FD] text-[#0066CC] border border-[#0066CC]/20'
                        : 'bg-slate-100 text-[#0066CC] group-hover:bg-[#0066CC] group-hover:text-white transition-colors'
                    }`}
                  >
                    <Icon className="w-4 h-4" aria-hidden="true" />
                  </div>
                  <span className="text-[11px] font-mono font-bold text-slate-400 group-hover:text-[#0066CC] transition-colors">
                    {String(index + 1).padStart(2, '0')}
                  </span>
                </div>

                <strong
                  className={`text-sm font-bold leading-snug transition-colors ${
                    isFeatured
                      ? 'text-[#333333] font-extrabold group-hover:text-[#0066CC]'
                      : 'text-slate-900 group-hover:text-[#0066CC]'
                  }`}
                >
                  {sector.name}
                </strong>
                <p className="text-[11px] text-slate-600 line-clamp-2 mt-1 leading-snug">
                  {sector.tagline}
                </p>

                <div className="mt-3 flex items-center gap-1 text-[11px] font-bold text-[#0066CC] group-hover:text-[#22B14C] transition-colors">
                  <span>Iniciar questionário</span>
                  <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                </div>
              </button>
            )
          })}
        </div>

        <div className="flex items-center justify-between pt-4 mt-2 border-t border-slate-100 text-xs text-muted-foreground">
          <div className="flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-growth-green" />
            <span>Diagnóstico em até 72h · Zero Alucinação</span>
          </div>
          <span className="hidden sm:inline">Retorno em até 5 dias</span>
        </div>
      </DialogContent>
    </Dialog>
  )
}
