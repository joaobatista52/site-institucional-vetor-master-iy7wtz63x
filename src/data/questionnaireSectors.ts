// Questionários Estratégicos dos 12 Setores VETOR MASTER
// Fonte: PDF "Questionários_Consolidados_12_Setores_V6.7_29ago26" (autor: João Batista de Paula).
// Estrutura preservada para os 12 setores cadastrados:
// Saúde, Varejo, Serviços Profissionais, Comércio Internacional - Trading Company,
// Facilities, Indústria, Tech/Startups, Construção Civil, Logística/Transporte,
// Educação, Agronegócio e Academias de Ginástica.

import type { QuestionSection } from './questionnaire'
import { baseQuestionnaireSections } from './questionnaire'

export function getQuestionnaireSections(sectorId: string | undefined): QuestionSection[] {
  if (!sectorId) return baseQuestionnaireSections
  if (sectorId === 'comercio-internacional') return comercioInternacionalSections
  if (sectorId === 'facilities') return facilitiesSections
  return baseQuestionnaireSections
}

const comercioInternacionalSections: QuestionSection[] = [
  {
    id: 'identificacao',
    stepNumber: 1,
    title: 'Identificação da Empresa',
    subtitle: 'Dados formais do Comércio Internacional — Trading Company.',
    questions: [
      { id: 'trade_razaoSocial', label: 'Razão social', type: 'text', required: true },
      {
        id: 'trade_cnpj',
        label: 'CNPJ',
        type: 'text',
        required: true,
        placeholder: '00.000.000/0000-00',
      },
      { id: 'trade_segmento', label: 'Segmento de atuação', type: 'text', required: true },
      { id: 'trade_respondente', label: 'Nome do respondente', type: 'text', required: true },
      { id: 'trade_cargo', label: 'Cargo do respondente', type: 'text', required: true },
      {
        id: 'trade_estruturaSocietaria',
        label: 'Estrutura societária',
        type: 'text',
        required: true,
      },
      {
        id: 'trade_certificacoes',
        label: 'Certificações da empresa',
        type: 'text',
        required: true,
      },
    ],
  },
  {
    id: 'perfil',
    stepNumber: 2,
    title: 'Perfil da Empresa e Contexto',
    subtitle: 'Números e estrutura que dimensionam a operação de comércio exterior.',
    questions: [
      { id: 'trade_faturamentoAnual', label: 'Faturamento anual', type: 'text', required: true },
      { id: 'trade_unidades', label: 'Número de unidades / filiais', type: 'text', required: true },
      {
        id: 'trade_colaboradores',
        label: 'Número de colaboradores (headcount)',
        type: 'text',
        required: true,
      },
      { id: 'trade_anosOperacao', label: 'Anos de operação', type: 'text', required: true },
      { id: 'trade_regimeTributario', label: 'Regime tributário', type: 'text', required: true },
      {
        id: 'trade_fontesReceita',
        label: 'Principais fontes de receita',
        type: 'textarea',
        required: true,
      },
    ],
  },
  {
    id: 'pilar1',
    stepNumber: 3,
    title: 'Pilar 1: Prisão do Fundador',
    subtitle: 'Sobrecarga decisória, dependência do fundador e limites do crescimento sustentável.',
    questions: [
      {
        id: 'trade_p1q1',
        label:
          'Quanto do seu tempo semanal é consumido resolvendo problemas operacionais em vez de questões estratégicas?',
        type: 'select',
        required: true,
        options: [
          { value: 'Menos de 20%', label: 'Menos de 20%' },
          { value: '20% a 40%', label: '20% a 40%' },
          { value: '40% a 60%', label: '40% a 60%' },
          { value: '60% a 80%', label: '60% a 80%' },
          { value: 'Mais de 80%', label: 'Mais de 80%' },
        ],
      },
      {
        id: 'trade_p1q2',
        label: 'Quais decisões atualmente dependem exclusivamente de você para serem tomadas?',
        type: 'textarea',
        required: true,
      },
      {
        id: 'trade_p1q3',
        label:
          'Existe um sucessor ou gestor capacitado para operar a empresa na sua ausência por mais de 30 dias?',
        type: 'yes-no',
        required: true,
      },
      {
        id: 'trade_p1q4',
        label:
          'A empresa já tentou crescer e travou por falta da sua disponibilidade ou conhecimento?',
        type: 'yes-no',
        required: true,
      },
      {
        id: 'trade_p1q5',
        label: 'Processos-chave estão documentados o suficiente para operar sem você?',
        type: 'yes-no',
        required: true,
      },
      {
        id: 'trade_p1q6',
        label:
          'Qual o principal sintoma da sua sobrecarga atual (horas, saúde, família, qualidade das decisões)?',
        type: 'textarea',
        required: true,
      },
    ],
  },
  {
    id: 'pilar2',
    stepNumber: 4,
    title: 'Pilar 2: Ineficiência Invisível',
    subtitle: 'Onde a margem e o caixa escorrem sem aparecer no relatório.',
    questions: [
      {
        id: 'trade_p2q1',
        label:
          'Você conhece o custo real das suas principais perdas operacionais (refugo, retrabalho, horas ociosas)?',
        type: 'yes-no',
        required: true,
      },
      {
        id: 'trade_p2q2',
        label:
          'Existe algum valor que você suspeita estar sendo perdido (créditos tributários não aproveitados, aduanas retrabalhadas, câmbio travado) mas nunca foi quantificado?',
        type: 'textarea',
        required: true,
      },
      {
        id: 'trade_p2q3',
        label:
          'Qual o nível de precisão das suas informações de custo por operação (embarque, DI, contrato)?',
        type: 'select',
        required: true,
        options: [
          { value: 'Alta', label: 'Alta' },
          { value: 'Média', label: 'Média' },
          { value: 'Baixa', label: 'Baixa' },
          { value: 'Inexistente', label: 'Inexistente' },
        ],
      },
      {
        id: 'trade_p2q4',
        label:
          'Com que frequência processos são refeitos por erro, falta de padrão ou falta de informação?',
        type: 'select',
        required: true,
        options: [
          { value: 'Raramente', label: 'Raramente' },
          { value: 'Mensalmente', label: 'Mensalmente' },
          { value: 'Semanalmente', label: 'Semanalmente' },
          { value: 'Diariamente', label: 'Diariamente' },
        ],
      },
      {
        id: 'trade_p2q5',
        label:
          'Existe um sistema único de gestão (ERP) ou as informações vivem em planilhas paralelas?',
        type: 'yes-no',
        required: true,
      },
      {
        id: 'trade_p2q6',
        label:
          'Qual gargalo operacional, se resolvido, liberaria mais margem nos próximos 6 meses?',
        type: 'textarea',
        required: true,
      },
      {
        id: 'trade_p2q7',
        label: 'Em qual área você acredita que existe a maior ineficiência invisível hoje?',
        type: 'select',
        required: true,
        options: [
          { value: 'Comercial', label: 'Comercial / Vendas' },
          { value: 'Aduaneiro', label: 'Aduaneiro / Despacho' },
          { value: 'Financeiro', label: 'Financeiro / Câmbio' },
          { value: 'Suprimentos', label: 'Suprimentos / Estoque' },
          { value: 'Pessoas', label: 'Gestão de Pessoas' },
          { value: 'Não sei', label: 'Não sei informar' },
        ],
      },
    ],
  },
  {
    id: 'pilar3',
    stepNumber: 5,
    title: 'Pilar 3: Abismo Estratégia vs. Execução',
    subtitle: 'A distância entre o que está planejado e o que acontece na prática.',
    questions: [
      {
        id: 'trade_p3q1',
        label: 'A empresa possui um planejamento estratégico formal, documentado e atualizado?',
        type: 'yes-no',
        required: true,
      },
      {
        id: 'trade_p3q2',
        label:
          'Qual a proporção do plano estratégico que você avalia ter sido efetivamente executado no último ano?',
        type: 'select',
        required: true,
        options: [
          { value: 'Mais de 80%', label: 'Mais de 80%' },
          { value: '50% a 80%', label: '50% a 80%' },
          { value: '20% a 50%', label: '20% a 50%' },
          { value: 'Menos de 20%', label: 'Menos de 20%' },
          { value: 'Não havia plano', label: 'Não havia plano formal' },
        ],
      },
      {
        id: 'trade_p3q3',
        label: 'As metas anuais chegam de forma clara às áreas e aos colaboradores?',
        type: 'yes-no',
        required: true,
      },
      {
        id: 'trade_p3q4',
        label:
          'Existe rotina de acompanhamento de indicadores (reuniões de resultado, painéis, revisões)?',
        type: 'yes-no',
        required: true,
      },
      {
        id: 'trade_p3q5',
        label: 'Quando uma iniciativa estratégica falha, qual a causa mais comum?',
        type: 'select',
        required: true,
        options: [
          { value: 'Falta de acompanhamento', label: 'Falta de acompanhamento' },
          { value: 'Falta de capacitação', label: 'Falta de capacitação da equipe' },
          { value: 'Falta de prioridade', label: 'Concorrência de prioridades' },
          { value: 'Falta de recursos', label: 'Falta de recurso (tempo/dinheiro)' },
          { value: 'Falta de clareza', label: 'Falta de clareza no que fazer' },
        ],
      },
      {
        id: 'trade_p3q6',
        label:
          'Descreva uma decisão estratégica importante dos últimos 12 meses que não saiu do papel.',
        type: 'textarea',
        required: true,
      },
    ],
  },
  {
    id: 'capacidade',
    stepNumber: 6,
    title: 'Capacidade e Design Organizacional',
    subtitle: 'Estrutura, papéis e capacidade instalada — responda Sim, Não ou Parcialmente.',
    questions: [
      {
        id: 'trade_cap1',
        label:
          'A estrutura atual (pessoas e cargos) suporta o crescimento projetado para os próximos 24 meses?',
        type: 'yes-no',
        required: true,
      },
      {
        id: 'trade_cap2',
        label:
          'As responsabilidades de cada área estão formalizadas (organograma e descrição de papéis)?',
        type: 'yes-no',
        required: true,
      },
      {
        id: 'trade_cap3',
        label: 'Existe camada de gestão formada (gestores intermediários) entre você e a operação?',
        type: 'yes-no',
        required: true,
      },
      {
        id: 'trade_cap4',
        label: 'Os processos principais estão mapeados e padronizados?',
        type: 'yes-no',
        required: true,
      },
      {
        id: 'trade_cap5',
        label: 'Existe plano de desenvolvimento e sucessão para os cargos-chave?',
        type: 'yes-no',
        required: true,
      },
      {
        id: 'trade_cap6',
        label:
          'A tecnologia atual integra as áreas (vendas, operação, financeiro) sem retrabalho manual?',
        type: 'yes-no',
        required: true,
      },
    ],
  },
  {
    id: 'financeira',
    stepNumber: 7,
    title: 'Saúde Econômico-Financeira',
    subtitle: 'Caixa, margem e endividamento — leitura objetiva da sustentabilidade.',
    questions: [
      {
        id: 'trade_fin1',
        label: 'Você conhece sua margem operacional real por operação (embarque, DI, contrato)?',
        type: 'yes-no',
        required: true,
      },
      {
        id: 'trade_fin2',
        label: 'A empresa já enfrentou aperto de caixa nos últimos 12 meses?',
        type: 'yes-no',
        required: true,
      },
      {
        id: 'trade_fin3',
        label: 'Existe endividamento relevante acima do capital de giro habitual?',
        type: 'yes-no',
        required: true,
      },
      {
        id: 'trade_fin4',
        label: 'Com que frequência o fluxo de caixa é acompanhado?',
        type: 'select',
        required: true,
        options: [
          { value: 'Diariamente', label: 'Diariamente' },
          { value: 'Semanalmente', label: 'Semanalmente' },
          { value: 'Mensalmente', label: 'Mensalmente' },
          { value: 'Ocasionalmente', label: 'Ocasionalmente / quando aperta' },
          { value: 'Nunca', label: 'Nunca de forma estruturada' },
        ],
      },
      {
        id: 'trade_fin5',
        label:
          'A contabilidade gerencial entrega informações úteis para decisão (não apenas fiscal)?',
        type: 'yes-no',
        required: true,
      },
      {
        id: 'trade_fin6',
        label: 'Qual o principal desafio econômico-financeiro hoje?',
        type: 'textarea',
        required: true,
      },
    ],
  },
  {
    id: 'expectativas',
    stepNumber: 8,
    title: 'Expectativas e Ambição',
    subtitle: 'Onde a empresa quer chegar — e em que ritmo.',
    questions: [
      {
        id: 'trade_exp1',
        label: 'Qual a ambição de crescimento para os próximos 3 anos?',
        type: 'select',
        required: true,
        options: [
          { value: 'Consolidar', label: 'Consolidar a operação atual' },
          { value: 'Crescimento moderado', label: 'Crescimento moderado (até 20% a.a.)' },
          { value: 'Crescimento agressivo', label: 'Crescimento agressivo (acima de 20% a.a.)' },
          { value: 'Preparar venda', label: 'Preparar a empresa para venda / sucessão' },
        ],
      },
      {
        id: 'trade_exp2',
        label: 'Qual o papel que você pretende ter na empresa em 3 anos?',
        type: 'select',
        required: true,
        options: [
          { value: 'Operacional', label: 'Continuar na operação diária' },
          { value: 'Estratégico', label: 'Foco em estratégia e novos negócios' },
          { value: 'Governança', label: 'Governança / conselho, fora da operação' },
          { value: 'Transição', label: 'Transição para sucessor' },
        ],
      },
      {
        id: 'trade_exp3',
        label: 'Quanto da expansão depende de investimento externo (capital, crédito, sócio)?',
        type: 'select',
        required: true,
        options: [
          { value: 'Nada', label: 'Nada — crescimento autofinanciado' },
          { value: 'Parcial', label: 'Parcialmente' },
          { value: 'Total', label: 'Totalmente dependente' },
          { value: 'Não sei', label: 'Ainda não sei' },
        ],
      },
      {
        id: 'trade_exp4',
        label: 'Qual resultado você espera obter com o Diagnóstico Estratégico em 72h?',
        type: 'textarea',
        required: true,
      },
      {
        id: 'trade_exp5',
        label: 'Existe um prazo ou evento que torna essa decisão urgente?',
        type: 'textarea',
        required: true,
      },
    ],
  },
  {
    id: 'inovacao',
    stepNumber: 9,
    title: 'Inovação e Tecnologia',
    subtitle: 'Maturidade digital, dados e capacidade de adoção de novas soluções.',
    questions: [
      {
        id: 'trade_ino1',
        label: 'A empresa utiliza algum sistema integrado de gestão (ERP/CRM)?',
        type: 'yes-no',
        required: true,
      },
      {
        id: 'trade_ino2',
        label: 'As decisões são tomadas com base em dados confiáveis e atualizados?',
        type: 'yes-no',
        required: true,
      },
      {
        id: 'trade_ino3',
        label: 'Existe alguém formalmente responsável por tecnologia / transformação digital?',
        type: 'yes-no',
        required: true,
      },
      {
        id: 'trade_ino4',
        label: 'A empresa já investiu em automação de processos nos últimos 24 meses?',
        type: 'yes-no',
        required: true,
      },
      {
        id: 'trade_ino5',
        label: 'Como você avalia a maturidade digital da operação?',
        type: 'select',
        required: true,
        options: [
          { value: 'Digitalizada', label: 'Digitalizada — processos rodando em sistemas' },
          { value: 'Híbrida', label: 'Híbrida — sistemas + planilhas' },
          { value: 'Analógica', label: 'Predominantemente manual/planilhas' },
        ],
      },
      {
        id: 'trade_ino6',
        label: 'Qual tecnologia ou automação, se implementada, geraria maior impacto imediato?',
        type: 'textarea',
        required: true,
      },
      {
        id: 'trade_ino7',
        label: 'Qual a principal barreira para adotar novas tecnologias na empresa?',
        type: 'select',
        required: true,
        options: [
          { value: 'Custo', label: 'Custo de implantação' },
          { value: 'Equipe', label: 'Capacitação da equipe' },
          { value: 'Tempo', label: 'Tempo da equipe para implementar' },
          { value: 'Escolha', label: 'Dúvida sobre qual solução escolher' },
          { value: 'Nenhuma', label: 'Nenhuma barreira relevante' },
        ],
      },
    ],
  },
]

const facilitiesSections: QuestionSection[] = [
  {
    id: 'identificacao',
    stepNumber: 1,
    title: 'Identificação da Empresa',
    subtitle: 'Dados formais do setor de Facilities.',
    questions: [
      { id: 'fac_razaoSocial', label: 'Razão social', type: 'text', required: true },
      {
        id: 'fac_cnpj',
        label: 'CNPJ',
        type: 'text',
        required: true,
        placeholder: '00.000.000/0000-00',
      },
      { id: 'fac_segmento', label: 'Segmento de atuação', type: 'text', required: true },
      { id: 'fac_respondente', label: 'Nome do respondente', type: 'text', required: true },
      { id: 'fac_cargo', label: 'Cargo do respondente', type: 'text', required: true },
      {
        id: 'fac_estruturaSocietaria',
        label: 'Estrutura societária',
        type: 'text',
        required: true,
      },
      { id: 'fac_certificacoes', label: 'Certificações da empresa', type: 'text', required: true },
    ],
  },
  {
    id: 'perfil',
    stepNumber: 2,
    title: 'Perfil da Empresa e Contexto',
    subtitle: 'Números e estrutura que dimensionam a operação de facilities.',
    questions: [
      { id: 'fac_faturamentoAnual', label: 'Faturamento anual', type: 'text', required: true },
      { id: 'fac_unidades', label: 'Número de unidades / contratos', type: 'text', required: true },
      {
        id: 'fac_colaboradores',
        label: 'Número de colaboradores (headcount)',
        type: 'text',
        required: true,
      },
      { id: 'fac_anosOperacao', label: 'Anos de operação', type: 'text', required: true },
      { id: 'fac_regimeTributario', label: 'Regime tributário', type: 'text', required: true },
      {
        id: 'fac_fontesReceita',
        label: 'Principais fontes de receita',
        type: 'textarea',
        required: true,
        placeholder: 'Ex.: mão de obra física (HH), SLA por contrato, insumos, serviços especiais.',
      },
    ],
  },
  {
    id: 'pilar1',
    stepNumber: 3,
    title: 'Pilar 1: Prisão do Fundador',
    subtitle: 'Sobrecarga decisória, dependência do fundador e limites do crescimento sustentável.',
    questions: [
      {
        id: 'fac_p1q1',
        label:
          'Quanto do seu tempo semanal é consumido resolvendo problemas operacionais em vez de questões estratégicas?',
        type: 'select',
        required: true,
        options: [
          { value: 'Menos de 20%', label: 'Menos de 20%' },
          { value: '20% a 40%', label: '20% a 40%' },
          { value: '40% a 60%', label: '40% a 60%' },
          { value: '60% a 80%', label: '60% a 80%' },
          { value: 'Mais de 80%', label: 'Mais de 80%' },
        ],
      },
      {
        id: 'fac_p1q2',
        label: 'Quais decisões atualmente dependem exclusivamente de você para serem tomadas?',
        type: 'textarea',
        required: true,
      },
      {
        id: 'fac_p1q3',
        label:
          'Existe um sucessor ou gestor capacitado para operar a empresa na sua ausência por mais de 30 dias?',
        type: 'yes-no',
        required: true,
      },
      {
        id: 'fac_p1q4',
        label:
          'A empresa já tentou crescer e travou por falta da sua disponibilidade ou conhecimento?',
        type: 'yes-no',
        required: true,
      },
      {
        id: 'fac_p1q5',
        label: 'Processos-chave estão documentados o suficiente para operar sem você?',
        type: 'yes-no',
        required: true,
      },
      {
        id: 'fac_p1q6',
        label:
          'Qual o principal sintoma da sua sobrecarga atual (horas, saúde, família, qualidade das decisões)?',
        type: 'textarea',
        required: true,
      },
    ],
  },
  {
    id: 'pilar2',
    stepNumber: 4,
    title: 'Pilar 2: Ineficiência Invisível',
    subtitle: 'Onde a margem e o caixa escorrem sem aparecer no relatório.',
    questions: [
      {
        id: 'fac_p2q1',
        label:
          'Você conhece o custo real das suas principais perdas operacionais (horas ociosas, retrabalho, turnover)?',
        type: 'yes-no',
        required: true,
      },
      {
        id: 'fac_p2q2',
        label:
          'Existe algum valor que você suspeita estar sendo perdido (aditivos não cobrados, horas não faturadas, contratos sem revisão de preço) mas nunca foi quantificado?',
        type: 'textarea',
        required: true,
      },
      {
        id: 'fac_p2q3',
        label: 'Qual o nível de precisão das suas informações de custo por contrato?',
        type: 'select',
        required: true,
        options: [
          { value: 'Alta', label: 'Alta' },
          { value: 'Média', label: 'Média' },
          { value: 'Baixa', label: 'Baixa' },
          { value: 'Inexistente', label: 'Inexistente' },
        ],
      },
      {
        id: 'fac_p2q4',
        label:
          'Com que frequência processos são refeitos por erro, falta de padrão ou falta de informação?',
        type: 'select',
        required: true,
        options: [
          { value: 'Raramente', label: 'Raramente' },
          { value: 'Mensalmente', label: 'Mensalmente' },
          { value: 'Semanalmente', label: 'Semanalmente' },
          { value: 'Diariamente', label: 'Diariamente' },
        ],
      },
      {
        id: 'fac_p2q5',
        label:
          'Existe um sistema único de gestão (ERP) ou as informações vivem em planilhas paralelas?',
        type: 'yes-no',
        required: true,
      },
      {
        id: 'fac_p2q6',
        label:
          'Qual gargalo operacional, se resolvido, liberaria mais margem nos próximos 6 meses?',
        type: 'textarea',
        required: true,
      },
      {
        id: 'fac_p2q7',
        label: 'Em qual área você acredita que existe a maior ineficiência invisível hoje?',
        type: 'select',
        required: true,
        options: [
          { value: 'Comercial', label: 'Comercial / Vendas' },
          { value: 'Operação', label: 'Operação / Prestação de Serviço' },
          { value: 'Financeiro', label: 'Financeiro / Faturamento' },
          { value: 'Suprimentos', label: 'Suprimentos / Insumos' },
          { value: 'Pessoas', label: 'Gestão de Pessoas / Turnover' },
          { value: 'Não sei', label: 'Não sei informar' },
        ],
      },
    ],
  },
  {
    id: 'pilar3',
    stepNumber: 5,
    title: 'Pilar 3: Abismo Estratégia vs. Execução',
    subtitle: 'A distância entre o que está planejado e o que acontece na prática.',
    questions: [
      {
        id: 'fac_p3q1',
        label: 'A empresa possui um planejamento estratégico formal, documentado e atualizado?',
        type: 'yes-no',
        required: true,
      },
      {
        id: 'fac_p3q2',
        label:
          'Qual a proporção do plano estratégico que você avalia ter sido efetivamente executado no último ano?',
        type: 'select',
        required: true,
        options: [
          { value: 'Mais de 80%', label: 'Mais de 80%' },
          { value: '50% a 80%', label: '50% a 80%' },
          { value: '20% a 50%', label: '20% a 50%' },
          { value: 'Menos de 20%', label: 'Menos de 20%' },
          { value: 'Não havia plano', label: 'Não havia plano formal' },
        ],
      },
      {
        id: 'fac_p3q3',
        label: 'As metas anuais chegam de forma clara às áreas e aos colaboradores?',
        type: 'yes-no',
        required: true,
      },
      {
        id: 'fac_p3q4',
        label:
          'Existe rotina de acompanhamento de indicadores (reuniões de resultado, painéis, revisões)?',
        type: 'yes-no',
        required: true,
      },
      {
        id: 'fac_p3q5',
        label: 'Quando uma iniciativa estratégica falha, qual a causa mais comum?',
        type: 'select',
        required: true,
        options: [
          { value: 'Falta de acompanhamento', label: 'Falta de acompanhamento' },
          { value: 'Falta de capacitação', label: 'Falta de capacitação da equipe' },
          { value: 'Falta de prioridade', label: 'Concorrência de prioridades' },
          { value: 'Falta de recursos', label: 'Falta de recurso (tempo/dinheiro)' },
          { value: 'Falta de clareza', label: 'Falta de clareza no que fazer' },
        ],
      },
      {
        id: 'fac_p3q6',
        label:
          'Descreva uma decisão estratégica importante dos últimos 12 meses que não saiu do papel.',
        type: 'textarea',
        required: true,
      },
    ],
  },
  {
    id: 'capacidade',
    stepNumber: 6,
    title: 'Capacidade e Design Organizacional',
    subtitle: 'Estrutura, papéis e capacidade instalada — responda Sim, Não ou Parcialmente.',
    questions: [
      {
        id: 'fac_cap1',
        label:
          'A estrutura atual (pessoas e cargos) suporta o crescimento projetado para os próximos 24 meses?',
        type: 'yes-no',
        required: true,
      },
      {
        id: 'fac_cap2',
        label:
          'As responsabilidades de cada área estão formalizadas (organograma e descrição de papéis)?',
        type: 'yes-no',
        required: true,
      },
      {
        id: 'fac_cap3',
        label: 'Existe camada de gestão formada (gestores intermediários) entre você e a operação?',
        type: 'yes-no',
        required: true,
      },
      {
        id: 'fac_cap4',
        label: 'Os processos principais estão mapeados e padronizados?',
        type: 'yes-no',
        required: true,
      },
      {
        id: 'fac_cap5',
        label: 'Existe plano de desenvolvimento e sucessão para os cargos-chave?',
        type: 'yes-no',
        required: true,
      },
      {
        id: 'fac_cap6',
        label:
          'A tecnologia atual integra as áreas (vendas, operação, financeiro) sem retrabalho manual?',
        type: 'yes-no',
        required: true,
      },
    ],
  },
  {
    id: 'financeira',
    stepNumber: 7,
    title: 'Saúde Econômico-Financeira',
    subtitle: 'Caixa, margem e endividamento — leitura objetiva da sustentabilidade.',
    questions: [
      {
        id: 'fac_fin1',
        label: 'Você conhece sua margem operacional real por contrato?',
        type: 'yes-no',
        required: true,
      },
      {
        id: 'fac_fin2',
        label: 'A empresa já enfrentou aperto de caixa nos últimos 12 meses?',
        type: 'yes-no',
        required: true,
      },
      {
        id: 'fac_fin3',
        label: 'Existe endividamento relevante acima do capital de giro habitual?',
        type: 'yes-no',
        required: true,
      },
      {
        id: 'fac_fin4',
        label: 'Com que frequência o fluxo de caixa é acompanhado?',
        type: 'select',
        required: true,
        options: [
          { value: 'Diariamente', label: 'Diariamente' },
          { value: 'Semanalmente', label: 'Semanalmente' },
          { value: 'Mensalmente', label: 'Mensalmente' },
          { value: 'Ocasionalmente', label: 'Ocasionalmente / quando aperta' },
          { value: 'Nunca', label: 'Nunca de forma estruturada' },
        ],
      },
      {
        id: 'fac_fin5',
        label:
          'A contabilidade gerencial entrega informações úteis para decisão (não apenas fiscal)?',
        type: 'yes-no',
        required: true,
      },
      {
        id: 'fac_fin6',
        label: 'Qual o principal desafio econômico-financeiro hoje?',
        type: 'textarea',
        required: true,
      },
    ],
  },
  {
    id: 'expectativas',
    stepNumber: 8,
    title: 'Expectativas e Ambição',
    subtitle: 'Onde a empresa quer chegar — e em que ritmo.',
    questions: [
      {
        id: 'fac_exp1',
        label: 'Qual a ambição de crescimento para os próximos 3 anos?',
        type: 'select',
        required: true,
        options: [
          { value: 'Consolidar', label: 'Consolidar a operação atual' },
          { value: 'Crescimento moderado', label: 'Crescimento moderado (até 20% a.a.)' },
          { value: 'Crescimento agressivo', label: 'Crescimento agressivo (acima de 20% a.a.)' },
          { value: 'Preparar venda', label: 'Preparar a empresa para venda / sucessão' },
        ],
      },
      {
        id: 'fac_exp2',
        label: 'Qual o papel que você pretende ter na empresa em 3 anos?',
        type: 'select',
        required: true,
        options: [
          { value: 'Operacional', label: 'Continuar na operação diária' },
          { value: 'Estratégico', label: 'Foco em estratégia e novos negócios' },
          { value: 'Governança', label: 'Governança / conselho, fora da operação' },
          { value: 'Transição', label: 'Transição para sucessor' },
        ],
      },
      {
        id: 'fac_exp3',
        label: 'Quanto da expansão depende de investimento externo (capital, crédito, sócio)?',
        type: 'select',
        required: true,
        options: [
          { value: 'Nada', label: 'Nada — crescimento autofinanciado' },
          { value: 'Parcial', label: 'Parcialmente' },
          { value: 'Total', label: 'Totalmente dependente' },
          { value: 'Não sei', label: 'Ainda não sei' },
        ],
      },
      {
        id: 'fac_exp4',
        label: 'Qual resultado você espera obter com o Diagnóstico Estratégico em 72h?',
        type: 'textarea',
        required: true,
      },
      {
        id: 'fac_exp5',
        label: 'Existe um prazo ou evento que torna essa decisão urgente?',
        type: 'textarea',
        required: true,
      },
    ],
  },
  {
    id: 'inovacao',
    stepNumber: 9,
    title: 'Inovação e Tecnologia',
    subtitle: 'Maturidade digital, dados e capacidade de adoção de novas soluções.',
    questions: [
      {
        id: 'fac_ino1',
        label: 'A empresa utiliza algum sistema integrado de gestão (ERP/CRM)?',
        type: 'yes-no',
        required: true,
      },
      {
        id: 'fac_ino2',
        label: 'As decisões são tomadas com base em dados confiáveis e atualizados?',
        type: 'yes-no',
        required: true,
      },
      {
        id: 'fac_ino3',
        label: 'Existe alguém formalmente responsável por tecnologia / transformação digital?',
        type: 'yes-no',
        required: true,
      },
      {
        id: 'fac_ino4',
        label: 'A empresa já investiu em automação de processos nos últimos 24 meses?',
        type: 'yes-no',
        required: true,
      },
      {
        id: 'fac_ino5',
        label: 'Como você avalia a maturidade digital da operação?',
        type: 'select',
        required: true,
        options: [
          { value: 'Digitalizada', label: 'Digitalizada — processos rodando em sistemas' },
          { value: 'Híbrida', label: 'Híbrida — sistemas + planilhas' },
          { value: 'Analógica', label: 'Predominantemente manual/planilhas' },
        ],
      },
      {
        id: 'fac_ino6',
        label: 'Qual tecnologia ou automação, se implementada, geraria maior impacto imediato?',
        type: 'textarea',
        required: true,
      },
      {
        id: 'fac_ino7',
        label: 'Qual a principal barreira para adotar novas tecnologias na empresa?',
        type: 'select',
        required: true,
        options: [
          { value: 'Custo', label: 'Custo de implantação' },
          { value: 'Equipe', label: 'Capacitação da equipe' },
          { value: 'Tempo', label: 'Tempo da equipe para implementar' },
          { value: 'Escolha', label: 'Dúvida sobre qual solução escolher' },
          { value: 'Nenhuma', label: 'Nenhuma barreira relevante' },
        ],
      },
    ],
  },
]
