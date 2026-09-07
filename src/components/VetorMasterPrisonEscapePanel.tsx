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
import vetorMasterSvg from '@/assets/vetor-master2.svg'
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
              <img
                src={vetorMasterSvg}
                alt="VETOR MASTER — Direção · Conexão · Crescimento"
                loading="eager"
                decoding="async"
                className="escape-panel-logo"
              />
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
                <span>PARÂMETROS DE EXECUÇÃO E RIGOR DETERMINÍSTICO</span>
              </div>
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

            {/* Diagrama Esquemático Executivo — Vetor de Rompimento da Prisão do Fundador */}
            <div
              className="escape-network-diagram"
              aria-label="Diagrama da Esteira Estratégica de Rompimento"
            >
              <div className="escape-diagram-header">
                <div className="escape-diagram-title">
                  <span className="diagram-pulse-dot" />
                  <span>CONEXÃO DAS 3 MÉTRICAS DO MÉTODO AO CONSOLE ESTRATÉGICO</span>
                </div>
                <span className="diagram-sla-badge">MOTOR DETERMINÍSTICO</span>
              </div>

              <svg viewBox="0 0 540 126" className="escape-svg-grid" role="img" aria-hidden="true">
                <defs>
                  <linearGradient id="escapeLineGrad1" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0%" stopColor="#0066CC" stopOpacity="0.8" />
                    <stop offset="100%" stopColor="#0066CC" stopOpacity="0.25" />
                  </linearGradient>
                  <linearGradient id="escapeLineGrad2" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#22B14C" stopOpacity="0.85" />
                    <stop offset="100%" stopColor="#22B14C" stopOpacity="0.3" />
                  </linearGradient>
                  <linearGradient id="escapeLineGrad3" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0%" stopColor="#0066CC" stopOpacity="0.85" />
                    <stop offset="50%" stopColor="#1E40AF" stopOpacity="0.6" />
                    <stop offset="100%" stopColor="#22B14C" stopOpacity="0.3" />
                  </linearGradient>
                  <linearGradient id="escapeCoreGrad" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stopColor="#0066CC" />
                    <stop offset="100%" stopColor="#22B14C" />
                  </linearGradient>
                </defs>

                {/* Linha de barramento horizontal superior (alinhada aos 3 cards de métricas) */}
                <line
                  x1="90"
                  y1="12"
                  x2="450"
                  y2="12"
                  stroke="#E2E8F0"
                  strokeWidth="2"
                  strokeDasharray="4 4"
                />

                {/* Feixes convergentes dos 3 cards de métricas em direção ao Hub Central */}
                {/* Feixe da Métrica 1: Diagnóstico em 72h (x=90) */}
                <path
                  d="M90 12 L90 32 Q90 56 180 62 L225 64"
                  stroke="#0066CC"
                  strokeWidth="2"
                  strokeDasharray="6 4"
                  fill="none"
                />
                {/* Feixe da Métrica 2: Retorno em até 5 dias (x=270, centro) */}
                <path d="M270 12 L270 48" stroke="#22B14C" strokeWidth="2.5" fill="none" />
                {/* Feixe da Métrica 3: Acurácia 95%+ (x=450) */}
                <path
                  d="M450 12 L450 32 Q450 56 360 62 L315 64"
                  stroke="url(#escapeCoreGrad)"
                  strokeWidth="2"
                  strokeDasharray="6 4"
                  fill="none"
                />

                {/* Nós de ancoragem superiores (correspondentes a cada card de métrica) */}
                {/* Nó Card 1 (72h) */}
                <circle cx="90" cy="12" r="5" fill="#0066CC" stroke="#FFFFFF" strokeWidth="2" />
                <text
                  x="90"
                  y="26"
                  textAnchor="middle"
                  fill="#0066CC"
                  fontSize="8"
                  fontWeight="800"
                  fontFamily="sans-serif"
                >
                  72h
                </text>

                {/* Nó Card 2 (5 dias) */}
                <circle cx="270" cy="12" r="6" fill="#22B14C" stroke="#FFFFFF" strokeWidth="2" />
                <text
                  x="270"
                  y="26"
                  textAnchor="middle"
                  fill="#22B14C"
                  fontSize="8"
                  fontWeight="800"
                  fontFamily="sans-serif"
                >
                  5 DIAS
                </text>

                {/* Nó Card 3 (95%+) */}
                <circle cx="450" cy="12" r="5" fill="#0066CC" stroke="#FFFFFF" strokeWidth="2" />
                <text
                  x="450"
                  y="26"
                  textAnchor="middle"
                  fill="#0066CC"
                  fontSize="8"
                  fontWeight="800"
                  fontFamily="sans-serif"
                >
                  95%+
                </text>

                {/* Console Central — O Núcleo do Rompimento da Prisão do Fundador */}
                <rect
                  x="180"
                  y="52"
                  width="180"
                  height="34"
                  rx="8"
                  fill="#F8FAFC"
                  stroke="#0066CC"
                  strokeWidth="1.5"
                />
                <circle cx="200" cy="69" r="4" fill="#22B14C" />
                <text
                  x="212"
                  y="66"
                  fill="#0F172A"
                  fontSize="9"
                  fontWeight="800"
                  fontFamily="sans-serif"
                >
                  CONSOLE ESTRATÉGICO
                </text>
                <text
                  x="212"
                  y="78"
                  fill="#64748B"
                  fontSize="8"
                  fontWeight="600"
                  fontFamily="sans-serif"
                >
                  Inteligência C-Level Determinística
                </text>

                {/* Vetor Direcional de Rompimento: Saída da Prisão da Operação -> Cabeça na Estratégia */}
                <path
                  d="M270 86 L270 104 L436 104"
                  stroke="url(#escapeCoreGrad)"
                  strokeWidth="2"
                  fill="none"
                />
                {/* Seta final verde de Rompimento antes do nó */}
                <polygon points="432,100 444,104 432,108" fill="#22B14C" />

                {/* Nó de Saída Efetiva */}
                <circle cx="460" cy="104" r="6" fill="#22B14C" stroke="#FFFFFF" strokeWidth="2" />
                {/* Rótulo de Rompimento centralizado abaixo do nó, 100% contido no viewBox */}
                <text
                  x="460"
                  y="120"
                  textAnchor="middle"
                  fill="#15803D"
                  fontSize="8"
                  fontWeight="800"
                  fontFamily="sans-serif"
                  letterSpacing="0.04em"
                >
                  ROMPIMENTO EXECUTIVO
                </text>
              </svg>

              <div className="escape-diagram-footer-flow">
                <div className="flow-step">
                  <span className="step-num text-[#0066CC]">01</span>
                  <div className="step-content">
                    <strong className="text-[#0F172A]">Diagnóstico em 72h</strong>
                    <span>Varredura profunda dos gargalos</span>
                  </div>
                </div>

                <div className="flow-arrow">&rarr;</div>

                <div className="flow-step">
                  <span className="step-num text-[#22B14C]">02</span>
                  <div className="step-content">
                    <strong className="text-[#0F172A]">Devolutiva em até 5 dias</strong>
                    <span>45 min com executivo C-Level</span>
                  </div>
                </div>

                <div className="flow-arrow">&rarr;</div>

                <div className="flow-step">
                  <span className="step-num text-[#0066CC]">03</span>
                  <div className="step-content">
                    <strong className="text-[#0F172A]">Acurácia 95%+</strong>
                    <span>100% determinístico e auditável</span>
                  </div>
                </div>

                <div className="flow-arrow">&rarr;</div>

                <div className="flow-step highlight">
                  <span className="step-num text-[#22B14C]">&#10003;</span>
                  <div className="step-content">
                    <strong className="text-[#22B14C]">Livre da Prisão do Fundador</strong>
                    <span>No comando do negócio, sem ser refém da operação</span>
                  </div>
                </div>
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
