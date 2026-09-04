import type { QuestionSection } from '../questionnaire'

// Setor 1: Saúde (Páginas 1 a 4 do PDF)
export const saudeSections: QuestionSection[] = [
  {
    id: 'identificacao',
    stepNumber: 1,
    title: 'IDENTIFICAÇÃO DA EMPRESA',
    subtitle: 'QUESTIONÁRIO 1 — SETOR SAÚDE',
    questions: [
      { id: 'saude_razaoSocial', label: 'Razão Social:', type: 'text', required: true },
      {
        id: 'saude_cnpj',
        label: 'CNPJ:',
        type: 'text',
        required: true,
        placeholder: '00.000.000/0000-00',
      },
      { id: 'saude_data', label: 'Data:', type: 'text', placeholder: 'DD/MM/AAAA' },
      {
        id: 'saude_segmento',
        label: 'Segmento:',
        type: 'select',
        required: true,
        options: [
          { value: 'Hospitalar', label: 'Hospitalar' },
          { value: 'Clínica', label: 'Clínica' },
          { value: 'Odontológica', label: 'Odontológica' },
          { value: 'Laboratório', label: 'Laboratório' },
          { value: 'Home Care', label: 'Home Care' },
          { value: 'Outro', label: 'Outro' },
        ],
      },
      { id: 'saude_segmentoOutro', label: 'Outro (especifique):', type: 'text' },
      { id: 'saude_respondente', label: 'Respondente:', type: 'text', required: true },
      { id: 'saude_cargo', label: 'Cargo:', type: 'text', required: true },
    ],
  },
  {
    id: 'secao1',
    stepNumber: 2,
    title: 'SEÇÃO 1 — PERFIL DA EMPRESA E CONTEXTO',
    subtitle: 'Dimensão e estrutura da organização.',
    questions: [
      {
        id: 'saude_1_1',
        label: '1.1 Qual o faturamento anual aproximado da empresa?',
        type: 'text',
        required: true,
      },
      {
        id: 'saude_1_2',
        label: '1.2 Quantas unidades/sedes a empresa possui?',
        type: 'text',
        required: true,
      },
      {
        id: 'saude_1_3',
        label: '1.3 Quantos colaboradores ao todo?',
        type: 'text',
        required: true,
      },
      {
        id: 'saude_1_4',
        label: '1.4 Há quantos anos a empresa opera e qual o crescimento nos últimos 3 anos?',
        type: 'textarea',
        required: true,
      },
      {
        id: 'saude_1_5',
        label: '1.5 Estrutura de propriedade:',
        type: 'select',
        required: true,
        options: [
          { value: 'Familiar', label: 'Familiar' },
          { value: 'Sócios', label: 'Sócios' },
          { value: 'Investidores', label: 'Investidores' },
          { value: 'Outro', label: 'Outro' },
        ],
      },
      { id: 'saude_1_5_outro', label: '1.5 Outro (especifique):', type: 'text' },
      {
        id: 'saude_1_6',
        label: '1.6 Regime tributário:',
        type: 'select',
        required: true,
        options: [
          { value: 'Simples', label: 'Simples' },
          { value: 'Lucro Presumido', label: 'Lucro Presumido' },
          { value: 'Lucro Real', label: 'Lucro Real' },
        ],
      },
      {
        id: 'saude_1_7',
        label: '1.7 Principais fontes de receita (Convênios, Particular, SUS, etc.)?',
        type: 'textarea',
        required: true,
      },
      {
        id: 'saude_1_8',
        label: '1.8 Possui certificações (ONA, ISO, etc.)?',
        type: 'text',
        required: true,
      },
    ],
  },
  {
    id: 'secao2',
    stepNumber: 3,
    title: 'SEÇÃO 2 — PILAR 1: PRISÃO DO FUNDADOR',
    subtitle: 'Autonomia decisória e dependência do fundador.',
    questions: [
      {
        id: 'saude_2_1',
        label:
          '2.1 Quantas cirurgias ou procedimentos são cancelados por mês por falta de decisão da equipe?',
        type: 'text',
        required: true,
      },
      {
        id: 'saude_2_2',
        label:
          '2.2 Qual o percentual de decisões de internação que dependem da sua validação pessoal?',
        type: 'text',
        required: true,
      },
      {
        id: 'saude_2_3',
        label: '2.3 Sua equipe clínica tem autonomia para protocolos de urgência sem te consultar?',
        type: 'textarea',
        required: true,
      },
      {
        id: 'saude_2_4',
        label:
          '2.4 Se você se ausentar por 30 dias, a operação assistencial mantém o padrão de qualidade?',
        type: 'textarea',
        required: true,
      },
      {
        id: 'saude_2_5',
        label:
          '2.5 Quantas decisões de compra de insumos de alto custo passam por você pessoalmente?',
        type: 'text',
        required: true,
      },
      {
        id: 'saude_2_6',
        label: '2.6 Existe um diretor técnico com autonomia formal para decidir sem consultá-lo?',
        type: 'select',
        required: true,
        options: [
          { value: 'Sim', label: 'Sim' },
          { value: 'Não', label: 'Não' },
          { value: 'Parcialmente', label: 'Parcialmente' },
        ],
      },
    ],
  },
  {
    id: 'secao3',
    stepNumber: 4,
    title: 'SEÇÃO 3 — PILAR 2: INEFICIÊNCIA INVISÍVEL',
    subtitle: 'Perdas silenciosas e vazamento de margem.',
    questions: [
      {
        id: 'saude_3_1',
        label: '3.1 Qual o índice de glosa das contas hospitalares no último trimestre?',
        type: 'text',
        required: true,
      },
      {
        id: 'saude_3_2',
        label:
          '3.2 Quanto tempo a equipe perde com retrabalho de faturamento ou guias de convênio?',
        type: 'text',
        required: true,
      },
      {
        id: 'saude_3_3',
        label:
          '3.3 Quantas horas administrativas são gastas por profissionais de saúde semanalmente?',
        type: 'text',
        required: true,
      },
      {
        id: 'saude_3_4',
        label:
          '3.4 Quantos contratos com operadoras estão há mais de 12 meses sem revisão de tabela?',
        type: 'text',
        required: true,
      },
      {
        id: 'saude_3_5',
        label: '3.5 Qual o valor total da inadimplência atual e quem são os 10 maiores devedores?',
        type: 'textarea',
        required: true,
      },
      {
        id: 'saude_3_6',
        label: '3.6 Qual a taxa de ocupação média de leitos ou salas de atendimento?',
        type: 'text',
        required: true,
      },
      {
        id: 'saude_3_7',
        label:
          '3.7 Qual o volume de procedimentos realizados que não foram faturados por erro de registro?',
        type: 'text',
        required: true,
      },
    ],
  },
  {
    id: 'secao4',
    stepNumber: 5,
    title: 'SEÇÃO 4 — PILAR 3: ABISMO ENTRE ESTRATÉGIA vs EXECUÇÃO',
    subtitle: 'Alinhamento entre direção e ponta assistencial.',
    questions: [
      {
        id: 'saude_4_1',
        label:
          '4.1 Qual o prazo médio entre uma decisão da diretoria e a implementação na ponta clínica?',
        type: 'text',
        required: true,
      },
      {
        id: 'saude_4_2',
        label: '4.2 Quantos dos seus OKRs do trimestre passado foram 100% concluídos?',
        type: 'text',
        required: true,
      },
      {
        id: 'saude_4_3',
        label:
          '4.3 Sua equipe comercial/faturamento sabe o lucro real por procedimento ou convênio?',
        type: 'textarea',
        required: true,
      },
      {
        id: 'saude_4_4',
        label:
          '4.4 Quantas reuniões de alinhamento entre corpo clínico e administrativo ocorrem por mês?',
        type: 'text',
        required: true,
      },
      {
        id: 'saude_4_5',
        label: '4.5 Existe um comitê de gestão periódico com indicadores padronizados?',
        type: 'textarea',
        required: true,
      },
      {
        id: 'saude_4_6',
        label: '4.6 A equipe sabe exatamente o custo real de cada procedimento realizado?',
        type: 'textarea',
        required: true,
      },
    ],
  },
  {
    id: 'secao5',
    stepNumber: 6,
    title: 'SEÇÃO 5 — CAPACIDADE E DESIGN ORGANIZACIONAL (HACKMAN)',
    subtitle: 'Condições facilitadoras e liderança.',
    questions: [
      {
        id: 'saude_5_1',
        label: '5.1 Existe um time real, com limites claros e interdependência definida?',
        type: 'select',
        required: true,
        options: [
          { value: 'Sim', label: 'Sim' },
          { value: 'Não', label: 'Não' },
          { value: 'Parcialmente', label: 'Parcialmente' },
        ],
      },
      {
        id: 'saude_5_2',
        label: '5.2 A direção da empresa está clara e convincente para todos?',
        type: 'select',
        required: true,
        options: [
          { value: 'Sim', label: 'Sim' },
          { value: 'Não', label: 'Não' },
          { value: 'Parcialmente', label: 'Parcialmente' },
        ],
      },
      {
        id: 'saude_5_3',
        label: '5.3 As tarefas e normas facilitam a execução do trabalho?',
        type: 'select',
        required: true,
        options: [
          { value: 'Sim', label: 'Sim' },
          { value: 'Não', label: 'Não' },
          { value: 'Parcialmente', label: 'Parcialmente' },
        ],
      },
      {
        id: 'saude_5_4',
        label: '5.4 A equipe dispõe de recursos e recompensas adequados?',
        type: 'select',
        required: true,
        options: [
          { value: 'Sim', label: 'Sim' },
          { value: 'Não', label: 'Não' },
          { value: 'Parcialmente', label: 'Parcialmente' },
        ],
      },
      {
        id: 'saude_5_5',
        label: '5.5 Existe coaching ou feedback contínuo para as lideranças?',
        type: 'select',
        required: true,
        options: [
          { value: 'Sim', label: 'Sim' },
          { value: 'Não', label: 'Não' },
          { value: 'Parcialmente', label: 'Parcialmente' },
        ],
      },
      {
        id: 'saude_5_6',
        label: '5.6 Quantos dos seus líderes são considerados de alta performance?',
        type: 'text',
        required: true,
      },
    ],
  },
  {
    id: 'secao6',
    stepNumber: 7,
    title: 'SEÇÃO 6 — SAÚDE ECONÔMICO-FINANCEIRA (BUFFETT)',
    subtitle: 'Margem, caixa e sustentabilidade do negócio.',
    questions: [
      {
        id: 'saude_6_1',
        label: '6.1 Qual a margem EBITDA atual aproximada?',
        type: 'text',
        required: true,
      },
      {
        id: 'saude_6_2',
        label: '6.2 Qual o nível de endividamento atual (Dívida Líquida / EBITDA)?',
        type: 'text',
        required: true,
      },
      {
        id: 'saude_6_3',
        label: '6.3 Qual o prazo médio de recebimento da carteira?',
        type: 'text',
        required: true,
      },
      {
        id: 'saude_6_4',
        label: '6.4 Qual o índice de inadimplência da carteira de clientes?',
        type: 'text',
        required: true,
      },
      {
        id: 'saude_6_5',
        label: '6.5 A empresa fecha DRE gerencial mensal até o 10º dia útil?',
        type: 'select',
        required: true,
        options: [
          { value: 'Sim', label: 'Sim' },
          { value: 'Não', label: 'Não' },
          { value: 'Parcialmente', label: 'Parcialmente' },
        ],
      },
      {
        id: 'saude_6_6',
        label: '6.6 Possui reserva de capital de giro para 3 meses de operação?',
        type: 'select',
        required: true,
        options: [
          { value: 'Sim', label: 'Sim' },
          { value: 'Não', label: 'Não' },
          { value: 'Parcialmente', label: 'Parcialmente' },
        ],
      },
    ],
  },
  {
    id: 'secao7',
    stepNumber: 8,
    title: 'SEÇÃO 7 — EXPECTATIVAS E AMBIÇÃO',
    subtitle: 'Objetivos estratégicos e disposição para mudança.',
    questions: [
      {
        id: 'saude_7_1',
        label: '7.1 O que o levou a buscar este diagnóstico?',
        type: 'textarea',
        required: true,
      },
      {
        id: 'saude_7_2',
        label: '7.2 Qual o principal problema a resolver nos próximos 12 meses?',
        type: 'textarea',
        required: true,
      },
      {
        id: 'saude_7_3',
        label: '7.3 Qual o horizonte de transformação desejado para a empresa?',
        type: 'textarea',
        required: true,
      },
      {
        id: 'saude_7_4',
        label: '7.4 Nível de disposição para mudanças:',
        type: 'select',
        required: true,
        options: [
          { value: 'Alto', label: 'Alto' },
          { value: 'Médio', label: 'Médio' },
          { value: 'Baixo', label: 'Baixo' },
        ],
      },
      {
        id: 'saude_7_5',
        label: '7.5 Já contratou consultoria ou mentoria anteriormente? Qual o resultado?',
        type: 'textarea',
        required: true,
      },
    ],
  },
  {
    id: 'secao8',
    stepNumber: 9,
    title: 'SEÇÃO 8 — INOVAÇÃO E TECNOLOGIA',
    subtitle: 'Maturidade digital e sistemas assistenciais.',
    questions: [
      {
        id: 'saude_8_1',
        label: '8.1 Utiliza sistema de gestão de saúde/ERP integrado? Qual?',
        type: 'textarea',
        required: true,
      },
      {
        id: 'saude_8_2',
        label: '8.2 Seus sistemas operam em nuvem ou servidor local?',
        type: 'textarea',
        required: true,
      },
      {
        id: 'saude_8_3',
        label: '8.3 Acompanha dashboards de ocupação, glosa e faturamento em tempo real?',
        type: 'textarea',
        required: true,
      },
      {
        id: 'saude_8_4',
        label: '8.4 Utiliza prontuário eletrônico, IA ou telemedicina na operação?',
        type: 'textarea',
        required: true,
      },
      {
        id: 'saude_8_5',
        label: '8.5 Quais processos são automatizados (faturamento, guias, cobrança)?',
        type: 'textarea',
        required: true,
      },
      {
        id: 'saude_8_6',
        label: '8.6 Nível de maturidade digital:',
        type: 'select',
        required: true,
        options: [
          { value: '1', label: '1-Básico' },
          { value: '2', label: '2-Intermediário' },
          { value: '3', label: '3-Avançado' },
        ],
      },
      {
        id: 'saude_8_7',
        label: '8.7 Quais as maiores barreiras para inovar (Custo, Equipe, Integração)?',
        type: 'textarea',
        required: true,
      },
    ],
  },
]

// Setor 2: Serviços Profissionais (Páginas 4 a 8 do PDF)
export const servicosSections: QuestionSection[] = [
  {
    id: 'identificacao',
    stepNumber: 1,
    title: 'IDENTIFICAÇÃO DA EMPRESA',
    subtitle: 'QUESTIONÁRIO 2 — SETOR SERVIÇOS PROFISSIONAIS',
    questions: [
      { id: 'servicos_razaoSocial', label: 'Razão Social:', type: 'text', required: true },
      {
        id: 'servicos_cnpj',
        label: 'CNPJ:',
        type: 'text',
        required: true,
        placeholder: '00.000.000/0000-00',
      },
      { id: 'servicos_data', label: 'Data:', type: 'text', placeholder: 'DD/MM/AAAA' },
      {
        id: 'servicos_segmento',
        label: 'Segmento:',
        type: 'select',
        required: true,
        options: [
          { value: 'Consultoria', label: 'Consultoria' },
          { value: 'Advocacia', label: 'Advocacia' },
          { value: 'Contabilidade', label: 'Contabilidade' },
          { value: 'Arquitetura', label: 'Arquitetura' },
          { value: 'Agência', label: 'Agência' },
          { value: 'TI', label: 'TI' },
          { value: 'Outro', label: 'Outro' },
        ],
      },
      { id: 'servicos_segmentoOutro', label: 'Outro (especifique):', type: 'text' },
      { id: 'servicos_respondente', label: 'Respondente:', type: 'text', required: true },
      { id: 'servicos_cargo', label: 'Cargo:', type: 'text', required: true },
    ],
  },
  {
    id: 'secao1',
    stepNumber: 2,
    title: 'SEÇÃO 1 — PERFIL DA EMPRESA E CONTEXTO',
    subtitle: 'Dimensão e estrutura da organização.',
    questions: [
      {
        id: 'servicos_1_1',
        label: '1.1 Qual o faturamento anual aproximado da empresa?',
        type: 'text',
        required: true,
      },
      {
        id: 'servicos_1_2',
        label: '1.2 Quantas unidades/sedes a empresa possui?',
        type: 'text',
        required: true,
      },
      {
        id: 'servicos_1_3',
        label: '1.3 Quantos colaboradores ao todo?',
        type: 'text',
        required: true,
      },
      {
        id: 'servicos_1_4',
        label: '1.4 Há quantos anos a empresa opera e qual o crescimento nos últimos 3 anos?',
        type: 'textarea',
        required: true,
      },
      {
        id: 'servicos_1_5',
        label: '1.5 Estrutura de propriedade:',
        type: 'select',
        required: true,
        options: [
          { value: 'Familiar', label: 'Familiar' },
          { value: 'Sócios', label: 'Sócios' },
          { value: 'Investidores', label: 'Investidores' },
          { value: 'Outro', label: 'Outro' },
        ],
      },
      { id: 'servicos_1_5_outro', label: '1.5 Outro (especifique):', type: 'text' },
      {
        id: 'servicos_1_6',
        label: '1.6 Regime tributário:',
        type: 'select',
        required: true,
        options: [
          { value: 'Simples', label: 'Simples' },
          { value: 'Lucro Presumido', label: 'Lucro Presumido' },
          { value: 'Lucro Real', label: 'Lucro Real' },
        ],
      },
      {
        id: 'servicos_1_7',
        label:
          '1.7 Principais fontes de receita (projetos, contratos recorrentes, honorários, etc.)?',
        type: 'textarea',
        required: true,
      },
      {
        id: 'servicos_1_8',
        label: '1.8 Possui certificações ou reconhecimentos de mercado?',
        type: 'text',
        required: true,
      },
    ],
  },
  {
    id: 'secao2',
    stepNumber: 3,
    title: 'SEÇÃO 2 — PILAR 1: PRISÃO DO FUNDADOR',
    subtitle: 'Autonomia decisória e dependência do fundador.',
    questions: [
      {
        id: 'servicos_2_1',
        label:
          '2.1 Qual % do faturamento depende de você estar pessoalmente na negociação ou entrega?',
        type: 'text',
        required: true,
      },
      {
        id: 'servicos_2_2',
        label: '2.2 Quantos contratos estão parados aguardando sua assinatura ou aprovação?',
        type: 'text',
        required: true,
      },
      {
        id: 'servicos_2_3',
        label: '2.3 Sua equipe consegue fechar um negócio de valor médio sem te envolver?',
        type: 'textarea',
        required: true,
      },
      {
        id: 'servicos_2_4',
        label: '2.4 Se você tirar 60 dias de férias, a receita da empresa cai quanto?',
        type: 'text',
        required: true,
      },
      {
        id: 'servicos_2_5',
        label:
          '2.5 Quantas entregas ou propostas dependem da sua revisão final pessoal por semana?',
        type: 'text',
        required: true,
      },
      {
        id: 'servicos_2_6',
        label: '2.6 Existe um sócio/gerente com autonomia formal para decidir sem consultá-lo?',
        type: 'select',
        required: true,
        options: [
          { value: 'Sim', label: 'Sim' },
          { value: 'Não', label: 'Não' },
          { value: 'Parcialmente', label: 'Parcialmente' },
        ],
      },
    ],
  },
  {
    id: 'secao3',
    stepNumber: 4,
    title: 'SEÇÃO 3 — PILAR 2: INEFICIÊNCIA INVISÍVEL',
    subtitle: 'Perdas silenciosas e vazamento de margem.',
    questions: [
      {
        id: 'servicos_3_1',
        label: '3.1 Quantas horas são perdidas com retrabalho por falta de briefing padronizado?',
        type: 'text',
        required: true,
      },
      {
        id: 'servicos_3_2',
        label:
          '3.2 Qual o percentual de horas trabalhadas e não cobradas (vazamento de honorários)?',
        type: 'text',
        required: true,
      },
      {
        id: 'servicos_3_3',
        label:
          '3.3 Quanto tempo a equipe gasta com tarefas administrativas que poderiam ser automatizadas?',
        type: 'text',
        required: true,
      },
      {
        id: 'servicos_3_4',
        label: '3.4 Quantos contratos são renovados sem revisão de preço ou escopo?',
        type: 'text',
        required: true,
      },
      {
        id: 'servicos_3_5',
        label: '3.5 Qual o valor da inadimplência e quem são os 10 maiores devedores?',
        type: 'textarea',
        required: true,
      },
      {
        id: 'servicos_3_6',
        label:
          '3.6 Qual a taxa de utilização real (horas faturáveis / horas disponíveis) da equipe?',
        type: 'text',
        required: true,
      },
      {
        id: 'servicos_3_7',
        label:
          '3.7 Quantas propostas enviadas no último trimestre não foram convertidas e por quê?',
        type: 'textarea',
        required: true,
      },
    ],
  },
  {
    id: 'secao4',
    stepNumber: 5,
    title: 'SEÇÃO 4 — PILAR 3: ABISMO ENTRE ESTRATÉGIA vs EXECUÇÃO',
    subtitle: 'Alinhamento entre direção e equipe técnica/consultores.',
    questions: [
      {
        id: 'servicos_4_1',
        label: '4.1 Qual o prazo médio entre decisão estratégica e implementação na ponta?',
        type: 'text',
        required: true,
      },
      {
        id: 'servicos_4_2',
        label: '4.2 Quantos dos seus OKRs do trimestre passado foram 100% concluídos?',
        type: 'text',
        required: true,
      },
      {
        id: 'servicos_4_3',
        label: '4.3 Sua equipe comercial sabe o lucro líquido por cliente que ela vende?',
        type: 'textarea',
        required: true,
      },
      {
        id: 'servicos_4_4',
        label:
          '4.4 Quantas horas de reunião a equipe gasta discutindo o que já deveria ter sido feito?',
        type: 'text',
        required: true,
      },
      {
        id: 'servicos_4_5',
        label: '4.5 A equipe sabe qual a meta de receita por consultor e como ela é calculada?',
        type: 'textarea',
        required: true,
      },
      {
        id: 'servicos_4_6',
        label: '4.6 Existe um comitê de gestão periódico com indicadores padronizados?',
        type: 'textarea',
        required: true,
      },
    ],
  },
  {
    id: 'secao5',
    stepNumber: 6,
    title: 'SEÇÃO 5 — CAPACIDADE E DESIGN ORGANIZACIONAL (HACKMAN)',
    subtitle: 'Condições facilitadoras e liderança.',
    questions: [
      {
        id: 'servicos_5_1',
        label: '5.1 Existe um time real, com limites claros e interdependência definida?',
        type: 'select',
        required: true,
        options: [
          { value: 'Sim', label: 'Sim' },
          { value: 'Não', label: 'Não' },
          { value: 'Parcialmente', label: 'Parcialmente' },
        ],
      },
      {
        id: 'servicos_5_2',
        label: '5.2 A direção da empresa está clara e convincente para todos?',
        type: 'select',
        required: true,
        options: [
          { value: 'Sim', label: 'Sim' },
          { value: 'Não', label: 'Não' },
          { value: 'Parcialmente', label: 'Parcialmente' },
        ],
      },
      {
        id: 'servicos_5_3',
        label: '5.3 As tarefas e normas facilitam a execução do trabalho?',
        type: 'select',
        required: true,
        options: [
          { value: 'Sim', label: 'Sim' },
          { value: 'Não', label: 'Não' },
          { value: 'Parcialmente', label: 'Parcialmente' },
        ],
      },
      {
        id: 'servicos_5_4',
        label: '5.4 A equipe dispõe de recursos e recompensas adequados?',
        type: 'select',
        required: true,
        options: [
          { value: 'Sim', label: 'Sim' },
          { value: 'Não', label: 'Não' },
          { value: 'Parcialmente', label: 'Parcialmente' },
        ],
      },
      {
        id: 'servicos_5_5',
        label: '5.5 Existe coaching ou feedback contínuo para as lideranças?',
        type: 'select',
        required: true,
        options: [
          { value: 'Sim', label: 'Sim' },
          { value: 'Não', label: 'Não' },
          { value: 'Parcialmente', label: 'Parcialmente' },
        ],
      },
      {
        id: 'servicos_5_6',
        label: '5.6 Quantos dos seus líderes são considerados de alta performance?',
        type: 'text',
        required: true,
      },
    ],
  },
  {
    id: 'secao6',
    stepNumber: 7,
    title: 'SEÇÃO 6 — SAÚDE ECONÔMICO-FINANCEIRA (BUFFETT)',
    subtitle: 'Margem, caixa e sustentabilidade do negócio.',
    questions: [
      {
        id: 'servicos_6_1',
        label: '6.1 Qual a margem EBITDA atual aproximada?',
        type: 'text',
        required: true,
      },
      {
        id: 'servicos_6_2',
        label: '6.2 Qual o nível de endividamento atual (Dívida Líquida / EBITDA)?',
        type: 'text',
        required: true,
      },
      {
        id: 'servicos_6_3',
        label: '6.3 Qual o prazo médio de recebimento da carteira?',
        type: 'text',
        required: true,
      },
      {
        id: 'servicos_6_4',
        label: '6.4 Qual o índice de inadimplência da carteira de clientes?',
        type: 'text',
        required: true,
      },
      {
        id: 'servicos_6_5',
        label: '6.5 A empresa fecha DRE gerencial mensal até o 10º dia útil?',
        type: 'select',
        required: true,
        options: [
          { value: 'Sim', label: 'Sim' },
          { value: 'Não', label: 'Não' },
          { value: 'Parcialmente', label: 'Parcialmente' },
        ],
      },
      {
        id: 'servicos_6_6',
        label: '6.6 Possui reserva de capital de giro para 3 meses de operação?',
        type: 'select',
        required: true,
        options: [
          { value: 'Sim', label: 'Sim' },
          { value: 'Não', label: 'Não' },
          { value: 'Parcialmente', label: 'Parcialmente' },
        ],
      },
    ],
  },
  {
    id: 'secao7',
    stepNumber: 8,
    title: 'SEÇÃO 7 — EXPECTATIVAS E AMBIÇÃO',
    subtitle: 'Objetivos estratégicos e disposição para mudança.',
    questions: [
      {
        id: 'servicos_7_1',
        label: '7.1 O que o levou a buscar este diagnóstico?',
        type: 'textarea',
        required: true,
      },
      {
        id: 'servicos_7_2',
        label: '7.2 Qual o principal problema a resolver nos próximos 12 meses?',
        type: 'textarea',
        required: true,
      },
      {
        id: 'servicos_7_3',
        label: '7.3 Qual o horizonte de transformação desejado para a empresa?',
        type: 'textarea',
        required: true,
      },
      {
        id: 'servicos_7_4',
        label: '7.4 Nível de disposição para mudanças:',
        type: 'select',
        required: true,
        options: [
          { value: 'Alto', label: 'Alto' },
          { value: 'Médio', label: 'Médio' },
          { value: 'Baixo', label: 'Baixo' },
        ],
      },
      {
        id: 'servicos_7_5',
        label: '7.5 Já contratou consultoria ou mentoria anteriormente? Qual o resultado?',
        type: 'textarea',
        required: true,
      },
    ],
  },
  {
    id: 'secao8',
    stepNumber: 9,
    title: 'SEÇÃO 8 — INOVAÇÃO E TECNOLOGIA',
    subtitle: 'Maturidade digital e sistemas integrados.',
    questions: [
      {
        id: 'servicos_8_1',
        label: '8.1 Utiliza ERP/CRM integrado (propostas, contratos, financeiro)? Qual?',
        type: 'textarea',
        required: true,
      },
      {
        id: 'servicos_8_2',
        label: '8.2 Seus sistemas operam em nuvem?',
        type: 'textarea',
        required: true,
      },
      {
        id: 'servicos_8_3',
        label: '8.3 Acompanha dashboards de utilização, receita e pipeline em tempo real?',
        type: 'textarea',
        required: true,
      },
      {
        id: 'servicos_8_4',
        label: '8.4 Utiliza IA para apoio a propostas, contratos ou pesquisa?',
        type: 'textarea',
        required: true,
      },
      {
        id: 'servicos_8_5',
        label: '8.5 Quais processos administrativos já são automatizados?',
        type: 'textarea',
        required: true,
      },
      {
        id: 'servicos_8_6',
        label: '8.6 Nível de maturidade digital:',
        type: 'select',
        required: true,
        options: [
          { value: '1', label: '1-Básico' },
          { value: '2', label: '2-Intermediário' },
          { value: '3', label: '3-Avançado' },
        ],
      },
      {
        id: 'servicos_8_7',
        label: '8.7 Quais as maiores barreiras para digitalizar a operação?',
        type: 'textarea',
        required: true,
      },
    ],
  },
]
