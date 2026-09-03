import type { LucideIcon } from 'lucide-react'
import {
  BriefcaseBusiness,
  Building2,
  Cpu,
  Dumbbell,
  Factory,
  Globe2,
  GraduationCap,
  HardHat,
  HeartPulse,
  ShoppingBag,
  Sprout,
  Truck,
} from 'lucide-react'

// Os 12 setores na ordem e nomenclatura oficiais VETOR MASTER.
// Os textos de gargalo são os mesmos da seção "Para seu setor" da landing page.
export interface LeadSector {
  id: string
  name: string
  tagline: string
  description?: string
  painPoint: string
  solutionPillar?: string
  unlock?: string
  icon: LucideIcon
}

export const leadSectors: LeadSector[] = [
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

export function findSector(id: string | undefined): LeadSector | undefined {
  return leadSectors.find((sector) => sector.id === id)
}
