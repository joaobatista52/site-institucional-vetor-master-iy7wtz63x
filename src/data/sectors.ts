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
  painPoint: string
  icon: LucideIcon
}

export const leadSectors: LeadSector[] = [
  {
    id: 'saude',
    name: 'Saúde',
    tagline: 'Hospitalar, Clínica, Odontológica, Laboratório e Home Care.',
    painPoint:
      'Glosa hospitalar invisível · baixa taxa de ocupação de leitos e/ou consultórios · retrabalho de faturamento · descasamento entre prontuário e conta.',
    icon: HeartPulse,
  },
  {
    id: 'varejo',
    name: 'Varejo',
    tagline: 'Lojas Físicas, E-commerce, Distribuição, Alimentação e Moda.',
    painPoint:
      'Ruptura de estoque · vendas perdidas · quebra/perda · ticket médio · margem por categoria.',
    icon: ShoppingBag,
  },
  {
    id: 'servicos',
    name: 'Serviços Profissionais',
    tagline: 'Consultoria, Advocacia, Contabilidade, Arquitetura, Agência e TI.',
    painPoint:
      'Horas não cobradas · taxa de utilização abaixo do ideal · contratos sem revisão de preço · custo de oportunidade do sócio.',
    icon: BriefcaseBusiness,
  },
  {
    id: 'comercio-internacional',
    name: 'Comércio Internacional - Trading Company',
    tagline: 'Importação, Exportação, Trading, Despacho Aduaneiro, Câmbio e Cativeiro de Crédito.',
    painPoint:
      'Créditos tributários não aproveitados · fim do ICMS como produto · retenção de caixa no Split Payment · ciclo de caixa longo · exposição cambial · retrabalho aduaneiro · capital imobilizado em trânsito · bitributação no regime dual até 2033.',
    icon: Globe2,
  },
  {
    id: 'facilities',
    name: 'Facilities',
    tagline:
      'Facilities Management, Limpeza e Conservação, Segurança Patrimonial, Manutenção Predial, Portaria/Recepção e Serviços Terceirizados.',
    painPoint:
      'Contratos sem revisão · horas ociosas · retrabalho · turnover · aditivos não cobrados · margem por contrato · venda de mão de obra física (HH) enquanto as maiores vendem SLA.',
    icon: Building2,
  },
  {
    id: 'industria',
    name: 'Indústria',
    tagline: 'Manufatura, Metalurgia, Alimentos, Químico, Têxtil e Plástico.',
    painPoint:
      'Refugo · paradas não programadas · ociosidade de máquinas · giro de estoque · custo real da ordem de produção.',
    icon: Factory,
  },
  {
    id: 'tecnologia',
    name: 'Tech/Startups',
    tagline: 'SaaS, Fintech, Healthtech, Edtech e Marketplace.',
    painPoint:
      'Churn · CAC/LTV desequilibrado · débito técnico · concentração de receita · runway.',
    icon: Cpu,
  },
  {
    id: 'construcao',
    name: 'Construção Civil',
    tagline: 'Edificações, Incorporação, Infraestrutura e Reformas.',
    painPoint:
      'Desperdício de materiais · retrabalho · aditivos não cobrados · orçado vs. realizado.',
    icon: HardHat,
  },
  {
    id: 'logistica',
    name: 'Logística/Transporte',
    tagline: 'Cargas, Passageiros, Distribuição e Armazenagem.',
    painPoint: 'Km vazios · ociosidade da frota · custo por km · manutenção corretiva.',
    icon: Truck,
  },
  {
    id: 'educacao',
    name: 'Educação',
    tagline: 'Básica, Superior, Técnico, Idiomas e Edtech.',
    painPoint: 'Evasão · inadimplência · vagas ociosas · rotatividade docente.',
    icon: GraduationCap,
  },
  {
    id: 'agronegocio',
    name: 'Agronegócio',
    tagline: 'Grãos, Pecuária, Cana, Café e Fruticultura.',
    painPoint:
      'Perda na colheita · custo por hectare · ociosidade da frota · janelas perdidas · quebra técnica.',
    icon: Sprout,
  },
  {
    id: 'academias',
    name: 'Academias de Ginástica',
    tagline: 'Musculação, Estúdio, CrossFit, Pilates e Natação.',
    painPoint: 'Evasão · capacidade ociosa · ocupação por horário · CAC por aluno.',
    icon: Dumbbell,
  },
]

export function findSector(id: string | undefined): LeadSector | undefined {
  return leadSectors.find((sector) => sector.id === id)
}
