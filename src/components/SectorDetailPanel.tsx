import { Link } from 'react-router-dom'
import { AlertTriangle, ArrowRight, CheckCircle2 } from 'lucide-react'
import type { LeadSector } from '@/data/sectors'
import { Button } from '@/components/ui/button'

const KPI_PROMISE = 'Diagnóstico em 72h · Devolutiva de 45 min'

interface SectorDetailPanelProps {
  sector: LeadSector
  index?: number
  onClose?: () => void
}

export function SectorDetailPanel({ sector, index }: SectorDetailPanelProps) {
  const Icon = sector.icon
  const sectorIndex = typeof index === 'number' ? index + 1 : undefined

  return (
    <div
      className="sector-detail-panel is-visible"
      id={`sector-panel-${sector.id}`}
      role="region"
      aria-labelledby={`sector-heading-${sector.id}`}
    >
      <div className="sector-panel-header">
        <div className="sector-panel-badge">
          <Icon aria-hidden="true" />
          <span>
            {sectorIndex ? `SETOR ${String(sectorIndex).padStart(2, '0')} · ` : ''}
            {sector.name.toUpperCase()}
          </span>
        </div>
        <div className="sector-panel-kpi">
          <strong className="kpi-value">{KPI_PROMISE}</strong>
        </div>
      </div>

      <div className="sector-panel-body">
        <div className="sector-panel-main">
          <h3 id={`sector-heading-${sector.id}`}>{sector.name}</h3>
          <p className="sector-panel-desc">{sector.description || sector.tagline}</p>

          <div className="sector-panel-cards">
            <div className="sector-subcard sector-subcard-pain">
              <span className="subcard-title">
                <AlertTriangle aria-hidden="true" /> Gargalo Crítico Típico
              </span>
              <p>{sector.painPoint}</p>
            </div>

            <div className="sector-subcard sector-subcard-solution">
              <span className="subcard-title">
                <CheckCircle2 aria-hidden="true" /> Alavanca Determinística VETOR MASTER
              </span>
              <p>
                {sector.solutionPillar ||
                  'Diagnóstico Estratégico que mapeia os gargalos reais da operação e prioriza ações determinísticas de alto impacto com devolutiva de 45 min.'}
              </p>
            </div>
          </div>
        </div>

        <div className="sector-panel-action">
          <div className="sector-action-box">
            <h4>Pronto para destravar o setor de {sector.name}?</h4>
            <p>
              {sector.unlock ||
                `A VETOR MASTER destrava a sua operação de ${sector.name} onde a margem escapa. Responda o Questionário Estratégico e receba o diagnóstico completo.`}
            </p>
            <Button className="conversion-button w-full" size="lg" asChild>
              <Link to={`/questionario/${sector.id}`}>
                Diagnóstico para {sector.name}
                <ArrowRight aria-hidden="true" />
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
