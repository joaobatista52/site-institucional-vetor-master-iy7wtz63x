import { useEffect, useRef, useState, type ComponentType } from 'react'
import { Link } from 'react-router-dom'
import {
  AlertTriangle,
  ArrowRight,
  Award,
  BarChart3,
  BriefcaseBusiness,
  Building2,
  Check,
  CheckCircle2,
  Clock3,
  Cpu,
  Dumbbell,
  Factory,
  Globe2,
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
import { VetorMasterEscapePanel } from '@/components/VetorMasterPrisonEscapePanel'
import { SectorModal } from '@/components/SectorModal'
import { PlanSelectionModal, type PlanData } from '@/components/PlanSelectionModal'
import { SaaSWaitlistModal } from '@/components/SaaSWaitlistModal'
import founderPhoto from '@/assets/foto-jbp-linkedin-copia-1-d051a.png'
import prisaoFundadorImg from '@/assets/prisao-do-fundador-1-27ago26-0a050.png'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'

type Icon = ComponentType<{ className?: string; 'aria-hidden'?: boolean | string }>

interface SectorItem {
  id: string
  name: string
  tagline: string
  description: string
  painPoint: string
  solutionPillar: string
  unlock: string
  icon: Icon
}

const kpiPromise = 'Diagnóstico em 72h · Devolutiva de 45 min'

// Textos dos 12 setores fiéis ao documento aprovado pelo cliente
// (Descrição, Gargalo Crítico Típico e Alavanca Determinística — sem alterações).
const allSectors: SectorItem[] = [
  {
    id: 'saude',
    name: 'Saúde',
    tagline: 'Hospitalar, Clínica, Odontológica, Laboratório e Home Care.',
    description:
      'Hospitalar, Clínica, Odontológica, Laboratório e Home Care. Operação assistencial com gestão concentrada no fundador e margens pressionadas por convênios.',
    painPoint:
      'Glosa hospitalar invisível · baixa taxa de ocupação de leitos e/ou consultórios · retrabalho de faturamento · descasamento entre prontuário e conta.',
    solutionPillar:
      'Diagnóstico Estratégico que quantifica a glosa e o retrabalho, prioriza as micro-epifanias e aponta o caminho para recuperar margem — com devolutiva de 45 min.',
    unlock:
      'A VETOR MASTER destrava a sua operação de saúde partindo do que o fundador não consegue enxergar sozinho: a glosa invisível e o retrabalho de faturamento. O Diagnóstico Estratégico quantifica o descasamento entre prontuário e conta e a baixa ocupação de leitos e consultórios, prioriza as micro-epifanias de maior impacto e devolve ao dono um caminho claro para recuperar margem — sem depender de mais horas de trabalho.',
    icon: HeartPulse,
  },
  {
    id: 'varejo',
    name: 'Varejo',
    tagline: 'Lojas Físicas, E-commerce, Distribuição, Alimentação e Moda.',
    description:
      'Lojas Físicas, E-commerce, Distribuição, Alimentação e Moda. Margem dependente de giro, ticket e controle de estoque.',
    painPoint:
      'Ruptura de estoque · vendas perdidas · quebra/perda · ticket médio · margem por categoria.',
    solutionPillar:
      'Diagnóstico Estratégico que revela onde o estoque trava o caixa e prioriza as ações de maior impacto em margem e giro.',
    unlock:
      'A VETOR MASTER destrava o seu varejo onde a margem escapa: no estoque que trava o caixa e nas vendas que se perdem por ruptura. O Diagnóstico Estratégico cruza giro, quebra, ticket médio e margem por categoria para mostrar exatamente onde a operação sangra e priorizar as ações de maior impacto — decisão de dono, baseada em números, e não em sensação de balcão.',
    icon: ShoppingBag,
  },
  {
    id: 'servicos',
    name: 'Serviços Profissionais',
    tagline: 'Consultoria, Advocacia, Contabilidade, Arquitetura, Agência e TI.',
    description:
      'Consultoria, Advocacia, Contabilidade, Arquitetura, Agência e TI. Receita dependente de horas e da presença pessoal do sócio.',
    painPoint:
      'Horas não cobradas · taxa de utilização abaixo do ideal · contratos sem revisão de preço · custo de oportunidade do sócio.',
    solutionPillar:
      'Diagnóstico Estratégico que revela o vazamento de honorários e a ociosidade da equipe, e estrutura o caminho para escalar sem o sócio ser o gargalo.',
    unlock:
      'A VETOR MASTER destrava a sua empresa de serviços revelando o dinheiro que já é seu e não entra no caixa: horas não cobradas, contratos sem revisão de preço e o custo de oportunidade do sócio. O Diagnóstico Estratégico mede a taxa de utilização real da equipe e estrutura o caminho para escalar a operação sem que você continue sendo o gargalo de cada entrega.',
    icon: BriefcaseBusiness,
  },
  {
    id: 'comercio-internacional',
    name: 'Comércio Internacional - Trading Company',
    tagline: 'Importação, Exportação, Trading, Despacho Aduaneiro, Câmbio e Cativeiro de Crédito.',
    description:
      'Importação, Exportação, Trading, Despacho Aduaneiro, Câmbio e Cativeiro de Crédito. Capital intensivo com ciclo de caixa longo e exposição cambial.',
    painPoint:
      'Créditos tributários não aproveitados · fim do ICMS como produto · retenção de caixa no Split Payment · ciclo de caixa longo · exposição cambial · retrabalho aduaneiro · capital imobilizado em trânsito · bitributação no regime dual até 2033.',
    solutionPillar:
      'Diagnóstico Estratégico que revela créditos não aproveitados e capital imobilizado, e estrutura o caminho para liberar caixa e margem.',
    unlock:
      'A VETOR MASTER destrava a sua trading company pelo caixa que ficou preso sem ninguém notar: créditos tributários não aproveitados, capital imobilizado em trânsito e o impacto do Split Payment no seu ciclo. O Diagnóstico Estratégico mapeia a exposição cambial, o retrabalho aduaneiro e os efeitos do regime dual até 2033, e estrutura o caminho para liberar caixa e margem de forma determinística.',
    icon: Globe2,
  },
  {
    id: 'facilities',
    name: 'Facilities',
    tagline:
      'Facilities Management, Limpeza e Conservação, Segurança Patrimonial, Manutenção Predial, Portaria/Recepção e Serviços Terceirizados.',
    description:
      'Facilities Management, Limpeza e Conservação, Segurança Patrimonial, Manutenção Predial, Portaria/Recepção e Serviços Terceirizados. Venda de mão de obra com margem apertada.',
    painPoint:
      'Contratos sem revisão · horas ociosas · retrabalho · turnover · aditivos não cobrados · margem por contrato · venda de mão de obra física (HH) enquanto as maiores vendem SLA.',
    solutionPillar:
      'Diagnóstico Estratégico que revela horas ociosas e contratos sem revisão, e estrutura o caminho para migrar de venda de horas para venda de resultado.',
    unlock:
      'A VETOR MASTER destrava a sua operação de facilities mostrando a margem que cada contrato esconde: horas ociosas, aditivos não cobrados e contratos sem revisão corroendo o resultado mês a mês. O Diagnóstico Estratégico mede a margem por contrato e estrutura o caminho para sair da venda de mão de obra física (HH) — como as maiores já fazem — para a venda de resultado com SLA.',
    icon: Building2,
  },
  {
    id: 'industria',
    name: 'Indústria',
    tagline: 'Manufatura, Metalurgia, Alimentos, Químico, Têxtil e Plástico.',
    description:
      'Manufatura, Metalurgia, Alimentos, Químico, Têxtil e Plástico. Operação com capital intensivo e margem sensível à eficiência de chão de fábrica.',
    painPoint:
      'Refugo · paradas não programadas · ociosidade de máquinas · giro de estoque · custo real da ordem de produção.',
    solutionPillar:
      'Diagnóstico Estratégico que quantifica refugo e paradas, prioriza as alavancas de eficiência e define o roadmap de execução.',
    unlock:
      'A VETOR MASTER destrava a sua indústria no chão de fábrica, onde a margem morre em silêncio: refugo, paradas não programadas e máquinas ociosas. O Diagnóstico Estratégico quantifica cada perda, calcula o custo real da ordem de produção e prioriza as alavancas de eficiência em um roadmap de execução — para que o capital investido em produção comece a render o que deveria.',
    icon: Factory,
  },
  {
    id: 'tecnologia',
    name: 'Tech/Startups',
    tagline: 'SaaS, Fintech, Healthtech, Edtech e Marketplace.',
    description:
      'SaaS, Fintech, Healthtech, Edtech e Marketplace. Crescimento rápido com riscos de retenção e concentração de receita.',
    painPoint:
      'Churn · CAC/LTV desequilibrado · débito técnico · concentração de receita · runway.',
    solutionPillar:
      'Diagnóstico Estratégico que mapeia churn e economia unitária, e define o caminho para escalar com margem.',
    unlock:
      'A VETOR MASTER destrava a sua startup ou SaaS onde o crescimento para de ser saudável: churn que corrói a receita, CAC/LTV desequilibrado e runway encurtando. O Diagnóstico Estratégico mapeia a economia unitária real e a concentração de receita, pondera o custo do débito técnico e define o caminho para escalar com margem — antes que o próximo aporte seja só oxigênio.',
    icon: Cpu,
  },
  {
    id: 'construcao',
    name: 'Construção Civil',
    tagline: 'Edificações, Incorporação, Infraestrutura e Reformas.',
    description:
      'Edificações, Incorporação, Infraestrutura e Reformas. Margem dependente do controle entre orçado e realizado.',
    painPoint:
      'Desperdício de materiais · retrabalho · aditivos não cobrados · orçado vs. realizado.',
    solutionPillar:
      'Diagnóstico Estratégico que revela o desvio entre orçado e realizado e prioriza as alavancas de margem por obra.',
    unlock:
      'A VETOR MASTER destrava a sua construtora fechando a lacuna entre o que foi orçado e o que foi realizado. O Diagnóstico Estratégico quantifica o desperdício de materiais, o retrabalho e os aditivos não cobrados, e prioriza as alavancas de margem por obra — para que cada contrato entregue a margem que o orçamento prometeu, e não apenas o volume que ele esconde.',
    icon: HardHat,
  },
  {
    id: 'logistica',
    name: 'Logística/Transporte',
    tagline: 'Cargas, Passageiros, Distribuição e Armazenagem.',
    description:
      'Cargas, Passageiros, Distribuição e Armazenagem. Operação com custo sensível a frota, rotas e manutenção.',
    painPoint: 'Km vazios · ociosidade da frota · custo por km · manutenção corretiva.',
    solutionPillar:
      'Diagnóstico Estratégico que quantifica km vazios e ociosidade, e estrutura o caminho para eficiência operacional.',
    unlock:
      'A VETOR MASTER destrava a sua operação de logística e transporte por onde o custo corre: km vazios, frota ociosa e manutenção corretiva que quebra o planejamento. O Diagnóstico Estratégico quantifica o custo por km real e a ociosidade da frota, e estrutura o caminho para eficiência operacional — transformando roda girando em margem, e não em despesa.',
    icon: Truck,
  },
  {
    id: 'educacao',
    name: 'Educação',
    tagline: 'Básica, Superior, Técnico, Idiomas e Edtech.',
    description:
      'Básica, Superior, Técnico, Idiomas e Edtech. Receita recorrente dependente de retenção e ocupação.',
    painPoint: 'Evasão · inadimplência · vagas ociosas · rotatividade docente.',
    solutionPillar:
      'Diagnóstico Estratégico que revela evasão e inadimplência, e define o caminho para reter e ocupar.',
    unlock:
      'A VETOR MASTER destrava a sua instituição de ensino onde a receita recorrente vaza: evasão de alunos, inadimplência e vagas ociosas que ninguém consegue explicar. O Diagnóstico Estratégico revela onde e por que os alunos saem, mede o efeito da rotatividade docente e define o caminho para reter matrículas e ocupar a estrutura que você já paga — com rigor de dados, não de achismo.',
    icon: GraduationCap,
  },
  {
    id: 'agronegocio',
    name: 'Agronegócio',
    tagline: 'Grãos, Pecuária, Cana, Café e Fruticultura.',
    description:
      'Grãos, Pecuária, Cana, Café e Fruticultura. Operação sazonal com decisões concentradas e janelas críticas.',
    painPoint:
      'Perda na colheita · custo por hectare · ociosidade da frota · janelas perdidas · quebra técnica.',
    solutionPillar:
      'Diagnóstico Estratégico que quantifica perdas e ociosidade, e estrutura decisões para não travar nas janelas críticas.',
    unlock:
      'A VETOR MASTER destrava o seu agronegócio nas decisões que não podem esperar a próxima safra: perdas na colheita, custo por hectare e janelas críticas que, perdidas, não voltam. O Diagnóstico Estratégico quantifica a quebra técnica e a ociosidade da frota e estrutura as decisões para que a operação não trave na janela — com o fundador deixando de decidir sozinho sob pressão.',
    icon: Sprout,
  },
  {
    id: 'academias',
    name: 'Academias de Ginástica',
    tagline: 'Musculação, Estúdio, CrossFit, Pilates e Natação.',
    description:
      'Musculação, Estúdio, CrossFit, Pilates e Natação. Receita dependente de retenção e ocupação por horário.',
    painPoint: 'Evasão · capacidade ociosa · ocupação por horário · CAC por aluno.',
    solutionPillar:
      'Diagnóstico Estratégico que mapeia evasão e ociosidade, e estrutura o caminho para reter e ocupar.',
    unlock:
      'A VETOR MASTER destrava a sua academia onde o modelo de mensalidade esconde o problema: evasão silenciosa, capacidade ociosa e horários mortos pagando estrutura cheia. O Diagnóstico Estratégico mapeia a evasão e o CAC por aluno, mede a ocupação por horário e estrutura o caminho para reter alunos e ocupar a capacidade que você já tem — antes de investir mais em aquisição.',
    icon: Dumbbell,
  },
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
      'O Vetor Master é desenhado especificamente para PMEs brasileiras com faturamento anual de R$ 400 mil a R$ 150 milhões, com foco em destravar a sobrecarga decisória do fundador e destravar o crescimento sustentável em 12 setores da economia.',
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
  const [selectedSectorId, setSelectedSectorId] = useState<string>('saude')
  const [sectorModalOpen, setSectorModalOpen] = useState(false)
  const [selectedPlanForModal, setSelectedPlanForModal] = useState<PlanData | null>(null)
  const [planModalOpen, setPlanModalOpen] = useState(false)
  const [saasWaitlistOpen, setSaasWaitlistOpen] = useState(false)

  const activeSector = allSectors.find((s) => s.id === selectedSectorId) || allSectors[0]

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
              <strong>zero alucinação</strong> em 12 setores da economia.
            </p>

            <p className="hero-subtitle">C-Level as a Service — Mentorship as a Software</p>

            <div className="hero-actions">
              <Button
                className="conversion-button hero-button"
                size="lg"
                type="button"
                onClick={() => setSectorModalOpen(true)}
              >
                Comece seu diagnóstico agora
                <ArrowRight aria-hidden="true" />
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
                <Check aria-hidden="true" /> SLA de 72h em 12 setores estruturados
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

              {/* Logo 5 Oficial em Destaque Máximo no Topo do Painel (Ponto Focal) */}
              <div className="hero-card-brand">
                <BrandLogo variant="logo5" className="hero-brand-logo" />
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
                  <span>Para PMEs em 12 setores</span>
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
            value={12}
            label="setores atendidos com motor determinístico"
            source="Metodologia validada"
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

          {/* Layout Principal: Imagem 'Prisão do Fundador' ao lado dos dados/diagnóstico FDC (98% decidem sozinhos) */}
          <div className="founder-prison-showcase reveal">
            <div className="prison-image-container">
              <div className="prison-image-wrapper">
                <img
                  src={prisaoFundadorImg}
                  alt="A Prisão do Fundador — Sobrecarga, pilhas de documentos e solidão decisória do empresário"
                  className="prison-image"
                  loading="lazy"
                />
                <div className="prison-image-overlay">
                  <div className="prison-image-tag">
                    <AlertTriangle aria-hidden="true" />
                    <span>O GARGALO DA OPERAÇÃO</span>
                  </div>
                  <p className="prison-image-caption">
                    Trabalhar mais horas não produz mais resultado quando você é o único gargalo.
                  </p>
                </div>
              </div>
            </div>

            <div className="prison-content-column">
              <div className="trap-card trap-card-highlight">
                <div className="trap-card-icon danger">
                  <Users aria-hidden="true" />
                </div>
                <div className="trap-card-badge">DADO CRÍTICO FDC</div>
                <h3>98% Decidem Sozinhos</h3>
                <p>
                  Líderes de PMEs acumulam sozinhos a responsabilidade por uma média de{' '}
                  <strong>5 áreas críticas</strong> de decisão (comercial, financeiro, operações, RH
                  e estratégia), sem um C-Level ou conselho executivo para desafiar premissas e
                  direcionar a escala.
                </p>
                <div className="trap-card-impact">
                  <Lock aria-hidden="true" />
                  <span>
                    Sintoma central da <strong>Prisão do Fundador</strong>: a empresa cresce apenas
                    até o limite do tempo e energia do seu líder.
                  </span>
                </div>
                <span className="trap-source">
                  Pesquisa "Cabeça de Dono" · Itaú + Locomotiva / FDC (Fundação Dom Cabral)
                </span>
              </div>

              <div className="trap-secondary-cards">
                <div className="trap-card trap-card-compact">
                  <div className="trap-card-icon warning">
                    <Clock3 aria-hidden="true" />
                  </div>
                  <h4>78% Trabalham &gt; 50h/Semana</h4>
                  <p>
                    Presos na rotina de apagar incêndios e microgestão diária, fundadores sacrificam
                    a visão de longo prazo.
                  </p>
                  <span className="trap-source">Fundação Dom Cabral</span>
                </div>

                <div className="trap-card trap-card-compact">
                  <div className="trap-card-icon danger">
                    <ShieldAlert aria-hidden="true" />
                  </div>
                  <h4>60% Fecham em 5 Anos</h4>
                  <p>
                    A mortalidade precoce decorre de falhas na gestão estratégica e falta de rigor
                    decisório preventivo.
                  </p>
                  <span className="trap-source">Estudo de Sobrevivência · Sebrae</span>
                </div>
              </div>
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

          {/* PAINEL VISUAL VETOR MASTER — INSTRUMENTO DE TRANSIÇÃO DA PRISÃO DO FUNDADOR */}
          <VetorMasterEscapePanel onStartDiagnosis={() => setSectorModalOpen(true)} />
        </div>
      </section>

      {/* 3. O MÉTODO / COMO FUNCIONA */}
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

      {/* 4. PARA SEU SETOR (12 setores - Interativo com Seleção Ativa e Alto Contraste) */}
      <section className="section sectors-section" id="setores">
        <div className="site-container">
          <SectionHeading
            eyebrow="PARA SEU SETOR"
            title="Estratégia específica para a realidade da sua empresa."
            description="O mesmo rigor determinístico, aplicado aos indicadores, gargalos e alavancas que definem os 12 principais setores da economia brasileira. Clique em um setor para explorar a rota estratégica."
          />

          {/* Grade de Setores: Destaque Top 3 (Saúde, Varejo, Serviços) + Grade Secundária (9 setores) */}
          <div className="sectors-structure-wrap reveal">
            {/* Top 3 Setores de Destaque */}
            <div className="sectors-featured-heading">
              <span className="sectors-group-label">PRINCIPAIS SETORES DE ATUAÇÃO</span>
            </div>

            <div
              className="sectors-featured-grid"
              role="tablist"
              aria-label="Principais setores de destaque VETOR MASTER"
            >
              {allSectors.slice(0, 3).map((sector, index) => {
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
                    onClick={() => setSelectedSectorId(sector.id)}
                    className={`sector-interactive-box sector-box-featured ${
                      isActive ? 'is-active' : ''
                    }`}
                  >
                    <div className="sector-featured-badge">DESTAQUE 0{index + 1}</div>
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
                      <span>{kpiPromise}</span>
                    </div>
                  </button>
                )
              })}
            </div>

            {/* Grade Secundária: Demais 9 Setores Estruturados */}
            <div className="sectors-secondary-heading">
              <span className="sectors-group-label">DEMAIS SETORES ATENDIDOS</span>
            </div>

            <div
              className="sectors-secondary-grid"
              role="tablist"
              aria-label="Demais setores atendidos pela VETOR MASTER"
            >
              {allSectors.slice(3).map((sector, index) => {
                const SectorIcon = sector.icon
                const isActive = sector.id === selectedSectorId
                const globalIndex = index + 4
                return (
                  <button
                    type="button"
                    key={sector.id}
                    role="tab"
                    id={`sector-tab-${sector.id}`}
                    aria-selected={isActive}
                    aria-controls={`sector-panel-${sector.id}`}
                    onClick={() => setSelectedSectorId(sector.id)}
                    className={`sector-interactive-box sector-box-secondary ${
                      isActive ? 'is-active' : ''
                    }`}
                  >
                    <div className="sector-box-top">
                      <div className="sector-box-icon">
                        <SectorIcon aria-hidden="true" />
                      </div>
                      <span className="sector-box-number">
                        {String(globalIndex).padStart(2, '0')}
                      </span>
                    </div>
                    <strong className="sector-box-title">{sector.name}</strong>
                    <span className="sector-box-tagline">{sector.tagline}</span>
                  </button>
                )
              })}
            </div>
          </div>

          {/* Painel de Destaque Detalhado do Setor Ativo */}
          {activeSector && (
            <div
              className="sector-detail-panel reveal is-visible"
              id={`sector-panel-${activeSector.id}`}
              role="tabpanel"
              aria-labelledby={`sector-tab-${activeSector.id}`}
            >
              <div className="sector-panel-header">
                <div className="sector-panel-badge">
                  {(() => {
                    const ActiveIcon = activeSector.icon
                    return <ActiveIcon aria-hidden="true" />
                  })()}
                  <span>
                    SETOR{' '}
                    {String(allSectors.findIndex((s) => s.id === activeSector.id) + 1).padStart(
                      2,
                      '0',
                    )}{' '}
                    · {activeSector.name.toUpperCase()}
                  </span>
                </div>
                <div className="sector-panel-kpi">
                  <strong className="kpi-value">{kpiPromise}</strong>
                </div>{' '}
              </div>

              <div className="sector-panel-body">
                <div className="sector-panel-main">
                  <h3>{activeSector.name}</h3>
                  <p className="sector-panel-desc">{activeSector.description}</p>

                  <div className="sector-panel-cards">
                    <div className="sector-subcard sector-subcard-pain">
                      <span className="subcard-title">
                        <AlertTriangle aria-hidden="true" /> Gargalo Crítico Típico
                      </span>
                      <p>{activeSector.painPoint}</p>
                    </div>

                    <div className="sector-subcard sector-subcard-solution">
                      <span className="subcard-title">
                        <CheckCircle2 aria-hidden="true" /> Alavanca Determinística VETOR MASTER
                      </span>
                      <p>{activeSector.solutionPillar}</p>
                    </div>
                  </div>
                </div>

                <div className="sector-panel-action">
                  <div className="sector-action-box">
                    <h4>Pronto para destravar o setor de {activeSector.name}?</h4>
                    <p>{activeSector.unlock}</p>
                    <Button className="conversion-button w-full" size="lg" asChild>
                      <Link to={`/questionario/${activeSector.id}`}>
                        Diagnóstico para {activeSector.name}
                        <ArrowRight aria-hidden="true" />
                      </Link>
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="sector-cta reveal">
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
              onClick={() => setSectorModalOpen(true)}
            >
              Comece seu diagnóstico agora
              <ArrowRight aria-hidden="true" />
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
                    {solution.name === 'SaaS' ? (
                      <Button
                        type="button"
                        onClick={() => setSaasWaitlistOpen(true)}
                        className="conversion-button bg-[#22B14C] hover:bg-[#1ea144] text-white font-bold text-xs h-8 px-3.5 rounded-md shadow-sm transition-all inline-flex items-center gap-1.5"
                        title="Cadastre-se para receber acesso antecipado e condição especial de fundador"
                      >
                        <Sparkles className="w-3.5 h-3.5" aria-hidden="true" />
                        Entrar na lista de prioridade
                      </Button>
                    ) : (
                      <Badge className="badge-neutral">{solution.badge}</Badge>
                    )}
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
                    {solution.name === 'SaaS' ? (
                      <Button
                        type="button"
                        className="conversion-button bg-[#22B14C] hover:bg-[#1ea144] text-white font-bold w-full h-11 shadow-sm"
                        onClick={() => setSaasWaitlistOpen(true)}
                      >
                        Entrar na lista de prioridade <ArrowRight aria-hidden="true" />
                      </Button>
                    ) : (
                      <Button
                        type="button"
                        className={
                          solution.featured
                            ? 'conversion-button w-full'
                            : 'solution-button-outline w-full'
                        }
                        onClick={() => {
                          setSelectedPlanForModal(solution)
                          setPlanModalOpen(true)
                        }}
                      >
                        Selecionar plano <ArrowRight aria-hidden="true" />
                      </Button>
                    )}
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

      {/* 7. SOBRE O FUNDADOR (SEÇÃO DEDICADA COM FOTO OFICIAL DO JOÃO BATISTA DE PAULA) */}
      <section className="section founder-section" id="fundador">
        <div className="site-container">
          <div className="founder-grid reveal">
            <div className="founder-profile-card">
              <div className="founder-photo-wrap">
                <img
                  src={founderPhoto}
                  alt="João Batista de Paula — Founder & CEO da VETOR MASTER"
                  className="founder-photo-img"
                  loading="lazy"
                />
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
                <span className="founder-pill">
                  <Target aria-hidden="true" /> Direção Estratégica Determinística
                </span>
                <span className="founder-pill">
                  <Award aria-hidden="true" /> C-Level as a Service para PMEs
                </span>
                <span className="founder-pill">
                  <ShieldCheck aria-hidden="true" /> Rigor Executivo sem Alucinação
                </span>
              </div>
            </div>

            <div className="founder-bio">
              <SectionHeading
                eyebrow="SOBRE O FUNDADOR"
                title="Quarenta anos de decisões executivas traduzidos em código determinístico."
                description="A VETOR MASTER nasceu da vivência real em conselhos e diretorias executivas, identificando o abismo que separa as grandes corporações das PMEs brasileiras."
              />

              <div className="founder-text-body">
                <p>
                  Ao longo de mais de quatro décadas de trajetória corporativa em liderança
                  executiva, <strong>João Batista de Paula</strong> vivenciou os ciclos de
                  crescimento, reestruturação e tomada de decisão em múltiplos setores da economia
                  brasileira — liderando operações de alta complexidade e conselhos consultivos.
                </p>
                <p>
                  A constatação foi direta e incisiva: enquanto grandes multinacionais contam com
                  conselhos consultivos e consultorias milionárias, os líderes de PMEs enfrentam a
                  solidão decisória diária. O <strong>VETOR MASTER</strong> foi fundado exatamente
                  para democratizar essa inteligência C-Level, codificando heurísticas executivas
                  reais e uma base de 138 obras seminais em um motor digital ágil, de alta precisão
                  e <strong>zero alucinação</strong> em 12 setores da economia.
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
          <Button
            className="final-cta-button"
            size="lg"
            type="button"
            onClick={() => setSectorModalOpen(true)}
          >
            Comece seu diagnóstico agora
            <ArrowRight aria-hidden="true" />
          </Button>
        </div>
      </section>

      <SectorModal
        open={sectorModalOpen}
        onOpenChange={setSectorModalOpen}
        title="Comece seu diagnóstico agora"
        description="Escolha o segmento da sua empresa para direcionarmos o Questionário Estratégico com foco nos gargalos e alavancas da sua operação."
      />

      <PlanSelectionModal
        open={planModalOpen}
        onOpenChange={setPlanModalOpen}
        plan={selectedPlanForModal}
        onProceedToQuestionnaire={() => setSectorModalOpen(true)}
      />

      <SaaSWaitlistModal
        open={saasWaitlistOpen}
        onOpenChange={setSaasWaitlistOpen}
        onExploreMaas={() => {
          const solutionsEl = document.getElementById('solucoes')
          if (solutionsEl) {
            solutionsEl.scrollIntoView({ behavior: 'smooth', block: 'start' })
          }
        }}
      />
    </>
  )
}
