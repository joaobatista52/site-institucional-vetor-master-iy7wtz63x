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

export const baseQuestionnaireSections: QuestionSection[] = [
  {
    id: 'identificacao',
    stepNumber: 1,
    title: 'Identificação da Empresa',
    subtitle:
      'Dados formais de cadastro. Contrato social e certificações podem ser anexados nesta etapa.',
    questions: [
      { id: 'razaoSocial', label: 'Razão social', type: 'text', required: true },
      {
        id: 'cnpj',
        label: 'CNPJ',
        type: 'text',
        required: true,
        placeholder: '00.000.000/0000-00',
      },
      { id: 'segmento', label: 'Segmento de atuação', type: 'text', required: true },
      { id: 'respondente', label: 'Nome do respondente', type: 'text', required: true },
      { id: 'cargo', label: 'Cargo do respondente', type: 'text', required: true },
      {
        id: 'estruturaSocietaria',
        label: 'Estrutura societária',
        type: 'select',
        required: true,
        options: companyStructures.map((s) => ({ value: s, label: s })),
      },
      {
        id: 'estruturaSocietariaDetalhe',
        label: 'Descrição da estrutura societária',
        type: 'textarea',
        placeholder:
          'Descreva a composição societária: sócios, participações, holdings, acordos de sócios etc.',
      },
      {
        id: 'certificacoes',
        label: 'Certificações da empresa',
        type: 'select',
        options: certificationsList.map((c) => ({ value: c, label: c })),
        helpText: 'Selecione a certificação principal. Comprovantes podem ser anexados abaixo.',
      },
    ],
  },
  {
    id: 'perfil',
    stepNumber: 2,
    title: 'Perfil da Empresa e Contexto',
    subtitle: 'Números e estrutura que dimensionam a operação.',
    questions: [
      {
        id: 'faturamentoAnual',
        label: 'Faturamento anual',
        type: 'select',
        required: true,
        options: revenueRanges.map((r) => ({ value: r, label: r })),
      },
      {
        id: 'unidades',
        label: 'Número de unidades / filiais',
        type: 'text',
        required: true,
        placeholder: 'Ex.: 1 matriz + 3 filiais',
      },
      {
        id: 'colaboradores',
        label: 'Número de colaboradores (headcount)',
        type: 'text',
        required: true,
        placeholder: 'Ex.: 48',
      },
      {
        id: 'anosOperacao',
        label: 'Anos de operação',
        type: 'text',
        required: true,
        placeholder: 'Ex.: 12',
      },
      {
        id: 'regimeTributario',
        label: 'Regime tributário',
        type: 'select',
        required: true,
        options: taxRegimes.map((r) => ({ value: r, label: r })),
      },
      {
        id: 'fontesReceita',
        label: 'Principais fontes de receita',
        type: 'textarea',
        required: true,
        placeholder:
          'Descreva as linhas de receita e a participação aproximada de cada uma no faturamento.',
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
        id: 'p1q1',
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
        id: 'p1q2',
        label: 'Quais decisões atualmente dependem exclusivamente de você para serem tomadas?',
        type: 'textarea',
        required: true,
        placeholder: 'Ex.: aprovação de descontos, contratações-chave, investimentos, preços.',
      },
      {
        id: 'p1q3',
        label:
          'Existe um sucessor ou gestor capacitado para operar a empresa na sua ausência por mais de 30 dias?',
        type: 'yes-no',
        required: true,
      },
      {
        id: 'p1q4',
        label:
          'A empresa já tentou crescer e travou por falta da sua disponibilidade ou conhecimento?',
        type: 'yes-no',
        required: true,
      },
      {
        id: 'p1q5',
        label: 'Processos-chave estão documentados o suficiente para operar sem você?',
        type: 'yes-no',
        required: true,
      },
      {
        id: 'p1q6',
        label:
          'Qual o principal sintoma da sua sobrecarga atual (horas, saúde, família, qualidade das decisões)?',
        type: 'textarea',
        required: true,
        placeholder: 'Descreva com suas palavras.',
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
        id: 'p2q1',
        label:
          'Você conhece o custo real das suas principais perdas operacionais (refugo, retrabalho, horas ociosas)?',
        type: 'yes-no',
        required: true,
      },
      {
        id: 'p2q2',
        label:
          'Existe algum valor que você suspeita estar sendo perdido (glosas, aditivos, créditos tributários, vendas perdidas) mas nunca foi quantificado?',
        type: 'textarea',
        required: true,
        placeholder: 'Cite as perdas suspeitas e, se souber, a ordem de grandeza anual.',
      },
      {
        id: 'p2q3',
        label:
          'Qual o nível de precisão das suas informações de custo por produto/serviço/contrato?',
        type: 'select',
        required: true,
        options: [
          { value: 'Alta', label: 'Alta — custos por item confiáveis e atualizados' },
          { value: 'Média', label: 'Média — custos aproximados, revisados de vez em quando' },
          { value: 'Baixa', label: 'Baixa — custo conhecido apenas no agregado' },
          { value: 'Inexistente', label: 'Inexistente — não consigo calcular' },
        ],
      },
      {
        id: 'p2q4',
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
        id: 'p2q5',
        label:
          'Existe um sistema único de gestão (ERP) ou as informações vivem em planilhas paralelas?',
        type: 'yes-no',
        required: true,
      },
      {
        id: 'p2q6',
        label:
          'Qual gargalo operacional, se resolvido, liberaria mais margem nos próximos 6 meses?',
        type: 'textarea',
        required: true,
        placeholder: 'Descreva o gargalo e onde ele aparece primeiro.',
      },
      {
        id: 'p2q7',
        label: 'Em qual área você acredita que existe a maior ineficiência invisível hoje?',
        type: 'select',
        required: true,
        options: [
          { value: 'Comercial', label: 'Comercial / Vendas' },
          { value: 'Operações', label: 'Operações / Produção / Serviço' },
          { value: 'Financeiro', label: 'Financeiro / Faturamento' },
          { value: 'Suprimentos', label: 'Suprimentos / Estoque / Compras' },
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
        id: 'p3q1',
        label: 'A empresa possui um planejamento estratégico formal, documentado e atualizado?',
        type: 'yes-no',
        required: true,
      },
      {
        id: 'p3q2',
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
        id: 'p3q3',
        label: 'As metas anuais chegam de forma clara às áreas e aos colaboradores?',
        type: 'yes-no',
        required: true,
      },
      {
        id: 'p3q4',
        label:
          'Existe rotina de acompanhamento de indicadores (reuniões de resultado, painéis, revisões)?',
        type: 'yes-no',
        required: true,
      },
      {
        id: 'p3q5',
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
        id: 'p3q6',
        label:
          'Descreva uma decisão estratégica importante dos últimos 12 meses que não saiu do papel.',
        type: 'textarea',
        required: true,
        placeholder: 'O que era, por que era importante e onde travou.',
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
        id: 'cap1',
        label:
          'A estrutura atual (pessoas e cargos) suporta o crescimento projetado para os próximos 24 meses?',
        type: 'yes-no',
        required: true,
      },
      {
        id: 'cap2',
        label:
          'As responsabilidades de cada área estão formalizadas (organograma e descrição de papéis)?',
        type: 'yes-no',
        required: true,
      },
      {
        id: 'cap3',
        label: 'Existe camada de gestão formada (gestores intermediários) entre você e a operação?',
        type: 'yes-no',
        required: true,
      },
      {
        id: 'cap4',
        label: 'Os processos principais estão mapeados e padronizados?',
        type: 'yes-no',
        required: true,
      },
      {
        id: 'cap5',
        label: 'Existe plano de desenvolvimento e sucessão para os cargos-chave?',
        type: 'yes-no',
        required: true,
      },
      {
        id: 'cap6',
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
        id: 'fin1',
        label: 'Você conhece sua margem operacional real por produto/serviço/contrato?',
        type: 'yes-no',
        required: true,
      },
      {
        id: 'fin2',
        label: 'A empresa já enfrentou aperto de caixa nos últimos 12 meses?',
        type: 'yes-no',
        required: true,
      },
      {
        id: 'fin3',
        label: 'Existe endividamento relevante acima do capital de giro habitual?',
        type: 'yes-no',
        required: true,
      },
      {
        id: 'fin4',
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
        id: 'fin5',
        label:
          'A contabilidade gerencial entrega informações úteis para decisão (não apenas fiscal)?',
        type: 'yes-no',
        required: true,
      },
      {
        id: 'fin6',
        label: 'Qual o principal desafio econômico-financeiro hoje?',
        type: 'textarea',
        required: true,
        placeholder: 'Ex.: margem comprimida, prazo de recebimento, custo de folha, inadimplência.',
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
        id: 'exp1',
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
        id: 'exp2',
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
        id: 'exp3',
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
        id: 'exp4',
        label: 'Qual resultado você espera obter com o Diagnóstico Estratégico em 72h?',
        type: 'textarea',
        required: true,
        placeholder: 'Seja específico: qual decisão ou destrave precisa acontecer.',
      },
      {
        id: 'exp5',
        label: 'Existe um prazo ou evento que torna essa decisão urgente?',
        type: 'textarea',
        required: true,
        placeholder: 'Ex.: renovação de contrato, safra, rodada, vencimento de dívida.',
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
        id: 'ino1',
        label: 'A empresa utiliza algum sistema integrado de gestão (ERP/CRM)?',
        type: 'yes-no',
        required: true,
      },
      {
        id: 'ino2',
        label: 'As decisões são tomadas com base em dados confiáveis e atualizados?',
        type: 'yes-no',
        required: true,
      },
      {
        id: 'ino3',
        label: 'Existe alguém formalmente responsável por tecnologia / transformação digital?',
        type: 'yes-no',
        required: true,
      },
      {
        id: 'ino4',
        label: 'A empresa já investiu em automação de processos nos últimos 24 meses?',
        type: 'yes-no',
        required: true,
      },
      {
        id: 'ino5',
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
        id: 'ino6',
        label: 'Qual tecnologia ou automação, se implementada, geraria maior impacto imediato?',
        type: 'textarea',
        required: true,
        placeholder: 'Descreva a tecnologia e o problema que ela resolveria.',
      },
      {
        id: 'ino7',
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

export function getQuestionnaireSections(sectorId: string | undefined): QuestionSection[] {
  if (!sectorId) return baseQuestionnaireSections
  if (sectorId === 'comercio-internacional') return comercioInternacionalSections
  if (sectorId === 'facilities') return facilitiesSections
  return baseQuestionnaireSections
}
