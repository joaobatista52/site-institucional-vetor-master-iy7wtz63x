import { useState } from 'react'
import {
  ArrowRight,
  Calculator,
  BrainCircuit,
  BookOpen,
  ListOrdered,
  Search,
  Gift,
  ShieldCheck,
  CheckCircle2,
  Sparkles,
  HelpCircle,
  Clock,
  Compass,
  FileCheck2,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { SectorModal } from '@/components/SectorModal'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'

const EIGHT_STEPS = [
  {
    step: '1',
    title: 'Diagnóstico profundo da empresa',
    summary:
      'Levantamento minucioso dos seus números reais, processos e rotinas para identificar onde a operação trava.',
  },
  {
    step: '2',
    title: 'Leitura do futuro e dos cenários',
    summary:
      'Visão clara dos próximos passos e das mudanças do seu mercado que podem impactar o seu negócio.',
  },
  {
    step: '3',
    title: 'Estratégia e posicionamento',
    summary:
      'Definição exata de onde sua empresa deve jogar para se destacar da concorrência e cobrar o que vale.',
  },
  {
    step: '4',
    title: 'Time e estrutura',
    summary:
      'Organização das pessoas certas nos lugares certos, tirando o peso das decisões apenas das suas costas.',
  },
  {
    step: '5',
    title: 'Plano de execução',
    summary:
      'Um roteiro prático e em ordem de prioridade, mostrando o que fazer a cada semana sem complicar.',
  },
  {
    step: '6',
    title: 'Validação financeira',
    summary:
      'Checagem rigorosa de margens, fluxo de caixa e capital de giro para garantir que cada passo dê lucro.',
  },
  {
    step: '7',
    title: 'Governança e liderança',
    summary:
      'Rituais simples de acompanhamento para que a empresa funcione com disciplina, mesmo quando você se ausentar.',
  },
  {
    step: '8',
    title: 'Inovação e tecnologia',
    summary:
      'Ferramentas acessíveis para ganhar velocidade, reduzir retrabalho e preparar seu negócio para crescer.',
  },
]

const DELIVERABLES = [
  {
    icon: Compass,
    title: 'Diagnóstico Estratégico Inicial',
    badge: 'Prioridades Claras',
    description:
      'Um documento executivo direto ao ponto, indicando as prioridades reais do seu negócio e o que precisa ser corrigido primeiro para estancar perdas e acelerar resultados.',
  },
  {
    icon: Clock,
    title: 'Sessão de Devolutiva de 45 minutos',
    badge: 'Reunião Executiva',
    description:
      'Uma conversa estruturada de 45 minutos com um especialista para analisar os apontamentos, tirar dúvidas e desenhar ações práticas para o dia a dia da sua empresa.',
  },
  {
    icon: FileCheck2,
    title: 'Recomendação do Caminho Mais Adequado',
    badge: 'Direcionamento Sob Medida',
    description:
      'Orientação sob medida para o estágio atual do seu faturamento e maturidade de gestão, sem empurrar soluções caras ou desnecessárias.',
  },
]

const COMMITMENTS = [
  {
    value: 'Acima de 95%',
    label: 'Acurácia',
    description:
      'Conclusões precisas e alinhadas aos fundamentos consolidados de gestão de negócios.',
  },
  {
    value: 'Máxima de 2%',
    label: 'Taxa de alucinação',
    description: 'Respostas sustentadas exclusivamente na base de conhecimento oficial.',
  },
  {
    value: 'Menos de 3s',
    label: 'Tempo de resposta',
    description: 'Processamento imediato dos dados do questionário sem filas de espera.',
  },
  {
    value: '99,9%',
    label: 'Disponibilidade',
    description:
      'Plataforma estável e pronta para receber as informações da sua empresa a qualquer momento.',
  },
]

const FAQ_METODO = [
  {
    question: 'Preciso entender de tecnologia para usar?',
    answer:
      'Não, de forma alguma. O método foi desenhado exatamente para que você não precise lidar com termos técnicos ou ferramentas complexas. Você só responde perguntas práticas sobre o seu dia a dia, como faturamento aproximado, principais dificuldades e equipe. O restante é conduzido de forma simples pelo nosso sistema.',
  },
  {
    question: 'Quanto tempo leva o diagnóstico?',
    answer:
      'Preencher o questionário inicial leva cerca de 15 minutos. A partir do envio dos dados, o diagnóstico estruturado da sua empresa fica pronto em 72 horas.',
  },
  {
    question: 'O que acontece depois que eu envio o questionário?',
    answer:
      'Nossa equipe avalia as informações da sua empresa e entra em contato em até 5 dias para agendar a sua Sessão de Devolutiva de 45 minutos com um especialista, na qual você recebe as recomendações práticas e o caminho mais adequado.',
  },
  {
    question: 'Meus dados ficam protegidos?',
    answer:
      'Sim, integralmente. As informações financeiras, operacionais e cadastrais da sua empresa são confidenciais, protegidas por padrões rígidos de segurança e tratadas em total conformidade com a Lei Geral de Proteção de Dados (LGPD).',
  },
]

export default function Metodo() {
  const [sectorModalOpen, setSectorModalOpen] = useState(false)

  return (
    <div className="metodo-page">
      {/* 1. TÍTULO PRINCIPAL E FRASE GUIA */}
      <section className="metodo-hero">
        <div className="site-container">
          <div className="metodo-hero-copy">
            <span className="eyebrow">O MÉTODO VETOR MASTER</span>
            <h1>O Método</h1>
            <p className="metodo-hero-tagline">
              Como 40 anos de decisões executivas viram um diagnóstico da sua empresa em 72 horas.
            </p>
            <p className="metodo-hero-intro">
              Sem jargões complicados e sem promessas vazias: uma metodologia prática que traduz
              décadas de experiência real à frente de empresas em uma análise direta dos seus
              gargalos e do caminho para crescer com segurança.
            </p>
            <div className="metodo-hero-badges">
              <span>Diagnóstico em 72 horas</span>
              <span>Devolutiva de 45 minutos</span>
              <span>Retorno em até 5 dias</span>
              <span>40 anos de prática</span>
            </div>
          </div>
        </div>
      </section>

      {/* 2. INTELIGÊNCIA DETERMINÍSTICA, EM PORTUGUÊS CLARO */}
      <section className="section metodo-section bg-white">
        <div className="site-container">
          <div className="metodo-grid-2col">
            <div className="metodo-feature-card highlight-blue">
              <div className="metodo-card-icon blue">
                <Calculator aria-hidden="true" />
              </div>
              <span className="metodo-section-tag">RACIONAL CONFIÁVEL</span>
              <h2>Inteligência determinística, em português claro</h2>
              <p className="metodo-text-lead">
                Determinístico significa algo muito simples:{' '}
                <strong>a mesma pergunta leva sempre à mesma conclusão</strong>, exatamente como uma
                calculadora.
              </p>
              <p>
                Se você somar 2 + 2 na calculadora em uma segunda-feira de manhã ou em um domingo à
                noite, o resultado sempre será 4. Não existe sorte, não existe palpite e não existe
                variação de humor.
              </p>
              <div className="metodo-pill-list">
                <span className="metodo-pill">
                  <CheckCircle2 aria-hidden="true" /> Sem opinião solta
                </span>
                <span className="metodo-pill">
                  <CheckCircle2 aria-hidden="true" /> Sem achismo
                </span>
                <span className="metodo-pill">
                  <CheckCircle2 aria-hidden="true" /> Sem depender de sorte
                </span>
              </div>
            </div>

            <div className="metodo-analogy-card">
              <div className="metodo-analogy-header">
                <Sparkles className="w-5 h-5 text-growth-green" aria-hidden="true" />
                <span className="metodo-analogy-badge">ANALOGIA DO DIA A DIA</span>
              </div>
              <h3 className="metodo-analogy-title">O exame de sangue da sua empresa</h3>
              <p>
                Pense em um exame laboratorial. O laboratório não inventa taxas de colesterol nem
                tenta adivinhar o que você sente: ele aplica um padrão rigoroso de medição química
                sobre a amostra coletada.
              </p>
              <p>
                O método da VETOR MASTER faz a mesma coisa com a sua operação. Ele lê os números
                reais da sua empresa e aplica réguas executivas testadas. O resultado é um retrato
                fiel e consistente da saúde do seu negócio.
              </p>
              <div className="metodo-quote-box">
                <p>
                  "A estabilidade do método garante que você nunca receba um conselho diferente
                  apenas porque o dia mudou. É a segurança de uma calculadora aplicada à gestão."
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. A DIFERENÇA ENTRE UMA IA COMUM E A NOSSA */}
      <section className="section metodo-section bg-light">
        <div className="site-container">
          <div className="metodo-section-header">
            <span className="eyebrow">CLAREZA E TRANSPARÊNCIA</span>
            <h2>A diferença entre uma IA comum e a nossa</h2>
            <p>
              Você provavelmente já ouviu falar de inteligências artificiais que escrevem textos na
              internet. Aqui explicamos a diferença prática para o seu negócio de forma leiga e
              direta.
            </p>
          </div>

          <div className="metodo-comparison-grid">
            <div className="metodo-compare-card is-common">
              <div className="metodo-compare-tag common">IA COMUM DE MERCADO</div>
              <h3>Inteligência Artificial Comum</h3>
              <p className="metodo-compare-desc">
                Funciona como um leitor que leu de tudo na internet — receitas, piadas, palpites e
                notícias não verificadas — e tenta agradar você com respostas que parecem
                convincentes.
              </p>
              <ul className="metodo-compare-list">
                <li>
                  <span className="bullet-alert">✕</span>
                  <span>
                    <strong>Às vezes inventa respostas:</strong> se não tiver certeza, ela preenche
                    os vazios com suposições perigosas para o caixa da sua empresa.
                  </span>
                </li>
                <li>
                  <span className="bullet-alert">✕</span>
                  <span>
                    <strong>Não tem chão de fábrica:</strong> repete teorias bonitas sem ter passado
                    por crises econômicas reais.
                  </span>
                </li>
                <li>
                  <span className="bullet-alert">✕</span>
                  <span>
                    <strong>Muda de opinião:</strong> a mesma pergunta feita duas vezes pode receber
                    conselhos contraditórios.
                  </span>
                </li>
              </ul>
            </div>

            <div className="metodo-compare-card is-vetor">
              <div className="metodo-compare-tag vetor">A NOSSA ABORDAGEM</div>
              <h3>O Método VETOR MASTER</h3>
              <p className="metodo-compare-desc">
                Funciona como um conselheiro sênior com biblioteca fechada: consulta exclusivamente
                decisões empresariais testadas e comprovadas no Brasil.
              </p>
              <ul className="metodo-compare-list">
                <li>
                  <span className="bullet-check">✓</span>
                  <span>
                    <strong>Só responde com base na base oficial:</strong> cada recomendação tem
                    origem estrita em conhecimento executivo consolidado.
                  </span>
                </li>
                <li>
                  <span className="bullet-check">✓</span>
                  <span>
                    <strong>Honestidade absoluta:</strong> quando uma informação não está na base de
                    conhecimento, o sistema declara com transparência que não sabe, sem inventar
                    nada.
                  </span>
                </li>
                <li>
                  <span className="bullet-check">✓</span>
                  <span>
                    <strong>Rigor determinístico:</strong> entrega diagnósticos estáveis, confiáveis
                    e que você pode levar ao banco ou aos sócios.
                  </span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* 4. DE ONDE VEM O CONHECIMENTO */}
      <section className="section metodo-section bg-white">
        <div className="site-container">
          <div className="metodo-section-header">
            <span className="eyebrow">FUNDAMENTO EXECUTIVO</span>
            <h2>De onde vem o conhecimento</h2>
            <p>
              Imagine uma grande biblioteca de decisões reais: problemas que outros empresários já
              enfrentaram, erros que já foram corrigidos e estratégias testadas na prática do
              mercado brasileiro.
            </p>
          </div>

          <div className="metodo-library-card">
            <div className="metodo-library-text">
              <div className="metodo-card-icon green">
                <BookOpen aria-hidden="true" />
              </div>
              <h3>Uma biblioteca de decisões já tomadas e testadas</h3>
              <p>
                Quando você administra uma empresa, não precisa reinventar a roda nem errar nos
                mesmos pontos que centenas de negócios já erraram. O método reúne um repositório
                estruturado de soluções reais para que a sua empresa pegue o caminho mais seguro e
                direto.
              </p>
              <p className="text-sm text-gray-600 mt-2">
                É a combinação de décadas de vivência executiva de alto nível com obras clássicas e
                modernas de gestão, parametrizadas para a realidade de quem produz e emprega no
                Brasil.
              </p>
            </div>

            <div className="metodo-numbers-grid">
              <div className="metodo-stat-box">
                <strong className="stat-number">40 anos</strong>
                <span className="stat-title">de experiência executiva real</span>
                <p className="stat-caption">
                  Decisões tomadas na liderança prática de grandes operações.
                </p>
              </div>

              <div className="metodo-stat-box">
                <strong className="stat-number">138 obras</strong>
                <span className="stat-title">na base de conhecimento</span>
                <p className="stat-caption">
                  Os maiores clássicos e fundamentos de estratégia, finanças e liderança.
                </p>
              </div>

              <div className="metodo-stat-box">
                <strong className="stat-number">12 setores</strong>
                <span className="stat-title">da economia brasileira parametrizados</span>
                <p className="stat-caption">
                  Regras calibradas para saúde, varejo, indústria, serviços e mais 8 segmentos.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. O CAMINHO EM 8 ETAPAS */}
      <section className="section metodo-section bg-light">
        <div className="site-container">
          <div className="metodo-section-header">
            <span className="eyebrow">JORNADA SIMPLES</span>
            <h2>O caminho em 8 etapas</h2>
            <p>
              Você não precisa entender nada de metodologia ou de termos técnicos para participar. O
              método conduz todo o processo passo a passo, do início ao fim.
            </p>
          </div>

          <div className="metodo-steps-grid">
            {EIGHT_STEPS.map((item) => (
              <div className="metodo-step-card" key={item.step}>
                <div className="step-num-badge">{item.step}</div>
                <div className="step-card-content">
                  <h4>{item.title}</h4>
                  <p>{item.summary}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="metodo-banner-reassurance">
            <ShieldCheck className="w-6 h-6 text-growth-green flex-shrink-0" aria-hidden="true" />
            <p>
              <strong>Você cuida da sua empresa, o método cuida do roteiro:</strong> não é preciso
              estudar metodologias complexas. A condução é 100% orientada e estruturada para
              respeitar o seu tempo.
            </p>
          </div>
        </div>
      </section>

      {/* 6. AS MICRO-EPIFANIAS */}
      <section className="section metodo-section bg-white">
        <div className="site-container">
          <div className="metodo-epifanias-wrap">
            <div className="metodo-epifanias-copy">
              <div className="metodo-card-icon blue">
                <Search aria-hidden="true" />
              </div>
              <span className="eyebrow">ONDE ESTÁ O VALOR</span>
              <h2>As micro-epifanias</h2>
              <p className="metodo-text-lead">
                Todo dono de empresa sente quando o caixa não fecha no ritmo que deveria. A sensação
                de que o dinheiro entra mas escorre pelos dedos é comum, mas quase ninguém consegue
                apontar o motivo exato.
              </p>
              <p>
                É exatamente aqui que está o maior valor do método:{' '}
                <strong>
                  ele encontra os vazamentos que o dono sente no caixa mas não consegue nomear, e
                  transforma cada um em um número claro.
                </strong>
              </p>
              <p>
                Em vez de uma sensação vaga de preocupação, você passa a ter clareza cirúrgica: qual
                produto está dando prejuízo, onde o tempo da equipe está sendo desperdiçado e qual
                decisão imediata estanca a perda.
              </p>
            </div>

            <div className="metodo-epifanias-card">
              <div className="epifania-card-header">
                <BrainCircuit className="w-5 h-5 text-strategic-blue" aria-hidden="true" />
                <span>DA SENSAÇÃO AO NÚMERO</span>
              </div>
              <div className="epifania-transformation">
                <div className="epifania-box-from">
                  <span className="box-label">A SENSAÇÃO DO DONO</span>
                  <p>
                    "Estou trabalhando mais do que nunca, a empresa vende bem, mas o dinheiro não
                    sobra no final do mês."
                  </p>
                </div>
                <div className="epifania-arrow" aria-hidden="true">
                  <ArrowRight />
                </div>
                <div className="epifania-box-to">
                  <span className="box-label">A MICRO-EPIFANIA DO MÉTODO</span>
                  <p>
                    O vazamento é nomeado com exatidão: prazo de pagamento desalinhado, precificação
                    defasada e um número exato a ser corrigido.
                  </p>
                </div>
              </div>
              <div className="epifania-footer-note">
                <span>Quando o problema vira um número, a solução deixa de ser um mistério.</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 7. O QUE VOCÊ RECEBE */}
      <section className="section metodo-section bg-light">
        <div className="site-container">
          <div className="metodo-section-header">
            <span className="eyebrow">ENTREGA CONCRETA</span>
            <h2>O que você recebe</h2>
            <p>
              Uma entrega executiva completa, sem enrolação e sem relatórios de 100 páginas que
              ninguém lê. A nossa equipe retorna em até 5 dias para agendar a sua devolutiva.
            </p>
          </div>

          <div className="metodo-deliverables-grid">
            {DELIVERABLES.map((item) => {
              const IconComp = item.icon
              return (
                <div className="metodo-deliverable-card" key={item.title}>
                  <div className="deliverable-badge">{item.badge}</div>
                  <div className="deliverable-icon-wrap">
                    <IconComp aria-hidden="true" />
                  </div>
                  <h3>{item.title}</h3>
                  <p>{item.description}</p>
                </div>
              )
            })}
          </div>

          <div className="metodo-sla-highlight">
            <Clock className="w-5 h-5 text-strategic-blue flex-shrink-0" aria-hidden="true" />
            <span>
              <strong>Retorno garantido:</strong> nossa equipe retorna em até 5 dias para agendar a
              sua Sessão de Devolutiva de 45 minutos.
            </span>
          </div>
        </div>
      </section>

      {/* 8. NOSSOS COMPROMISSOS */}
      <section className="section metodo-section bg-white">
        <div className="site-container">
          <div className="metodo-section-header">
            <span className="eyebrow">INDICADORES DE CONFIABILIDADE</span>
            <h2>Nossos compromissos</h2>
            <p>
              Compromissos objetivos com a precisão da informação, o respeito ao seu tempo e a
              segurança da sua empresa.
            </p>
          </div>

          <div className="metodo-commitments-grid">
            {COMMITMENTS.map((item) => (
              <div className="metodo-commitment-card" key={item.label}>
                <span className="commitment-value">{item.value}</span>
                <strong className="commitment-label">{item.label}</strong>
                <p className="commitment-desc">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 9. BLOCO FINAL COM CTA */}
      <section className="section metodo-cta-section">
        <div className="site-container">
          <div className="metodo-cta-box">
            <div className="metodo-cta-copy">
              <span className="metodo-cta-eyebrow">PRONTO PARA AVALIAR SUA EMPRESA?</span>
              <h2>Comece seu diagnóstico agora</h2>
              <p>
                Leva apenas cerca de 15 minutos para preencher o Questionário Estratégico
                direcionado ao seu setor. Receba seu diagnóstico em 72 horas e agende sua devolutiva
                de 45 minutos.
              </p>
            </div>
            <div className="metodo-cta-action">
              <Button
                className="conversion-button"
                size="lg"
                type="button"
                onClick={() => setSectorModalOpen(true)}
              >
                Comece seu diagnóstico agora
                <ArrowRight aria-hidden="true" />
              </Button>
              <span className="metodo-cta-note">
                Sem necessidade de conhecimentos técnicos prévios.
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* 10. FAQ CURTO COM 4 PERGUNTAS */}
      <section className="section metodo-section bg-light" id="faq">
        <div className="site-container">
          <div className="metodo-faq-layout">
            <div className="metodo-faq-intro">
              <span className="eyebrow">DÚVIDAS FREQUENTES</span>
              <h2>Perguntas frequentes sobre o método</h2>
              <p>
                Respostas diretas e didáticas sobre o funcionamento, prazos e proteção das
                informações da sua empresa.
              </p>
              <div className="metodo-faq-help-box">
                <HelpCircle
                  className="w-5 h-5 text-strategic-blue flex-shrink-0"
                  aria-hidden="true"
                />
                <p>
                  Ainda tem alguma dúvida? Nossa equipe está à disposição para orientar o melhor
                  caminho para seu setor.
                </p>
              </div>
            </div>

            <div className="metodo-faq-accordion-wrap">
              <Accordion type="single" collapsible className="faq-accordion">
                {FAQ_METODO.map((item, index) => (
                  <AccordionItem value={`metodo-faq-${index}`} key={item.question}>
                    <AccordionTrigger className="text-left font-bold text-base">
                      {item.question}
                    </AccordionTrigger>
                    <AccordionContent className="text-sm leading-relaxed text-gray-700">
                      {item.answer}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          </div>
        </div>
      </section>

      <SectorModal
        open={sectorModalOpen}
        onOpenChange={setSectorModalOpen}
        title="Comece seu diagnóstico agora"
        description="Selecione o setor da sua empresa para preencher o Questionário Estratégico direcionado às alavancas da sua operação."
      />
    </div>
  )
}
