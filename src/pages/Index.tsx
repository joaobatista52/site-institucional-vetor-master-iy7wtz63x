import { useEffect, useRef, useState, type ComponentType } from 'react'
import {
  ArrowRight,
  BarChart3,
  BriefcaseBusiness,
  Building2,
  Check,
  Clock3,
  Cpu,
  Dumbbell,
  Factory,
  GraduationCap,
  HardHat,
  HeartPulse,
  LineChart,
  Network,
  ShieldCheck,
  ShoppingBag,
  Sparkles,
  Sprout,
  Target,
  Truck,
  UserRoundCheck,
} from 'lucide-react'

import logoImage from '@/assets/logo-5-vetor-master-06jul26-2c08a.png'
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
    question: 'O que é um Diagnóstico Estratégico determinístico?',
    answer:
      'É uma leitura estruturada do seu cenário empresarial baseada em dados, lógica e 40 anos de Expertise Executiva — sem respostas genéricas ou especulativas.',
  },
  {
    question: 'O diagnóstico fica pronto em quanto tempo?',
    answer:
      'O Diagnóstico Estratégico é entregue em até 72h após a consolidação das respostas e dos dados necessários. O retorno inicial da equipe ocorre em até 5 dias.',
  },
  {
    question: 'Qual é o investimento inicial?',
    answer:
      'As soluções partem de R$ 1.190/mês no SaaS, com opções híbridas e personalizadas conforme a complexidade e a fase da empresa.',
  },
  {
    question: 'A metodologia substitui uma consultoria tradicional?',
    answer:
      'A VETOR MASTER combina C-Level as a Service e Mentorship as a Software para entregar velocidade tecnológica com direção executiva aplicável.',
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

function AnimatedStat({ value, suffix, label }: { value: number; suffix?: string; label: string }) {
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
    <div className="stat-item" ref={ref} aria-label={`${label} ${value}${suffix ?? ''}`}>
      <strong>
        {displayValue}
        {suffix}
      </strong>
      <span>{label}</span>
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
      <g fill="none" stroke="url(#patternGradient)" strokeWidth="2">
        <path d="M98 324 154 292l56 32v64l-56 32-56-32Z" />
        <path d="M210 260 266 228l56 32v64l-56 32-56-32Z" />
        <path d="M322 324 378 292l56 32v64l-56 32-56-32Z" />
        <path d="M266 420 322 388l56 32v64l-56 32-56-32Z" />
        <path d="M434 228 490 196l56 32v64l-56 32-56-32Z" />
        <path d="m490 196 108-68-16 124" />
        <path d="m598 128-52 100" />
      </g>
      <g fill="#0066CC" opacity=".75">
        <circle cx="154" cy="292" r="6" />
        <circle cx="210" cy="324" r="6" />
        <circle cx="266" cy="356" r="6" />
      </g>
      <g fill="#22B14C" opacity=".75">
        <circle cx="434" cy="324" r="6" />
        <circle cx="490" cy="196" r="6" />
        <circle cx="546" cy="228" r="6" />
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
      <section className="hero-section" id="inicio">
        <HeroPattern />
        <div className="site-container hero-grid">
          <div className="hero-copy">
            <div className="hero-overline">
              <ShieldCheck aria-hidden="true" />
              INTELIGÊNCIA EXECUTIVA DETERMINÍSTICA
            </div>
            <h1>Diagnósticos estratégicos em 72h. Expertise de C-level. Preço de SaaS.</h1>
            <p className="hero-slogan">
              Expertise Executiva. Velocidade Tecnológica. Preço Acessível.
            </p>
            <p className="hero-subtitle">C-Level as a Service — Mentorship as a Software</p>
            <Button className="conversion-button hero-button" size="lg" asChild>
              <a href={whatsappLink} target="_blank" rel="noreferrer">
                Comece seu diagnóstico agora
                <ArrowRight aria-hidden="true" />
              </a>
            </Button>
            <div className="hero-proof" aria-label="Diferenciais da VETOR MASTER">
              <span>
                <Check aria-hidden="true" /> Sem respostas genéricas
              </span>
              <span>
                <Check aria-hidden="true" /> Decisão orientada por dados
              </span>
            </div>
          </div>

          <div className="hero-visual" aria-label="VETOR MASTER — Direção, Conexão e Crescimento">
            <div className="hero-image-orbit orbit-one" />
            <div className="hero-image-orbit orbit-two" />
            <div className="hero-logo-card">
              <img src={logoImage} alt="Logomarca VETOR MASTER — Direção, Conexão e Crescimento" />
            </div>
            <div className="data-chip chip-top">
              <Target aria-hidden="true" /> Direção
            </div>
            <div className="data-chip chip-bottom">
              <LineChart aria-hidden="true" /> Crescimento
            </div>
          </div>
        </div>
      </section>

      <section className="stats-bar" aria-label="VETOR MASTER em números">
        <div className="site-container stats-grid">
          <AnimatedStat value={40} label="anos de experiência executiva" />
          <AnimatedStat value={10} label="setores atendidos" />
          <AnimatedStat value={138} label="obras na base de conhecimento" />
          <AnimatedStat value={95} suffix="%" label="Acurácia semântica acima de" />
        </div>
      </section>

      <section className="section sectors-section" id="setores">
        <div className="site-container">
          <SectionHeading
            eyebrow="PARA SEU SETOR"
            title="Estratégia específica para a realidade da sua empresa."
            description="O mesmo rigor determinístico, aplicado aos indicadores, desafios e alavancas que definem o seu mercado."
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
                  <span className="sector-link">
                    Ver potencial do setor <ArrowRight aria-hidden="true" />
                  </span>
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
                Existe uma solução personalizada para cada fase da sua empresa. Responda o
                Questionário Estratégico do seu setor e descubra o caminho certo.
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

      <section className="section solutions-section" id="solucoes">
        <div className="site-container">
          <SectionHeading
            eyebrow="SOLUÇÕES"
            title="Expertise de C-level no modelo certo para sua operação."
            description="Da inteligência contínua ao acompanhamento executivo personalizado: escolha a profundidade que sua empresa exige agora."
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
                  {solution.featured ? <div className="featured-label">RECOMENDADO</div> : null}
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
                </article>
              )
            })}
          </div>
        </div>
      </section>

      <section className="section process-section" id="metodo">
        <div className="site-container">
          <SectionHeading
            eyebrow="O MÉTODO"
            title="Como funciona"
            description="Três passos objetivos separam o seu cenário atual de uma decisão estratégica fundamentada."
            align="center"
          />

          <div className="process-flow reveal">
            {[
              [
                '01',
                'Responda o Questionário Estratégico',
                'Dados do seu setor, da sua empresa e do desafio que precisa ser resolvido.',
              ],
              [
                '02',
                'Receba o Diagnóstico Estratégico Inicial',
                'Uma leitura estruturada por algoritmos determinísticos e Expertise Executiva.',
              ],
              [
                '03',
                'Agende uma devolutiva de 45 minutos',
                'Prioridades, vetores de crescimento e próximos movimentos apresentados com clareza.',
              ],
            ].map(([number, title, description], index) => (
              <article className="process-step" key={number}>
                <div className="step-marker">
                  <span>{number}</span>
                </div>
                {index < 2 ? (
                  <div className="step-connector" aria-hidden="true">
                    <ArrowRight />
                  </div>
                ) : null}
                <h3>{title}</h3>
                <p>{description}</p>
              </article>
            ))}
          </div>

          <div className="return-note reveal">
            <Clock3 aria-hidden="true" />
            <div>
              <strong>Retorno da equipe em até 5 dias.</strong>
              <span>
                Você recebe clareza sobre o próximo passo, sem ciclos longos de consultoria.
              </span>
            </div>
          </div>
        </div>
      </section>

      <section className="section faq-section" id="faq">
        <div className="site-container faq-layout">
          <div className="faq-intro reveal">
            <SectionHeading
              eyebrow="PERGUNTAS FREQUENTES"
              title="Respostas diretas para decisões objetivas."
              description="Entenda o método, os prazos e a cobertura da VETOR MASTER antes de iniciar seu Diagnóstico Estratégico."
            />
            <div className="faq-support">
              <Sparkles aria-hidden="true" />
              <p>Não encontrou sua resposta? Nossa equipe comercial retorna em até 5 dias.</p>
              <a href="mailto:contato.comercial@vetormaster.com.br">
                Falar com um especialista <ArrowRight aria-hidden="true" />
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

      <section className="final-cta-section">
        <div className="site-container final-cta reveal">
          <div>
            <span className="eyebrow eyebrow-light">DECIDA COM PRECISÃO</span>
            <h2>Seu próximo vetor de Crescimento Exponencial começa com um diagnóstico.</h2>
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
