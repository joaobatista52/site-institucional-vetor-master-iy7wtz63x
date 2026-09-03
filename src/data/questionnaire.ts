// Questionário Estratégico VETOR MASTER — fonte de verdade para as perguntas
// de cada seção/pilar, conforme o PDF "Questionários_Consolidados_12_Setores_V6.7".
// Estrutura: Identificação · Perfil/Contexto · 3 Pilares · Capacidade/Design Org.
// · Saúde Econômico-Financeira · Expectativas/Ambição · Inovação/Tecnologia.
// As 3 seções finais (Próximos Passos, Documentação e Cadastro) são tratadas
// como etapas próprias do wizard, fora deste arquivo.
// As listas específicas por setor (Comércio Internacional e Facilities) estão
// em ./questionnaireSectors, expostas via getQuestionnaireSections().

export type QuestionType = 'text' | 'textarea' | 'select' | 'yes-no' // Sim / Não / Parcialmente

export interface QuestionOption {
  value: string
  label: string
}

export interface Question {
  id: string
  label: string
  type: QuestionType
  required?: boolean
  options?: QuestionOption[]
  placeholder?: string
  helpText?: string
}

export interface QuestionSection {
  id: string
  stepNumber: number
  title: string
  subtitle: string
  questions: Question[]
}

export const revenueRanges = [
  'Até R$ 400 mil',
  'R$ 400 mil a R$ 2,4 milhões',
  'R$ 2,4 milhões a R$ 10 milhões',
  'R$ 10 milhões a R$ 30 milhões',
  'R$ 30 milhões a R$ 75 milhões',
  'R$ 75 milhões a R$ 150 milhões',
  'Acima de R$ 150 milhões',
]

export const taxRegimes = ['Simples Nacional', 'Lucro Presumido', 'Lucro Real', 'Não sei informar']

export const companyStructures = [
  'Sociedade Empresária Limitada (LTDA)',
  'Sociedade Anônima (S.A.)',
  'Sociedade Unipessoal',
  'Empresário Individual / MEI',
  'Outra',
]

export const certificationsList = [
  'ISO 9001',
  'ISO 14001',
  'ISO 45001',
  'ISO 27001',
  'Selo/Registro sanitário (ANVISA)',
  'Outras certificações',
  'Nenhuma',
]

export const engagementFormats = ['MaaS', 'Híbrido', 'CaaS', 'Ainda não sei']

import { saudeSections } from './questionnaires/sectorsPart1'

export const baseQuestionnaireSections: QuestionSection[] = saudeSections

export { getQuestionnaireSections } from './questionnaireSectors'
