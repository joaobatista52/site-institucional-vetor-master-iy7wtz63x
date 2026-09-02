import type { LucideIcon } from 'lucide-react'
import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import { leadSectors } from '@/data/sectors'
import { Button } from '@/components/ui/button'

export default function Sectors() {
  return (
    <div className="sectors-page">
      <section className="sectors-page-hero">
        <div className="site-container">
          <span className="eyebrow">PARA SEU SETOR</span>
          <h1>Escolha o seu setor para iniciar o Questionário Estratégico.</h1>
          <p>
            Cada um dos 12 setores possui gargalos e alavancas próprias. O Questionário Estratégico
            é aplicado sobre a realidade do seu segmento — com o mesmo rigor determinístico e zero
            alucinação.
          </p>
          <div className="sectors-page-hero-badges">
            <span>Diagnóstico em 72h</span>
            <span>Devolutiva executiva de 45 min</span>
            <span>Retorno da equipe em até 5 dias</span>
          </div>
        </div>
      </section>

      <section className="section sectors-page-body">
        <div className="site-container">
          <div className="sectors-page-grid">
            {leadSectors.map((sector, index) => {
              const SectorIcon = sector.icon
              return (
                <Link
                  key={sector.id}
                  to={`/questionario/${sector.id}`}
                  className="sector-page-card"
                >
                  <div className="sector-page-card-top">
                    <div className="sector-box-icon">
                      <SectorIcon aria-hidden="true" />
                    </div>
                    <span className="sector-box-number">{String(index + 1).padStart(2, '0')}</span>
                  </div>
                  <strong className="sector-box-title">{sector.name}</strong>
                  <span className="sector-box-tagline">{sector.tagline}</span>
                  <div className="sector-page-card-pain">
                    <span className="sector-page-card-pain-label">GARGALO TÍPICO</span>
                    <p>{sector.painPoint}</p>
                  </div>
                  <span className="sector-page-card-cta">
                    Responder o questionário <ArrowRight aria-hidden="true" />
                  </span>
                </Link>
              )
            })}
          </div>

          <div className="sector-cta">
            <div>
              <span className="eyebrow">SEU PRÓXIMO VETOR</span>
              <p>
                Responda o Questionário Estratégico do seu setor e descubra o caminho certo para
                romper o teto do seu faturamento.
              </p>
            </div>
            <Button className="conversion-button" size="lg" asChild>
              <a
                href="https://wa.me/?text=Ol%C3%A1%2C%20quero%20come%C3%A7ar%20meu%20Diagn%C3%B3stico%20Estrat%C3%A9gico%20com%20a%20VETOR%20MASTER."
                target="_blank"
                rel="noreferrer"
              >
                Falar com a equipe <ArrowRight aria-hidden="true" />
              </a>
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}
