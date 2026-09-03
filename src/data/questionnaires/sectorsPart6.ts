import type { QuestionSection } from '../questionnaire'

// Setor 11: Comércio Internacional (Trading Company) (Páginas 36 a 39 do PDF)
// Nota Importante do PDF: O setor Comércio Internacional – Trading Company não segue o template numérico padrão dos demais setores.
// Peculiaridades:
// - Modalidade de atuação no bloco de identificação
// - Seção 3 com 8 perguntas (3.1 a 3.8)
// - Seção 6 com 10 perguntas (6.1 a 6.10)
// - Seção 8 com 9 perguntas (8.1 a 8.9)
export const comercioInternacionalSections: QuestionSection[] = [
  {
    id: 'identificacao',
    stepNumber: 1,
    title: 'IDENTIFICAÇÃO DA EMPRESA',
    subtitle: 'QUESTIONÁRIO 11 — SETOR COMÉRCIO INTERNACIONAL (TRADING COMPANY)',
    questions: [
      { id: 'trade_razaoSocial', label: 'Razão Social:', type: 'text', required: true },
      {
        id: 'trade_cnpj',
        label: 'CNPJ:',
        type: 'text',
        required: true,
        placeholder: '00.000.000/0000-00',
      },
      { id: 'trade_data', label: 'Data:', type: 'text', placeholder: 'DD/MM/AAAA' },
      {
        id: 'trade_segmento',
        label: 'Segmento:',
        type: 'select',
        required: true,
        options: [
          { value: 'Importação', label: 'Importação' },
          { value: 'Exportação', label: 'Exportação' },
          { value: 'Trading', label: 'Trading' },
          { value: 'Despacho Aduaneiro', label: 'Despacho Aduaneiro' },
          { value: 'Câmbio', label: 'Câmbio' },
          { value: 'Outro', label: 'Outro' },
        ],
      },
      { id: 'trade_segmentoOutro', label: 'Outro (especifique):', type: 'text' },
      {
        id: 'trade_modalidade',
        label: 'Modalidade de atuação:',
        type: 'select',
        required: true,
        options: [
          { value: 'Importação por Conta e Ordem', label: 'Importação por Conta e Ordem' },
          { value: 'Importação por Encomenda', label: 'Importação por Encomenda' },
          { value: 'Ambas', label: 'Ambas' },
        ],
      },
      { id: 'trade_respondente', label: 'Respondente:', type: 'text', required: true },
      { id: 'trade_cargo', label: 'Cargo:', type: 'text', required: true },
    ],
  },
  {
    id: 'secao1',
    stepNumber: 2,
    title: 'SEÇÃO 1 — PERFIL DA EMPRESA E CONTEXTO',
    subtitle: 'Dimensão e estrutura da trading company.',
    questions: [
      {
        id: 'trade_1_1',
        label: '1.1 Qual o faturamento anual aproximado da empresa?',
        type: 'text',
        required: true,
      },
      {
        id: 'trade_1_2',
        label:
          '1.2 Quantas unidades/bases operacionais a empresa possui (portos, armazéns, escritórios)?',
        type: 'text',
        required: true,
      },
      {
        id: 'trade_1_3',
        label: '1.3 Quantos colaboradores ao todo?',
        type: 'text',
        required: true,
      },
      {
        id: 'trade_1_4',
        label: '1.4 Há quantos anos a empresa opera e qual o crescimento nos últimos 3 anos?',
        type: 'textarea',
        required: true,
      },
      {
        id: 'trade_1_5',
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
      { id: 'trade_1_5_outro', label: '1.5 Outro (especifique):', type: 'text' },
      {
        id: 'trade_1_6',
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
        id: 'trade_1_7',
        label:
          '1.7 Principais fontes de receita (management fees, margem de revenda, funding, regimes especiais)?',
        type: 'textarea',
        required: true,
      },
      {
        id: 'trade_1_8',
        label: '1.8 Possui certificações (OEA, ISO, RADAR ativo)?',
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
        id: 'trade_2_1',
        label:
          '2.1 Qual o percentual do seu faturamento que depende de você estar pessoalmente na negociação de importação/exportação?',
        type: 'text',
        required: true,
      },
      {
        id: 'trade_2_2',
        label:
          '2.2 Quantas operações de câmbio ou fechamento de contrato dependem da sua validação pessoal?',
        type: 'text',
        required: true,
      },
      {
        id: 'trade_2_3',
        label:
          '2.3 Sua equipe consegue conduzir um despacho aduaneiro ou negociar com fornecedor estrangeiro sem te envolver?',
        type: 'textarea',
        required: true,
      },
      {
        id: 'trade_2_4',
        label:
          '2.4 Se você se ausentar por 30 dias, quantas operações de importação/exportação param por falta de decisão?',
        type: 'text',
        required: true,
      },
      {
        id: 'trade_2_5',
        label:
          '2.5 Quantas decisões de crédito, hedge cambial ou escolha de fornecedor passam por você pessoalmente?',
        type: 'text',
        required: true,
      },
      {
        id: 'trade_2_6',
        label:
          '2.6 Existe um gerente de operações com autonomia formal para decidir sem consultá-lo?',
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
    subtitle: 'Perdas silenciosas, aduaneiras e tributárias.',
    questions: [
      {
        id: 'trade_3_1',
        label:
          '3.1 Qual o valor de créditos tributários (PIS/COFINS → CBS/IBS) que sua operação deixa de aproveitar?',
        type: 'text',
        required: true,
      },
      {
        id: 'trade_3_2',
        label:
          '3.2 Qual o percentual da sua receita que ainda depende de benefício fiscal estadual de ICMS (que será extinto até 2033)?',
        type: 'text',
        required: true,
      },
      {
        id: 'trade_3_3',
        label:
          '3.3 Qual o valor de capital de giro retido no Fisco por erros de retenção do Split Payment?',
        type: 'text',
        required: true,
      },
      {
        id: 'trade_3_4',
        label:
          '3.4 Sua operação consegue calcular, em tempo real, o regime dual (PIS/COFINS/ICMS legado + CBS/IBS) sem retrabalho?',
        type: 'textarea',
        required: true,
      },
      {
        id: 'trade_3_5',
        label:
          '3.5 Qual o ciclo médio de caixa das suas operações (compra → desembaraço → venda → recebimento)?',
        type: 'text',
        required: true,
      },
      {
        id: 'trade_3_6',
        label:
          '3.6 Quantos dias sua carga fica parada em recintos alfandegados por retrabalho documental ou erro na DUIMP/Invoice/Packing List?',
        type: 'text',
        required: true,
      },
      {
        id: 'trade_3_7',
        label:
          '3.7 Qual o percentual de exposição cambial não protegida (sem hedge) do seu portfólio?',
        type: 'text',
        required: true,
      },
      {
        id: 'trade_3_8',
        label: '3.8 Qual o valor de capital de giro imobilizado em mercadoria em trânsito?',
        type: 'text',
        required: true,
      },
    ],
  },
  {
    id: 'secao4',
    stepNumber: 5,
    title: 'SEÇÃO 4 — PILAR 3: ABISMO ESTRATÉGIA vs. EXECUÇÃO',
    subtitle: 'Alinhamento entre comercial, fiscal e logística.',
    questions: [
      {
        id: 'trade_4_1',
        label:
          '4.1 Qual o prazo médio entre a decisão estratégica e a execução na operação de comércio exterior?',
        type: 'text',
        required: true,
      },
      {
        id: 'trade_4_2',
        label: '4.2 Quantos dos seus OKRs do trimestre passado foram 100% concluídos?',
        type: 'text',
        required: true,
      },
      {
        id: 'trade_4_3',
        label: '4.3 Sua equipe comercial sabe a margem real por operação (landed cost completo)?',
        type: 'textarea',
        required: true,
      },
      {
        id: 'trade_4_4',
        label: '4.4 Quantas reuniões entre comercial, fiscal e logística ocorrem por mês?',
        type: 'text',
        required: true,
      },
      {
        id: 'trade_4_5',
        label: '4.5 Existe um comitê de gestão periódico com indicadores padronizados?',
        type: 'textarea',
        required: true,
      },
      {
        id: 'trade_4_6',
        label: '4.6 A equipe sabe o custo real de cada operação antes de precificar?',
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
        id: 'trade_5_1',
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
        id: 'trade_5_2',
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
        id: 'trade_5_3',
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
        id: 'trade_5_4',
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
        id: 'trade_5_5',
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
        id: 'trade_5_6',
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
    subtitle: 'Margem, funding, ciclo de caixa e risco ICMS 2033.',
    questions: [
      {
        id: 'trade_6_1',
        label: '6.1 Qual a margem EBITDA atual aproximada?',
        type: 'text',
        required: true,
      },
      {
        id: 'trade_6_2',
        label: '6.2 Qual o nível de endividamento atual (Dívida Líquida / EBITDA)?',
        type: 'text',
        required: true,
      },
      {
        id: 'trade_6_3',
        label: '6.3 Qual o prazo médio de recebimento da carteira?',
        type: 'text',
        required: true,
      },
      {
        id: 'trade_6_4',
        label: '6.4 Qual o índice de inadimplência da carteira de clientes?',
        type: 'text',
        required: true,
      },
      {
        id: 'trade_6_5',
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
        id: 'trade_6_6',
        label: '6.6 Possui reserva de capital de giro para 3 meses de operação?',
        type: 'select',
        required: true,
        options: [
          { value: 'Sim', label: 'Sim' },
          { value: 'Não', label: 'Não' },
          { value: 'Parcialmente', label: 'Parcialmente' },
        ],
      },
      {
        id: 'trade_6_7',
        label:
          '6.7 Qual o ciclo de caixa da sua operação (compra → desembaraço → venda → recebimento)?',
        type: 'text',
        required: true,
      },
      {
        id: 'trade_6_8',
        label:
          '6.8 Qual o percentual de exposição cambial não protegida (sem hedge) do seu portfólio?',
        type: 'text',
        required: true,
      },
      {
        id: 'trade_6_9',
        label:
          '6.9 Qual o percentual da sua receita que depende de benefício fiscal estadual de ICMS (risco de descontinuidade até 2033)?',
        type: 'text',
        required: true,
      },
      {
        id: 'trade_6_10',
        label:
          '6.10 Qual a sua capacidade de funding (capital de giro disponível para financiar a nacionalização)?',
        type: 'textarea',
        required: true,
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
        id: 'trade_7_1',
        label: '7.1 O que o levou a buscar este diagnóstico?',
        type: 'textarea',
        required: true,
      },
      {
        id: 'trade_7_2',
        label: '7.2 Qual o principal problema a resolver nos próximos 12 meses?',
        type: 'textarea',
        required: true,
      },
      {
        id: 'trade_7_3',
        label: '7.3 Qual o horizonte de transformação desejado para a empresa?',
        type: 'textarea',
        required: true,
      },
      {
        id: 'trade_7_4',
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
        id: 'trade_7_5',
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
    subtitle: 'Maturidade digital, CBS/IBS dual engine, splitters e inteligência aduaneira.',
    questions: [
      {
        id: 'trade_8_1',
        label:
          '8.1 Utiliza ERP com motor fiscal dinâmico (dual engine CBS/IBS + PIS/COFINS/ICMS legado)? Qual?',
        type: 'textarea',
        required: true,
      },
      {
        id: 'trade_8_2',
        label: '8.2 Seus sistemas operam em nuvem?',
        type: 'textarea',
        required: true,
      },
      {
        id: 'trade_8_3',
        label:
          '8.3 Possui conciliação bancária com APIs de bancos "splitters" (alerta de retenção a maior/menor)?',
        type: 'textarea',
        required: true,
      },
      {
        id: 'trade_8_4',
        label:
          '8.4 Utiliza Control Tower de visibilidade operacional (portos, armazéns, transportadoras, demurrage)?',
        type: 'textarea',
        required: true,
      },
      {
        id: 'trade_8_5',
        label: '8.5 Quais processos são automatizados (Invoice, Packing List, NCM, DUIMP)?',
        type: 'textarea',
        required: true,
      },
      {
        id: 'trade_8_6',
        label: '8.6 Utiliza IA para inteligência aduaneira e classificação fiscal?',
        type: 'textarea',
        required: true,
      },
      {
        id: 'trade_8_7',
        label: '8.7 Acompanha dashboards de landed cost e créditos tributários em tempo real?',
        type: 'textarea',
        required: true,
      },
      {
        id: 'trade_8_8',
        label: '8.8 Nível de maturidade digital:',
        type: 'select',
        required: true,
        options: [
          { value: '1 — Básico', label: '1 — Básico' },
          { value: '2 — Intermediário', label: '2 — Intermediário' },
          { value: '3 — Avançado', label: '3 — Avançado' },
        ],
      },
      {
        id: 'trade_8_9',
        label: '8.9 Quais as maiores barreiras para inovar (custo de ERP, equipe, integração)?',
        type: 'textarea',
        required: true,
      },
    ],
  },
]

// Setor 12: Facilities (Páginas 40 a 43 do PDF)
// Preservando pontuação literal do PDF (ex: '??', 'etc)?')
export const facilitiesSections: QuestionSection[] = [
  {
    id: 'identificacao',
    stepNumber: 1,
    title: 'IDENTIFICAÇÃO DA EMPRESA',
    subtitle: 'QUESTIONÁRIO 12 — SETOR FACILITIES',
    questions: [
      { id: 'fac_razaoSocial', label: 'Razão Social:', type: 'text', required: true },
      {
        id: 'fac_cnpj',
        label: 'CNPJ:',
        type: 'text',
        required: true,
        placeholder: '00.000.000/0000-00',
      },
      { id: 'fac_data', label: 'Data:', type: 'text', placeholder: 'DD/MM/AAAA' },
      {
        id: 'fac_segmento',
        label: 'Segmento:',
        type: 'select',
        required: true,
        options: [
          { value: 'Facilities Management', label: 'Facilities Management' },
          { value: 'Limpeza e Conservação', label: 'Limpeza e Conservação' },
          { value: 'Segurança Patrimonial', label: 'Segurança Patrimonial' },
          { value: 'Manutenção Predial', label: 'Manutenção Predial' },
          { value: 'Portaria/Recepção', label: 'Portaria/Recepção' },
          { value: 'Serviços Terceirizados', label: 'Serviços Terceirizados' },
          { value: 'Outro', label: 'Outro' },
        ],
      },
      { id: 'fac_segmentoOutro', label: 'Outro (especifique):', type: 'text' },
      { id: 'fac_respondente', label: 'Respondente:', type: 'text', required: true },
      { id: 'fac_cargo', label: 'Cargo:', type: 'text', required: true },
    ],
  },
  {
    id: 'secao1',
    stepNumber: 2,
    title: 'SEÇÃO 1 — PERFIL DA EMPRESA E CONTEXTO',
    subtitle: 'Dimensão e estrutura da organização.',
    questions: [
      {
        id: 'fac_1_1',
        label: '1.1 Qual o faturamento anual aproximado da empresa?',
        type: 'text',
        required: true,
      },
      {
        id: 'fac_1_2',
        label: '1.2 Quantas unidades/contratos ativos a empresa possui?',
        type: 'text',
        required: true,
      },
      {
        id: 'fac_1_3',
        label: '1.3 Quantos colaboradores ao todo (incluindo mão de obra alocada)?',
        type: 'text',
        required: true,
      },
      {
        id: 'fac_1_4',
        label: '1.4 Há quantos anos a empresa opera e qual o crescimento nos últimos 3 anos?',
        type: 'textarea',
        required: true,
      },
      {
        id: 'fac_1_5',
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
      { id: 'fac_1_5_outro', label: '1.5 Outro (especifique):', type: 'text' },
      {
        id: 'fac_1_6',
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
        id: 'fac_1_7',
        label:
          '1.7 Principais fontes de receita (contratos privados, licitações públicas, aditivos)?',
        type: 'textarea',
        required: true,
      },
      {
        id: 'fac_1_8',
        label: '1.8 Possui certificações (ISO, PBQP-H, etc)?)?',
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
        id: 'fac_2_1',
        label:
          '2.1 Quantos contratos-chave dependem da sua validação pessoal para renovação ou renegociação??',
        type: 'text',
        required: true,
      },
      {
        id: 'fac_2_2',
        label: '2.2 Quantas negociações com grandes contratantes passam por você pessoalmente?',
        type: 'text',
        required: true,
      },
      {
        id: 'fac_2_3',
        label:
          '2.3 Sua equipe consegue resolver um problema operacional de um cliente sem te consultar?',
        type: 'textarea',
        required: true,
      },
      {
        id: 'fac_2_4',
        label: '2.4 Se você se ausentar por 30 dias, quantas operações param por falta de decisão?',
        type: 'text',
        required: true,
      },
      {
        id: 'fac_2_5',
        label:
          '2.5 Quantas decisões de contratação de mão de obra ou compra de insumos passam por você??',
        type: 'text',
        required: true,
      },
      {
        id: 'fac_2_6',
        label:
          '2.6 Existe um gerente de operações com autonomia formal para decidir sem consultá-lo?',
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
    subtitle: 'Perdas silenciosas, horas ociosas e turnover.',
    questions: [
      {
        id: 'fac_3_1',
        label: '3.1 Quantos dos seus contratos são renovados sem revisão de preço ou escopo?',
        type: 'text',
        required: true,
      },
      {
        id: 'fac_3_2',
        label: '3.2 Qual o índice de horas ociosas da mão de obra alocada?',
        type: 'text',
        required: true,
      },
      {
        id: 'fac_3_3',
        label: '3.3 Qual o percentual de retrabalho e o custo disso?',
        type: 'text',
        required: true,
      },
      {
        id: 'fac_3_4',
        label: '3.4 Qual o índice de turnover da mão de obra e o custo de reposição?',
        type: 'text',
        required: true,
      },
      {
        id: 'fac_3_5',
        label: '3.5 Quantos aditivos ou serviços extras foram realizados e não cobrados?',
        type: 'text',
        required: true,
      },
      {
        id: 'fac_3_6',
        label: '3.6 Qual a margem real por contrato (custo de mão de obra vs. preço cobrado)?',
        type: 'textarea',
        required: true,
      },
      {
        id: 'fac_3_7',
        label: '3.7 Qual o valor de multas ou perdas por descumprimento de SLA contratual?',
        type: 'text',
        required: true,
      },
    ],
  },
  {
    id: 'secao4',
    stepNumber: 5,
    title: 'SEÇÃO 4 — PILAR 3: ABISMO ESTRATÉGIA vs. EXECUÇÃO',
    subtitle: 'Alinhamento entre comercial, operação e financeiro.',
    questions: [
      {
        id: 'fac_4_1',
        label: '4.1 Qual o prazo médio entre a decisão estratégica e a implementação na operação?',
        type: 'text',
        required: true,
      },
      {
        id: 'fac_4_2',
        label: '4.2 Quantos dos seus OKRs do trimestre passado foram 100% concluídos?',
        type: 'text',
        required: true,
      },
      {
        id: 'fac_4_3',
        label: '4.3 Sua equipe sabe a margem real por contrato e por cliente?',
        type: 'textarea',
        required: true,
      },
      {
        id: 'fac_4_4',
        label: '4.4 Quantas reuniões entre comercial, operação e financeiro ocorrem por mês?',
        type: 'text',
        required: true,
      },
      {
        id: 'fac_4_5',
        label: '4.5 Existe um comitê de gestão periódico com indicadores padronizados?',
        type: 'textarea',
        required: true,
      },
      {
        id: 'fac_4_6',
        label: '4.6 A equipe sabe o custo real de cada contrato antes de renegociar?',
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
        id: 'fac_5_1',
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
        id: 'fac_5_2',
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
        id: 'fac_5_3',
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
        id: 'fac_5_4',
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
        id: 'fac_5_5',
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
        id: 'fac_5_6',
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
        id: 'fac_6_1',
        label: '6.1 Qual a margem EBITDA atual aproximada?',
        type: 'text',
        required: true,
      },
      {
        id: 'fac_6_2',
        label: '6.2 Qual o nível de endividamento atual (Dívida Líquida / EBITDA)?',
        type: 'text',
        required: true,
      },
      {
        id: 'fac_6_3',
        label: '6.3 Qual o prazo médio de recebimento da carteira?',
        type: 'text',
        required: true,
      },
      {
        id: 'fac_6_4',
        label: '6.4 Qual o índice de inadimplência da carteira de clientes?',
        type: 'text',
        required: true,
      },
      {
        id: 'fac_6_5',
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
        id: 'fac_6_6',
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
        id: 'fac_7_1',
        label: '7.1 O que o levou a buscar este diagnóstico?',
        type: 'textarea',
        required: true,
      },
      {
        id: 'fac_7_2',
        label: '7.2 Qual o principal problema a resolver nos próximos 12 meses?',
        type: 'textarea',
        required: true,
      },
      {
        id: 'fac_7_3',
        label: '7.3 Qual o horizonte de transformação desejado para a empresa?',
        type: 'textarea',
        required: true,
      },
      {
        id: 'fac_7_4',
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
        id: 'fac_7_5',
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
    subtitle: 'Maturidade digital e sistemas de contratos e escalas.',
    questions: [
      {
        id: 'fac_8_1',
        label: '8.1 Utiliza ERP ou sistema de gestão de contratos e escalas? Qual?',
        type: 'textarea',
        required: true,
      },
      {
        id: 'fac_8_2',
        label: '8.2 Seus sistemas operam em nuvem?',
        type: 'textarea',
        required: true,
      },
      {
        id: 'fac_8_3',
        label: '8.3 Possui BI de margem por contrato e horas ociosas?',
        type: 'textarea',
        required: true,
      },
      {
        id: 'fac_8_4',
        label: '8.4 Utiliza automação de medições e faturamento?',
        type: 'textarea',
        required: true,
      },
      {
        id: 'fac_8_5',
        label: '8.5 Quais processos são automatizados (escalas, medições, faturamento, cobrança)?',
        type: 'textarea',
        required: true,
      },
      {
        id: 'fac_8_6',
        label: '8.6 Nível de maturidade digital:',
        type: 'select',
        required: true,
        options: [
          { value: '1 — Básico', label: '1 — Básico' },
          { value: '2 — Intermediário', label: '2 — Intermediário' },
          { value: '3 — Avançado', label: '3 — Avançado' },
        ],
      },
      {
        id: 'fac_8_7',
        label: '8.7 Quais as maiores barreiras para inovar (custo, equipe, integração)?',
        type: 'textarea',
        required: true,
      },
    ],
  },
]
