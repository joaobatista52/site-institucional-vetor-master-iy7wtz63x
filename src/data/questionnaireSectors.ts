// Questionários Estratégicos dos 12 Setores VETOR MASTER
// Fonte: PDF "Questionários_Consolidados_12_Setores_V6.7_29ago26" (autor: João Batista de Paula).
// Estrutura preservada para os 12 setores cadastrados:
// Saúde, Varejo, Serviços Profissionais, Comércio Internacional - Trading Company,
// Facilities, Indústria, Tech/Startups, Construção Civil, Logística/Transporte,
// Educação, Agronegócio e Academias de Ginástica.

import type { QuestionSection } from './questionnaire'
import { baseQuestionnaireSections } from './questionnaire'

import { saudeSections, servicosSections } from './questionnaires/sectorsPart1'
import { industriaSections, varejoSections } from './questionnaires/sectorsPart2'
import { agronegocioSections, tecnologiaSections } from './questionnaires/sectorsPart3'
import { construcaoSections, logisticaSections } from './questionnaires/sectorsPart4'
import { educacaoSections, academiasSections } from './questionnaires/sectorsPart5'
import { comercioInternacionalSections, facilitiesSections } from './questionnaires/sectorsPart6'

export {
  saudeSections,
  servicosSections,
  industriaSections,
  varejoSections,
  agronegocioSections,
  tecnologiaSections,
  construcaoSections,
  logisticaSections,
  educacaoSections,
  academiasSections,
  comercioInternacionalSections,
  facilitiesSections,
}

export const sectorSectionsMap: Record<string, QuestionSection[]> = {
  saude: saudeSections,
  servicos: servicosSections,
  industria: industriaSections,
  varejo: varejoSections,
  agronegocio: agronegocioSections,
  tecnologia: tecnologiaSections,
  construcao: construcaoSections,
  logistica: logisticaSections,
  educacao: educacaoSections,
  academias: academiasSections,
  'comercio-internacional': comercioInternacionalSections,
  facilities: facilitiesSections,
}

export function getQuestionnaireSections(sectorId: string | undefined): QuestionSection[] {
  if (!sectorId) return saudeSections
  return sectorSectionsMap[sectorId] || saudeSections
}
