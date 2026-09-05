import {
  ArrowRight,
  CheckCircle2,
  Clock,
  Cpu,
  Gauge,
  Layers,
  ShieldCheck,
  Sparkles,
  Target,
} from 'lucide-react'
import BrandLogo from '@/components/BrandLogo'
import { Button } from '@/components/ui/button'

interface VetorMasterEscapePanelProps {
  onStartDiagnosis: () => void
}

export function VetorMasterEscapePanel({ onStartDiagnosis }: VetorMasterEscapePanelProps) {
  return (
    <div className="prison-escape-panel-wrapper reveal">
      {/* Moldura principal com cabeçalho de status executivo */}
      <div className="prison-escape-panel" aria-label="Painel Executivo de Rompimento VETOR MASTER">
        {/* Topbar estilo cockpit / console executivo */}
        <div className="escape-panel-topbar">
          <div className="escape-panel-signals">
            <span className="signal-led signal-led-blue" />
            <span className="signal-led signal-led-green" />
            <span className="signal-label">
              CONSOLE ESTRATÉGICO VETOR MASTER · VERSÃO EXECUTIVA
            </span>
          </div>
          <div className="escape-panel-status-tag">
            <span className="status-ping" />
            <span className="status-tag-text">SISTEMA ATIVO · MOTOR DETERMINÍSTICO</span>
          </div>
        </div>

        {/* Corpo principal do painel */}
        <div className="escape-panel-body">
          {/* Lado esquerdo: Marca oficial, síntese do instrumento e texto curto de apoio */}
          <div className="escape-panel-left">
            <div className="escape-panel-brand-header">
              <BrandLogo variant="logo5e" className="escape-panel-logo" />
              <span className="escape-panel-sub-brand">
                METODOLOGIA DE ROMPIMENTO DA SOBRECARGA
              </span>
            </div>

            <div className="escape-panel-manifesto">
              <span className="escape-panel-manifesto-badge">
                <Target aria-hidden="true" />
                INSTRUMENTO DE TRANSIÇÃO
              </span>
              <p className="escape-panel-quote">
                “Não é sobre um dashboard bonito. É sobre você tomar decisões com a cabeça fora da
                operação.”
              </p>
              <p className="escape-panel-explainer">
                Uma leitura analítica profunda para substituir a solidão decisória por vetores
                matemáticos e governança executiva de C-Level — com zero alucinação.
              </p>
            </div>

            {/* Checklist técnico sóbrio */}
            <div className="escape-panel-pillars">
              <div className="escape-pillar-item">
                <ShieldCheck aria-hidden="true" />
                <span>Base em 138 obras de referência e 40 anos de decisões executivas</span>
              </div>
              <div className="escape-pillar-item">
                <Layers aria-hidden="true" />
                <span>Tríade Direção · Conexão · Crescimento em 12 setores da economia</span>
              </div>
              <div className="escape-pillar-item">
                <Cpu aria-hidden="true" />
                <span>Zero especulação de IA genérica: motor 100% determinístico</span>
              </div>
            </div>
          </div>

          {/* Lado direito: As 3 métricas reais do método codificadas + gráfico de nó determinístico */}
          <div className="escape-panel-right">
            <div className="escape-metrics-header">
              <div className="metrics-header-left">
                <Gauge aria-hidden="true" />
                <span>PARÂMETROS DE EXECUÇÃO E RIGOR</span>
              </div>
              <span className="metrics-header-code">SLA-VETOR-2026</span>
            </div>

            {/* As 3 métricas reais exigidas */}
            <div className="escape-metrics-grid">
              <div className="escape-metric-card metric-card-sla">
                <div className="metric-card-top">
                  <span className="metric-tag">SLA DE ENTREGA</span>
                  <Clock className="metric-icon" aria-hidden="true" />
                </div>
                <div className="metric-primary-val">72h</div>
                <strong className="metric-primary-label">Diagnóstico em 72h</strong>
                <p className="metric-desc">
                  Mapeamento analítico estruturado dos gargalos e rotas críticas do seu setor.
                </p>
                <div className="metric-indicator-bar">
                  <span className="indicator-fill indicator-blue" style={{ width: '100%' }} />
                </div>
              </div>

              <div className="escape-metric-card metric-card-team">
                <div className="metric-card-top">
                  <span className="metric-tag">AGENDAMENTO EXECUTIVO</span>
                  <CheckCircle2 className="metric-icon" aria-hidden="true" />
                </div>
                <div className="metric-primary-val">Até 5 dias</div>
                <strong className="metric-primary-label">Retorno da equipe em até 5 dias</strong>
                <p className="metric-desc">
                  Devolutiva executiva estruturada de 45 minutos com especialista C-Level.
                </p>
                <div className="metric-indicator-bar">
                  <span className="indicator-fill indicator-green" style={{ width: '100%' }} />
                </div>
              </div>

              <div className="escape-metric-card metric-card-accuracy">
                <div className="metric-card-top">
                  <span className="metric-tag">RIGOR MATEMÁTICO</span>
                  <Sparkles className="metric-icon" aria-hidden="true" />
                </div>
                <div className="metric-primary-val">95%+</div>
                <strong className="metric-primary-label">Acurácia semântica acima de 95%</strong>
                <p className="metric-desc">
                  Consistência analítica determinística ancorada nas 138 obras de referência.
                </p>
                <div className="metric-indicator-bar">
                  <span className="indicator-fill indicator-dual" style={{ width: '95%' }} />
                </div>
              </div>
            </div>

            {/* Visual esquemático abstrato (nós hexagonais / vetor de rompimento) */}
            <div className="escape-network-diagram" aria-hidden="true">
              <svg viewBox="0 0 540 88" className="escape-svg-grid">
                <defs>
                  <linearGradient id="vetorEscapeGradient" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stopColor="#0066CC" />
                    <stop offset="100%" stopColor="#22B14C" />
                  </linearGradient>
                </defs>
                {/* Linhas de conexão executivas */}
                <path
                  d="M20 44 L110 44 L160 20 L270 20 L320 60 L420 60 L460 44 L520 44"
                  stroke="#cbd5e1"
                  strokeWidth="1.5"
                  strokeDasharray="4 4"
                  fill="none"
                />
                <path
                  d="M20 44 L110 44 L160 20 L270 20 L320 20 L400 20 L520 20"
                  stroke="url(#vetorEscapeGradient)"
                  strokeWidth="2"
                  fill="none"
                />
                {/* Nós */}
                <circle cx="20" cy="44" r="4" fill="#0066CC" />
                <circle cx="110" cy="44" r="5" fill="#0066CC" />
                <circle cx="160" cy="20" r="5" fill="#0066CC" />
                <circle cx="270" cy="20" r="6" fill="#0066CC" stroke="#ffffff" strokeWidth="2" />
                <circle cx="320" cy="60" r="4" fill="#94a3b8" />
                <circle cx="420" cy="60" r="4" fill="#94a3b8" />
                <circle cx="460" cy="44" r="5" fill="#22B14C" />
                <circle cx="520" cy="20" r="7" fill="#22B14C" stroke="#ffffff" strokeWidth="2" />
              </svg>
              <div className="escape-diagram-labels">
                <span className="diagram-step">01. Coleta de Gargalos</span>
                <span className="diagram-step">02. Motor Determinístico (72h)</span>
                <span className="diagram-step highlight">03. Rompimento da Prisão</span>
              </div>
            </div>
          </div>
        </div>

        {/* Rodapé interno do painel: transição clara com a pergunta de rompimento e CTA verde */}
        <div className="escape-panel-footer">
          <div className="escape-footer-text">
            <span className="escape-footer-eyebrow">HORIZONTE DECISÓRIO</span>
            <p className="escape-footer-question">
              Você está pronto para romper a Prisão do Fundador?
            </p>
          </div>
          <Button
            className="conversion-button escape-panel-cta"
            size="lg"
            type="button"
            onClick={onStartDiagnosis}
          >
            Comece seu diagnóstico agora
            <ArrowRight aria-hidden="true" />
          </Button>
        </div>
      </div>
    </div>
  )
}
