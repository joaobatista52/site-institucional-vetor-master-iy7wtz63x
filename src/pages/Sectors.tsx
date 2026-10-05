import { useEffect, useRef, useState } from 'react'
import { ArrowRight, Sparkles } from 'lucide-react'
import { leadSectors } from '@/data/sectors'
import { SectorDetailPanel } from '@/components/SectorDetailPanel'
import { SectorModal } from '@/components/SectorModal'
import { Button } from '@/components/ui/button'

const KPI_PROMISE = 'Diagnóstico em 72h · Devolutiva de 45 min'

export default function Sectors() {
  const [selectedSectorId, setSelectedSectorId] = useState<string>('saude')
  const [modalOpen, setModalOpen] = useState<boolean>(false)
  const shouldScrollOnSelectRef = useRef<boolean>(false)

  const activeSector = leadSectors.find((s) => s.id === selectedSectorId) || leadSectors[0]

  const activeIndex = leadSectors.findIndex((s) => s.id === activeSector.id)

  useEffect(() => {
    if (!shouldScrollOnSelectRef.current) return
    shouldScrollOnSelectRef.current = false

    const panel =
      document.getElementById(`sector-panel-${selectedSectorId}`) ||
      document.querySelector('.sector-detail-panel')

    if (panel) {
      panel.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }, [selectedSectorId])

  function handleSelectSector(sectorId: string) {
    shouldScrollOnSelectRef.current = true
    if (sectorId === selectedSectorId) {
      // Se clicou no setor já ativo, rola diretamente para o painel aberto
      const panel =
        document.getElementById(`sector-panel-${sectorId}`) ||
        document.querySelector('.sector-detail-panel')
      if (panel) {
        panel.scrollIntoView({ behavior: 'smooth', block: 'start' })
      }
      shouldScrollOnSelectRef.current = false
    } else {
      setSelectedSectorId(sectorId)
    }
  }

  return (
    <div className="sectors-page">
      <section className="sectors-page-hero">
        <div className="site-container">
          <span className="eyebrow">PARA SEU SETOR</span>
          <h1>Estratégia específica para a realidade da sua empresa.</h1>
          <p>
            Cada um dos 12 setores possui gargalos e alavancas próprias. Clique no card do seu setor
            para visualizar o diagnóstico completo, o gargalo típico, a alavanca determinística e
            iniciar o Questionário Estratégico.
          </p>
          <div className="sectors-page-hero-badges">
            <span>Diagnóstico em 72h</span>
            <span>Devolutiva executiva de 45 min</span>
            <span>Retorno da equipe em até 5 dias</span>
            <span>Zero alucinação</span>
          </div>
        </div>
      </section>

      <section className="section sectors-page-body">
        <div className="site-container">
          {/* Grade Uniforme com os 12 Setores na Sequência Canônica (sem badges, sem destaque) */}
          <div className="sectors-structure-wrap">
            <div
              className="sectors-unified-grid"
              role="tablist"
              aria-label="12 setores atendidos pela VETOR MASTER"
            >
              {leadSectors.map((sector, index) => {
                const SectorIcon = sector.icon
                const isActive = sector.id === selectedSectorId
                return (
                  <button
                    type="button"
                    key={sector.id}
                    role="tab"
                    id={`sector-tab-${sector.id}`}
                    aria-selected={isActive}
                    aria-controls={`sector-panel-${sector.id}`}
                    onClick={() => handleSelectSector(sector.id)}
                    className={`sector-interactive-box ${isActive ? 'is-active' : ''}`}
                  >
                    <div className="sector-box-top">
                      <div className="sector-box-icon">
                        <SectorIcon aria-hidden="true" />
                      </div>
                      <span className="sector-box-number">
                        {String(index + 1).padStart(2, '0')}
                      </span>
                    </div>
                    <strong className="sector-box-title">{sector.name}</strong>
                    <span className="sector-box-tagline">{sector.tagline}</span>
                    <div className="sector-box-kpi-chip">
                      <span>{KPI_PROMISE}</span>
                    </div>
                  </button>
                )
              })}
            </div>
          </div>

          {/* Painel de Destaque Detalhado do Setor Ativo — exatamente o mesmo padrão da landing */}
          {activeSector && (
            <div className="mt-8">
              <div className="flex items-center gap-2 mb-3 text-xs font-bold text-strategic-blue uppercase tracking-wider">
                <Sparkles className="w-4 h-4" />
                <span>Detalhes do setor selecionado</span>
              </div>
              <SectorDetailPanel sector={activeSector} index={activeIndex} />
            </div>
          )}

          <div className="sector-cta">
            <div>
              <span className="eyebrow">SEU PRÓXIMO VETOR</span>
              <p>
                Existe uma rota estratégica sob medida para cada um dos 12 segmentos e fases de
                maturidade. Responda o Questionário Estratégico do seu setor e descubra o caminho
                certo para romper o teto do seu faturamento.
              </p>
            </div>
            <Button
              className="conversion-button"
              size="lg"
              type="button"
              onClick={() => setModalOpen(true)}
            >
              Comece seu diagnóstico agora <ArrowRight aria-hidden="true" />
            </Button>
          </div>
        </div>
      </section>

      <SectorModal
        open={modalOpen}
        onOpenChange={setModalOpen}
        title="Comece seu diagnóstico agora"
        description="Selecione o setor da sua empresa para direcionar o Questionário Estratégico e agendar a devolutiva executiva."
      />
    </div>
  )
}
