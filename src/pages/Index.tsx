import { useEffect, useRef, useState, type ComponentType } from 'react'
import {
  AlertTriangle,
  ArrowRight,
  BarChart3,
  BriefcaseBusiness,
  Building2,
  Check,
  CheckCircle2,
  Clock3,
  Cpu,
  Dumbbell,
  Factory,
  GraduationCap,
  HardHat,
  HeartPulse,
  LineChart,
  Lock,
  Network,
  Scale,
  ShieldAlert,
  ShieldCheck,
  ShoppingBag,
  Sparkles,
  Sprout,
  Target,
  TrendingUp,
  Truck,
  UserCheck,
  UserRoundCheck,
  Users,
  Zap,
} from 'lucide-react'

import BrandLogo from '@/components/BrandLogo'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'

const whatsappLink =
  'https://wa.me/?text=Ol%C3%A1%2C%20quero%20come%C3%A7ar%20meu%20Diagn%C3%B3stico%20Estrat%C3%A9gico%20com%20a%20VETOR%20MASTER.'

type Icon = ComponentType<{ className?: string; 'aria-hidden'?: boolean }>

const featuredSectors: Array<{ name: string; description: string; icon: Icon }> = [
  {
    name: 'Saúde',
    description: 'Decisões de gestão com precisão, eficiência operacional e visão de escala.',
    icon: HeartPulse,
  },
  {
    name: 'Varejo',
    description: 'Margem, canais e recorrência organizados em uma rota objetiva de crescimento.',
    icon: ShoppingBag,
  },
  {
    name: 'Serviços Profissionais',
    description: 'Estrutura comercial, posicionamento e capacidade de entrega sob controle.',
    icon: BriefcaseBusiness,
  },
]

const secondarySectors: Array<{ name: string; icon: Icon }> = [
  { name: 'Indústria', icon: Factory },
  { name: 'Agronegócio', icon: Sprout },
  { name: 'Tecnologia e Startups', icon: Cpu },
  { name: 'Construção Civil', icon: HardHat },
  { name: 'Transporte e Logística', icon: Truck },
  { name: 'Educação', icon: GraduationCap },
  { name: 'Academias de Ginástica', icon: Dumbbell },
]

const solutions = [
  {
    name: 'SaaS',
    price: 'R$ 1.190',
    description: 'Inteligência sob demanda para monitoramento contínuo.',
    badge: 'EM BREVE',
    icon: BarChart3,
    detail: 'Indicadores estratégicos e evolução da empresa em uma leitura contínua.',
  },
  {
    name: 'MaaS Híbrido',
    price: 'R$ 3.290',
    description: 'A união do algoritmo determinístico com supervisão executiva.',
    badge: 'MAIS ESCOLHIDO',
    icon: Network,
    detail: 'Direção algorítmica com validação humana para acelerar decisões críticas.',
    featured: true,
  },
  {
    name: 'Bespoke/CaaS',
    price: 'R$ 15.750',
    description: 'Diagnóstico profundo e acompanhamento estratégico personalizado.',
    badge: 'ALTA COMPLEXIDADE',
    icon: UserRoundCheck,
    detail: 'Atuação próxima para cenários que exigem visão executiva sob medida.',
  },
]

const faqItems = [
  {
    question: 'Em quais regiões vocês atuam?',
    answer:
      'Atendimento prioritário em São Paulo e Distrito Federal. Demais regiões do Sudeste e Sul: sob consulta — retorno em até 5 dias.',
  },
  {
    question: 'O que é um Diagnóstico Estratégico determinístico com zero alucinação?',
    answer:
      'Ao contrário de IAs generativas abertas que inventam cenários e premissas (risco de alucinação), o motor do Vetor Master é determinístico: codifica mais de 40 anos de decisões executivas reais e uma base de 138 obras de referência. Cada recomendação possui rastreabilidade lógica, rigor analítico e zero especulação.',
  },
  {
    question: 'O diagnóstico fica pronto em quanto tempo?',
    answer:
      'O Diagnóstico Estratégico é entregue em até 72h após a consolidação das respostas e dos dados necessários. O retorno inicial da equipe com o plano de ação ocorre em até 5 dias.',
  },
  {
    question: 'Qual é o perfil e porte de empresa atendido?',
    answer:
      'O Vetor Master é desenhado especificamente para PMEs brasileiras com faturamento anual de R$ 400 mil a R$ 150 milhões, com foco em destravar a sobrecarga decisória do fundador e destravar o crescimento sustentável.',
  },
  {
    question: 'Qual é o investimento inicial?',
    answer:
      'As soluções partem de R$ 1.190/mês no modelo SaaS, com opções híbridas (MaaS Híbrido a R$ 3.290/mês) e personalizadas (Bespoke/CaaS a R$ 15.750/mês) conforme a maturidade e a complexidade da sua operação.',
  },
  {
    question: 'Como o Vetor Master se compara a uma Big Four ou a uma IA genérica?',
    answer:
      'As Big Four são precisas, mas custam dezenas de milhares de reais e exigem meses de consultoria. As IAs genéricas são rápidas e baratas, porém superficiais e alucinam sem entender o contexto das PMEs brasileiras. O Vetor Master é o meio inteligente: rigor executivo determinístico de C-Level, entrega em 72h, zero alucinação e preço acessível de software.',
  },
]

function SectionHeading({
  eyebrow,
  title,
  description,
  align = 'left',
}: {
  eyebrow: string
  title: string
  description?: string
  align?: 'left' | 'center'
}) {
  return (
    <div className={`section-heading ${align === 'center' ? 'is-centered' : ''}`}>
      <span className="eyebrow">{eyebrow}</span>
      <h2>{title}</h2>
      {description ? <p>{description}</p> : null}
    </div>
  )
}

function AnimatedStat({
  value,
  suffix,
  prefix,
  label,
  source,
}: {
  value: number
  suffix?: string
  prefix?: string
  label: string
  source?: string
}) {
  const [displayValue, setDisplayValue] = useState(0)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const node = ref.current
    if (!node) return

    let animationFrame = 0
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return
        const duration = 1200
        const start = performance.now()

        const tick = (now: number) => {
          const progress = Math.min((now - start) / duration, 1)
          const eased = 1 - Math.pow(1 - progress, 3)
          setDisplayValue(Math.round(value * eased))
          if (progress < 1) animationFrame = requestAnimationFrame(tick)
        }

        animationFrame = requestAnimationFrame(tick)
        observer.disconnect()
      },
      { threshold: 0.35 },
    )

    observer.observe(node)
    return () => {
      observer.disconnect()
      cancelAnimationFrame(animationFrame)
    }
  }, [value])

  return (
    <div
      className="stat-item"
      ref={ref}
      aria-label={`${label} ${prefix ?? ''}${value}${suffix ?? ''}`}
    >
      <strong>
        {prefix}
        {displayValue}
        {suffix}
      </strong>
      <span>{label}</span>
      {source ? <small className="stat-source">{source}</small> : null}
    </div>
  )
}

function HeroPattern() {
  return (
    <svg className="hero-pattern" viewBox="0 0 760 680" aria-hidden="true">
      <defs>
        <linearGradient id="patternGradient" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#0066CC" />
          <stop offset="100%" stopColor="#22B14C" />
        </linearGradient>
      </defs>
      <g fill="none" stroke="url(#patternGradient)" strokeWidth="1.8" opacity="0.65">
        <path d="M98 324 154 292l56 32v64l-56 32-56-32Z" />
        <path d="M210 260 266 228l56 32v64l-56 32-56-32Z" />
        <path d="M322 324 378 292l56 32v64l-56 32-56-32Z" />
        <path d="M266 420 322 388l56 32v64l-56 32-56-32Z" />
        <path d="M434 228 490 196l56 32v64l-56 32-56-32Z" />
        <path d="m490 196 108-68-16 124" />
        <path d="m598 128-52 100" />
      </g>
      <g fill="#0066CC" opacity=".75">
        <circle cx="154" cy="292" r="5" />
        <circle cx="210" cy="324" r="5" />
        <circle cx="266" cy="356" r="5" />
      </g>
      <g fill="#22B14C" opacity=".75">
        <circle cx="434" cy="324" r="5" />
        <circle cx="490" cy="196" r="5" />
        <circle cx="546" cy="228" r="5" />
      </g>
    </svg>
  )
}

export default function Index() {
  useEffect(() => {
    const elements = document.querySelectorAll<HTMLElement>('.reveal')
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible')
            observer.unobserve(entry.target)
          }
        })
      },
      { threshold: 0.12, rootMargin: '0px 0px -40px' },
    )

    elements.forEach((element) => observer.observe(element))
    return () => observer.disconnect()
  }, [])

  return (
    <>
      {/* 1. HERO — REDESENHADO, MAIS PRÓXIMO DO TOPO, PAINEL VISUAL COESO */}
      <section className="hero-section" id="inicio">
        <HeroPattern />
        <div className="site-container hero-grid">
          <div className="hero-copy">
            <div className="hero-overline">
              <ShieldCheck aria-hidden="true" />
              INTELIGÊNCIA ESTRATÉGICA DETERMINÍSTICA · ZERO ALUCINAÇÃO
            </div>

            <h1>Diagnósticos estratégicos em 72h. Expertise de C-level. Preço de SaaS.</h1>

            <p className="hero-slogan">
              Expertise Executiva. Velocidade Tecnológica. Preço Acessível.
            </p>

            <p className="hero-positioning">
              A primeira plataforma determinística que democratiza o acesso ao C-Level para PMEs
              brasileiras (faturamento de R$ 400 mil a R$ 150 milhões) — codificando mais de 40 anos
              de decisões executivas em um motor digital rápido, acessível e com{' '}
              <strong>zero alucinação</strong>.
            </p>

            <p className="hero-subtitle">C-Level as a Service — Mentorship as a Software</p>

            <div className="hero-actions">
              <Button className="conversion-button hero-button" size="lg" asChild>
                <a href={whatsappLink} target="_blank" rel="noreferrer">
                  Comece seu diagnóstico agora
                  <ArrowRight aria-hidden="true" />
                </a>
              </Button>
              <div className="hero-sla-badge">
                <Clock3 aria-hidden="true" />
                <span>Devolutiva executiva de 45 min em até 5 dias</span>
              </div>
            </div>

            <div className="hero-proof" aria-label="Diferenciais da VETOR MASTER">
              <span>
                <Check aria-hidden="true" /> Zero alucinação (não é IA genérica)
              </span>
              <span>
                <Check aria-hidden="true" /> 40 anos de decisões C-Level codificadas
              </span>
              <span>
                <Check aria-hidden="true" /> SLA de 72h com suporte executivo
              </span>
            </div>
          </div>

          {/* Painel Hero Direito — Estrutura coesa e limpa com Logo 5 em destaque e infográfico de 3 pilares integrado */}
          <div className="hero-visual" aria-label="Painel de Inteligência Executiva VETOR MASTER">
            <div className="hero-card-container">
              {/* Topbar do Dashboard */}
              <div className="hero-card-header">
                <div className="hero-card-dots">
                  <span className="dot dot-red" />
                  <span className="dot dot-yellow" />
                  <span className="dot dot-green" />
                </div>
                <div className="hero-card-status">
                  <span className="status-live-dot" />
                  <span>Motor C-Level Determinístico</span>
                </div>
                <span className="hero-card-pill">SLA 72h</span>
              </div>

              {/* Logo 5 Oficial em Destaque no Topo do Painel */}
              <div className="hero-card-brand">
                <BrandLogo variant="stacked" className="hero-brand-logo" />
              </div>

              {/* Métricas Principais Integradas */}
              <div className="hero-metrics-strip">
                <div className="hero-metric-cell">
                  <span className="metric-title">Acurácia Semântica</span>
                  <strong className="metric-value">95%+</strong>
                  <span className="metric-caption">138 obras de referência</span>
                </div>
                <div className="hero-metric-cell">
                  <span className="metric-title">Tempo de Entrega</span>
                  <strong className="metric-value">72h</strong>
                  <span className="metric-caption">Diagnóstico estruturado</span>
                </div>
              </div>

              {/* Infográfico Coeso dos 3 Pilares Integrados na Rota de Valor */}
              <div className="hero-pillars-block">
                <div className="pillars-block-title">
                  <span>Tríade de Valor Determinística</span>
                  <small>DIREÇÃO · CONEXÃO · CRESCIMENTO</small>
                </div>

                <div className="pillar-integrated-list">
                  <div className="pillar-card pillar-card-direction">
                    <div className="pillar-icon-badge blue">
                      <Target aria-hidden="true" />
                    </div>
                    <div className="pillar-info">
                      <div className="pillar-name">
                        <strong>Direção Estratégica</strong>
                        <span className="pillar-tag">Governança & Prioridades</span>
                      </div>
                      <p>Fim da solidão decisória: mapa de prioridades de alto impacto.</p>
                    </div>
                  </div>

                  <div className="pillar-card pillar-card-connection">
                    <div className="pillar-icon-badge cyan">
                      <Network aria-hidden="true" />
                    </div>
                    <div className="pillar-info">
                      <div className="pillar-name">
                        <strong>Conexão C-Level</strong>
                        <span className="pillar-tag">MaaS + CaaS Integrados</span>
                      </div>
                      <p>Supervisão executiva aliada a algoritmos sem alucinação.</p>
                    </div>
                  </div>

                  <div className="pillar-card pillar-card-growth">
                    <div className="pillar-icon-badge green">
                      <TrendingUp aria-hidden="true" />
                    </div>
                    <div className="pillar-info">
                      <div className="pillar-name">
                        <strong>Crescimento Exponencial</strong>
                        <span className="pillar-tag">Escala Sustentável</span>
                      </div>
                      <p>Destrave a operação para romper o teto do faturamento.</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Footer do Painel */}
              <div className="hero-card-footer">
                <div className="hero-footer-item">
                  <CheckCircle2 aria-hidden="true" />
                  <span>Para PMEs de R$ 400k a R$ 150M</span>
                </div>
                <div className="hero-footer-item">
                  <CheckCircle2 aria-hidden="true" />
                  <span>Zero Alucinação</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. FAIXA DE MÉTRICAS & DADOS DE URGÊNCIA */}
      <section className="stats-bar" aria-label="VETOR MASTER em números e panorama das PMEs">
        <div className="site-container stats-grid">
          <AnimatedStat
            value={40}
            suffix=" anos"
            label="de experiência executiva codificada"
            source="Decisões reais C-Level"
          />
          <AnimatedStat
            value={98}
            suffix="%"
            label="dos líderes de PME decidem sozinhos"
            source="Cabeça de Dono (Itaú + Locomotiva / FDC)"
          />
          <AnimatedStat
            value={60}
            suffix="%"
            label="das PMEs fecham em até 5 anos por gestão"
            source="Dado oficial Sebrae"
          />
          <AnimatedStat
            value={72}
            suffix="h"
            label="SLA de entrega do Diagnóstico Estratégico"
            source="Retorno e devolutiva em até 5 dias"
          />
        </div>
      </section>

      {/* SEÇÃO ESPECIAL GTM: A PRISÃO DO FUNDADOR & CONTRASTE DE MERCADO */}
      <section
        className="section founder-trap-section"
        aria-label="A Prisão do Fundador e o Gargalo do Crescimento"
      >
        <div className="site-container">
          <div className="trap-header reveal">
            <span className="eyebrow">DIAGNÓSTICO DE MERCADO</span>
            <h2>Você se tornou o principal gargalo da sua própria empresa?</h2>
            <p className="trap-intro">
              Nas PMEs brasileiras, o fundador é quem resolve o comercial, a operação, as finanças,
              a gestão de pessoas e a estratégia. Essa sobrecarga gera a{' '}
              <strong>"Prisão do Fundador"</strong> — onde trabalhar mais horas não produz mais
              resultado, apenas mais exaustão e solidão decisória.
            </p>
          </div>

          <div className="trap-grid reveal">
            <div className="trap-card">
              <div className="trap-card-icon danger">
                <Users aria-hidden="true" />
              </div>
              <h3>98% Decidem Sozinhos</h3>
              <p>
                Líderes de PMEs acumulam sozinhos a responsabilidade por uma média de{' '}
                <strong>5 áreas críticas</strong> de decisão, sem um C-Level ou conselho para
                desafiar suas premissas.
              </p>
              <span className="trap-source">
                Pesquisa "Cabeça de Dono" · Itaú + Locomotiva / FDC
              </span>
            </div>

            <div className="trap-card">
              <div className="trap-card-icon warning">
                <Clock3 aria-hidden="true" />
              </div>
              <h3>78% Trabalham &gt; 50h/Semana</h3>
              <p>
                Presos no operacional diário e em apagar incêndios constantes, os fundadores não
                encontram tempo para planejar o próximo vetor de crescimento do negócio.
              </p>
              <span className="trap-source">Fundação Dom Cabral</span>
            </div>

            <div className="trap-card">
              <div className="trap-card-icon danger">
                <ShieldAlert aria-hidden="true" />
              </div>
              <h3>60% Fecham em 5 Anos</h3>
              <p>
                A mortalidade precoce das empresas não decorre de falta de esforço, mas de{' '}
                <strong>falhas de gestão estratégica</strong> e ausência de inteligência executiva
                preventiva.
              </p>
              <span className="trap-source">Estudo de Sobrevivência · Sebrae</span>
            </div>
          </div>

          {/* O CONTRASTE DE MERCADO: Big Four vs IAs Genéricas vs VETOR MASTER */}
          <div className="market-contrast-box reveal">
            <div className="contrast-intro">
              <span className="eyebrow">O DILEMA DA PME BRASILEIRA</span>
              <h3>Por que as alternativas tradicionais falham com a sua empresa?</h3>
              <p>
                O mercado oferecia apenas dois caminhos inadequados. O Vetor Master é a terceira
                via.
              </p>
            </div>

            <div className="contrast-cards-grid">
              <div className="contrast-card contrast-card-bigfour">
                <div className="contrast-badge negative">BIG FOUR & CONSULTORIAS</div>
                <h4>Precisas, mas proibitivas</h4>
                <ul className="contrast-list">
                  <li>Custo de R$ 50k a R$ 200k por projeto</li>
                  <li>Processos lentos que levam de 3 a 6 meses</li>
                  <li>Diagnósticos teóricos e difíceis de executar</li>
                </ul>
                <div className="contrast-tag tag-bad">Inacessível para PMEs</div>
              </div>

              <div className="contrast-card contrast-card-ai">
                <div className="contrast-badge warning">IAs GENÉRICAS ABERTAS</div>
                <h4>Rápidas, mas superficiais e perigosas</h4>
                <ul className="contrast-list">
                  <li>
                    Risco crítico de <strong>alucinação</strong> e respostas inventadas
                  </li>
                  <li>Conselhos genéricos sem contexto do negócio brasileiro</li>
                  <li>Sem responsabilidade nem validação de C-Level</li>
                </ul>
                <div className="contrast-tag tag-warning">Risco de Alucinação</div>
              </div>

              <div className="contrast-card contrast-card-vetor">
                <div className="contrast-badge winner">VETOR MASTER · O MEIO INTELIGENTE</div>
                <h4>C-Level Determinístico para PMEs</h4>
                <ul className="contrast-list">
                  <li>
                    <strong>Zero Alucinação:</strong> Lógica determinística e base de 138 obras
                  </li>
                  <li>
                    <strong>Entrega em 72h</strong> com devolutiva de 45 minutos
                  </li>
                  <li>
                    <strong>Preço acessível de software</strong> a partir de R$ 1.190/mês
                  </li>
                </ul>
                <div className="contrast-tag tag-good">O C-Level que cabe no seu orçamento</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. O MÉTODO / COMO FUNCIONA (Ordem do menu: Início -> O Método -> Setores -> Soluções -> FAQ -> Fundador) */}
      <section className="section process-section" id="metodo">
        <div className="site-container">
          <SectionHeading
            eyebrow="O MÉTODO"
            title="Como funciona o Diagnóstico Estratégico"
            description="Três passos objetivos e determinísticos separam o seu cenário de sobrecarga de um plano executivo de alto impacto com zero alucinação."
            align="center"
          />

          <div className="process-flow reveal">
            {[
              {
                number: '01',
                title: 'Responda o Questionário Estratégico',
                description:
                  'Mapeamento objetivo dos dados do seu setor, números da empresa, margens, gargalos operacionais e o desafio crítico a ser superado.',
                badge: '15 minutos',
              },
              {
                number: '02',
                title: 'Receba o Diagnóstico Estratégico em 72h',
                description:
                  'Leitura analítica profunda processada por nosso motor determinístico (138 obras e 40 anos de decisões executivas codificadas com zero alucinação).',
                badge: 'SLA de 72h',
              },
              {
                number: '03',
                title: 'Agende a Devolutiva Executiva de 45 min',
                description:
                  'Reunião estratégica estruturada: prioridades imediatas, vetores de crescimento sustentável e plano de ação sem jargões de consultoria.',
                badge: 'Retorno em até 5 dias',
              },
            ].map((step, index) => (
              <article className="process-step" key={step.number}>
                <div className="step-marker">
                  <span>{step.number}</span>
                </div>
                {index < 2 ? (
                  <div className="step-connector" aria-hidden="true">
                    <ArrowRight />
                  </div>
                ) : null}
                <span className="step-badge">{step.badge}</span>
                <h3>{step.title}</h3>
                <p>{step.description}</p>
              </article>
            ))}
          </div>

          <div className="return-note reveal">
            <Clock3 aria-hidden="true" />
            <div>
              <strong>Retorno da equipe em até 5 dias com agendamento da devolutiva.</strong>
              <span>
                Você recebe clareza executiva sobre o próximo movimento, sem reuniões infindáveis ou
                relatórios de 100 páginas que ninguém lê.
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* 4. PARA SEU SETOR (10 setores) */}
      <section className="section sectors-section" id="setores">
        <div className="site-container">
          <SectionHeading
            eyebrow="PARA SEU SETOR"
            title="Estratégia específica para a realidade da sua empresa."
            description="O mesmo rigor determinístico, aplicado aos indicadores, gargalos e alavancas que definem os 10 principais setores da economia brasileira."
          />

          <div className="featured-sector-grid reveal">
            {featuredSectors.map((sector, index) => {
              const SectorIcon = sector.icon
              return (
                <article className={`sector-card sector-card-${index + 1}`} key={sector.name}>
                  <div className="sector-icon">
                    <SectorIcon aria-hidden={true} />
                  </div>
                  <span className="sector-number">0{index + 1}</span>
                  <h3>{sector.name}</h3>
                  <p>{sector.description}</p>
                  <a className="sector-link" href={whatsappLink} target="_blank" rel="noreferrer">
                    Diagnóstico do setor <ArrowRight aria-hidden="true" />
                  </a>
                </article>
              )
            })}
          </div>

          <div className="secondary-sector-grid reveal">
            {secondarySectors.map((sector) => {
              const SectorIcon = sector.icon
              return (
                <div className="secondary-sector" key={sector.name}>
                  <SectorIcon aria-hidden={true} />
                  <span>{sector.name}</span>
                </div>
              )
            })}
          </div>

          <div className="sector-cta reveal">
            <div>
              <span className="eyebrow">SEU PRÓXIMO VETOR</span>
              <p>
                Existe uma rota estratégica sob medida para cada segmento e fase de maturidade.
                Responda o Questionário Estratégico do seu setor e descubra o caminho certo para
                romper o teto do seu faturamento.
              </p>
            </div>
            <Button className="conversion-button" size="lg" asChild>
              <a href={whatsappLink} target="_blank" rel="noreferrer">
                Comece seu diagnóstico agora
                <ArrowRight aria-hidden="true" />
              </a>
            </Button>
          </div>
        </div>
      </section>

      {/* 5. SOLUÇÕES (SaaS, MaaS Híbrido, Bespoke/CaaS) */}
      <section className="section solutions-section" id="solucoes">
        <div className="site-container">
          <SectionHeading
            eyebrow="SOLUÇÕES"
            title="Expertise de C-Level no modelo certo para sua operação."
            description="Da inteligência contínua ao acompanhamento executivo direto: escolha a profundidade que sua empresa exige agora para romper a Prisão do Fundador."
            align="center"
          />

          <div className="solutions-grid reveal">
            {solutions.map((solution) => {
              const SolutionIcon = solution.icon
              return (
                <article
                  className={`solution-card ${solution.featured ? 'is-featured' : ''}`}
                  key={solution.name}
                >
                  {solution.featured ? <div className="featured-label">MAIS ESCOLHIDO</div> : null}
                  <div className="solution-topline">
                    <div className="solution-icon">
                      <SolutionIcon aria-hidden="true" />
                    </div>
                    <Badge className={solution.name === 'SaaS' ? 'badge-soon' : 'badge-neutral'}>
                      {solution.badge}
                    </Badge>
                  </div>
                  <h3>{solution.name}</h3>
                  <div className="solution-price">
                    <strong>{solution.price}</strong>
                    <span>/mês</span>
                  </div>
                  <p className="solution-description">{solution.description}</p>
                  <div className="solution-divider" />
                  <p className="solution-detail">
                    <Check aria-hidden="true" /> {solution.detail}
                  </p>
                  <div className="solution-action">
                    <Button
                      className={
                        solution.featured
                          ? 'conversion-button w-full'
                          : 'solution-button-outline w-full'
                      }
                      asChild
                    >
                      <a href={whatsappLink} target="_blank" rel="noreferrer">
                        Selecionar plano <ArrowRight aria-hidden="true" />
                      </a>
                    </Button>
                  </div>
                </article>
              )
            })}
          </div>
        </div>
      </section>

      {/* 6. FAQ (Perguntas Frequentes) */}
      <section className="section faq-section" id="faq">
        <div className="site-container faq-layout">
          <div className="faq-intro reveal">
            <SectionHeading
              eyebrow="PERGUNTAS FREQUENTES"
              title="Respostas diretas para decisões objetivas."
              description="Entenda o método determinístico, prazos, política de zero alucinação e cobertura regional antes de iniciar seu Diagnóstico Estratégico."
            />
            <div className="faq-support">
              <Sparkles aria-hidden="true" />
              <p>
                Tem dúvidas sobre o enquadramento do seu faturamento ou setor? Nossa equipe retorna
                em até 5 dias.
              </p>
              <a href="mailto:contato.comercial@vetormaster.com.br">
                Falar com a equipe executiva <ArrowRight aria-hidden="true" />
              </a>
            </div>
          </div>

          <Accordion type="single" collapsible className="faq-accordion reveal">
            {faqItems.map((item, index) => (
              <AccordionItem value={`faq-${index}`} key={item.question}>
                <AccordionTrigger>{item.question}</AccordionTrigger>
                <AccordionContent>{item.answer}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

      {/* 7. SOBRE O FUNDADOR (NOVA SEÇÃO DEDICADA — id="fundador") */}
      <section className="section founder-section" id="fundador">
        <div className="site-container">
          <div className="founder-grid reveal">
            <div className="founder-profile-card">
              <div className="founder-avatar-wrap">
                <div className="founder-avatar-initials">JP</div>
                <div className="founder-experience-chip">
                  <strong>40+</strong>
                  <span>anos de liderança</span>
                </div>
              </div>
              <div className="founder-titles">
                <h3>João Batista de Paula</h3>
                <span className="founder-role">Founder &amp; CEO · VETOR MASTER</span>
              </div>
              <div className="founder-metrics-pills">
                <span className="founder-pill">Direção Estratégica</span>
                <span className="founder-pill">C-Level as a Service</span>
                <span className="founder-pill">Governança Determinística</span>
              </div>
            </div>

            <div className="founder-bio">
              <SectionHeading
                eyebrow="SOBRE O FUNDADOR"
                title="Quarenta anos de decisões executivas traduzidos em código."
                description="O Vetor Master nasceu da vivência real em conselhos e diretorias executivas, identificando o abismo que separa as grandes corporações das PMEs brasileiras."
              />

              <div className="founder-text-body">
                <p>
                  Ao longo de mais de quatro décadas de trajetória corporativa em liderança
                  executiva,
                  <strong> João Batista de Paula</strong> vivenciou os ciclos de crescimento,
                  reestruturação e tomada de decisão em múltiplos setores da economia brasileira.
                </p>
                <p>
                  A constatação foi direta: enquanto grandes corporações contam com conselhos
                  consultivos e consultorias multinacionais milionárias, os líderes de PMEs
                  enfrentam a solidão decisória diária. O <strong>Vetor Master</strong> foi fundado
                  exatamente para democratizar essa inteligência C-Level, codificando heurísticas
                  executivas reais e uma biblioteca de 138 obras seminais em uma plataforma digital
                  acessível, ágil e determinística.
                </p>
              </div>

              <div className="founder-quote">
                <blockquote>
                  “O objetivo da Vetor Master é simples: ser o C-Level que a sua empresa precisa,
                  com a velocidade de um software e o rigor de quem viveu a liderança na prática.”
                </blockquote>
                <cite>— João Batista de Paula, Founder &amp; CEO</cite>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="final-cta-section">
        <div className="site-container final-cta reveal">
          <div>
            <span className="eyebrow eyebrow-light">DECIDA COM PRECISÃO DETERMINÍSTICA</span>
            <h2>
              Pronto para romper a Prisão do Fundador e destravar o crescimento da sua empresa?
            </h2>
            <p className="final-cta-sub">
              Receba seu Diagnóstico Estratégico em 72h e agende uma devolutiva de 45 minutos com a
              nossa equipe.
            </p>
          </div>
          <Button className="final-cta-button" size="lg" asChild>
            <a href={whatsappLink} target="_blank" rel="noreferrer">
              Comece seu diagnóstico agora
              <ArrowRight aria-hidden="true" />
            </a>
          </Button>
        </div>
      </section>
    </>
  )
}
