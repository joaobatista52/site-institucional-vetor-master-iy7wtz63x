/**
 * Serviço de Exportação do Dossiê Estratégico em JSON (Schema V6.7, Versão 1.0)
 *
 * Especificação fechada com o expert do cliente:
 * 1) schema_versao '1.0'
 * 2) bloco dossie:
 *    - id do lead
 *    - setor no enum padronizado com underscore (ex.: comercio_internacional, construcao, educacao, etc.)
 *    - setor_exibido (nome oficial)
 *    - segmento (resolvido com regras de "Outro: ..." e varejo e-commerce)
 *    - data_download (ISO 8601)
 *    - data_submissao (data do cadastro/lead)
 *    - questionario_versao: 'V6.7'
 *    - origem: 'vetor_master'
 * 3) bloco cliente:
 *    - razao_social, cnpj, respondente, cargo, email, telefone, whatsapp, faturamento, plano_pretendido
 * 4) seções 1–9 com perguntas no formato:
 *    { id, enunciado, tipo, status, resposta, requer_verificacao }
 *    - enunciado e tipo vindos do dicionário do questionário (Questionnaire)
 *    - status congelado: apenas 'respondido' | 'nao_respondido' (nao_aplicavel reservado, NÃO emitir)
 *    - requer_verificacao SEMPRE derivada: (status !== 'respondido'), nunca gravada
 *    - campo preenchido -> 'respondido', campo vazio/ausente -> 'nao_respondido' com resposta null
 *    - texto digitado pelo cliente (ex.: 'N/A', 'Não aplicável') é resposta real -> 'respondido'
 *    - aplicar regras de exibição ('Outro: ...', e-commerce complementar do varejo)
 * 5) bloco anexos:
 *    - contrato_social, certificacoes, documentacao_adicional
 *    - arquivos: nome, tipo, tamanho_bytes, url_download (autenticada/tokenizada ou acessível)
 *    - hash_sha256 calculado no momento da exportação via crypto.subtle (ou fallback)
 *    - NUNCA embutir binário/base64 — anexos sempre referenciados
 * 6) validação prévia:
 *    - setor válido
 *    - versão do questionário registrada
 *    - CNPJ presente
 * 7) nome de arquivo:
 *    dossie-<setor>-<empresa>-<data>.json
 */

import pb from '@/lib/pocketbase/client'
import type { LeadRecord, LeadCadastro } from '@/services/leads'
import { parseLeadCadastro, parseLeadRespostas, getFileUrl } from '@/services/leads'
import { getQuestionnaireSections } from '@/data/questionnaireSectors'
import { findSector, leadSectors } from '@/data/sectors'
import type { Question, QuestionSection } from '@/data/questionnaire'
import { createZipArchive, type ZipEntry } from '@/lib/zipArchive'

export type DossieStatus = 'respondido' | 'nao_respondido'
// 'nao_aplicavel' reservado no enum conceitual para expansões futuras, NUNCA emitido na V1

export interface DossiePerguntaExport {
  id: string
  enunciado: string
  tipo: string
  status: DossieStatus
  resposta: string | null
  requer_verificacao: boolean
}

export interface DossieSecaoExport {
  id: string
  numero: number
  titulo: string
  subtitulo?: string
  total_perguntas: number
  total_respondidas: number
  perguntas: DossiePerguntaExport[]
}

export interface DossieAnexoArquivoExport {
  nome: string
  tipo: string
  tamanho_bytes: number | null
  url_download: string
  hash_sha256: string | null
}

export interface DossieAnexosExport {
  total_arquivos: number
  contrato_social: DossieAnexoArquivoExport[]
  certificacoes: DossieAnexoArquivoExport[]
  documentacao_adicional: DossieAnexoArquivoExport[]
}

export interface DossieClienteExport {
  razao_social: string
  cnpj: string
  respondente: string
  cargo: string
  email: string
  telefone: string
  whatsapp: string
  faturamento?: string
  plano_pretendido?: string
  autorizacao_devolutiva?: string
  formato_interesse?: string
  responsavel_documentos?: string
}

export interface DossieMetadataExport {
  id: string
  setor: string // Enum com underscore: saude, varejo, servicos, comercio_internacional, facilities, etc.
  setor_exibido: string // Nome amigável: "Comércio Internacional - Trading Company"
  segmento: string | null
  data_download: string
  data_submissao: string
  questionario_versao: 'V6.7'
  origem: 'vetor_master'
}

export interface DossieJsonSchema {
  schema_versao: '1.0'
  dossie: DossieMetadataExport
  cliente: DossieClienteExport
  secoes: Record<string, DossieSecaoExport>
  anexos: DossieAnexosExport
}

/**
 * Mapeamento de setor_id para o enum padronizado com underscore
 */
export function getStandardizedSectorEnum(rawSectorId?: string, rawSectorName?: string): string {
  const normId = (rawSectorId || '').toLowerCase().trim().replace(/[-]/g, '_')
  const allowed = [
    'saude',
    'varejo',
    'servicos',
    'comercio_internacional',
    'facilities',
    'industria',
    'tecnologia',
    'construcao',
    'logistica',
    'educacao',
    'agronegocio',
    'academias',
  ]

  if (allowed.includes(normId)) {
    return normId
  }

  // Tentar inferir pelo nome
  const name = (rawSectorName || '').toLowerCase()
  if (name.includes('saúde') || name.includes('saude')) return 'saude'
  if (name.includes('varejo')) return 'varejo'
  if (name.includes('serviço') || name.includes('servico')) return 'servicos'
  if (name.includes('comércio') || name.includes('trading') || name.includes('comercio'))
    return 'comercio_internacional'
  if (name.includes('facilities')) return 'facilities'
  if (name.includes('indústria') || name.includes('industria')) return 'industria'
  if (name.includes('tecnologia') || name.includes('tech') || name.includes('startup'))
    return 'tecnologia'
  if (name.includes('construção') || name.includes('construcao')) return 'construcao'
  if (name.includes('logística') || name.includes('logistica') || name.includes('transporte'))
    return 'logistica'
  if (name.includes('educação') || name.includes('educacao')) return 'educacao'
  if (name.includes('agro') || name.includes('agronegócio')) return 'agronegocio'
  if (name.includes('academia')) return 'academias'

  return normId || 'setor_desconhecido'
}

/**
 * Normaliza o ID para busca nos dicionários de setores (hífens em vez de underscores)
 */
export function normalizeSectorIdForDictionary(
  rawSectorId?: string,
  rawSectorName?: string,
): string {
  const normEnum = getStandardizedSectorEnum(rawSectorId, rawSectorName)
  if (normEnum === 'comercio_internacional') return 'comercio-internacional'
  return normEnum
}

/**
 * Validação prévia à exportação
 */
export interface DossieValidationResult {
  valid: boolean
  errors: string[]
  warnings: string[]
}

export function validateLeadForExport(lead: LeadRecord): DossieValidationResult {
  const errors: string[] = []
  const warnings: string[] = []

  const cadastro = parseLeadCadastro(lead)
  const respostas = parseLeadRespostas(lead)

  // 1. Setor válido
  const normalizedSectorId = normalizeSectorIdForDictionary(lead.setor_id, lead.setor)
  const foundSector = findSector(normalizedSectorId)
  if (!foundSector && !lead.setor) {
    errors.push('Setor inválido ou não identificado no registro do lead.')
  }

  // 2. Versão do questionário registrada
  // Schema V6.7 oficial
  const questionnaireVersion = 'V6.7'
  if (!questionnaireVersion) {
    errors.push('Versão do questionário não registrada.')
  }

  // 3. CNPJ presente
  const cnpjFound =
    (typeof cadastro.cnpj === 'string' && cadastro.cnpj.trim()) ||
    (typeof respostas.saude_cnpj === 'string' && respostas.saude_cnpj.trim()) ||
    (typeof respostas.varejo_cnpj === 'string' && respostas.varejo_cnpj.trim()) ||
    (typeof respostas.servicos_cnpj === 'string' && respostas.servicos_cnpj.trim()) ||
    (typeof respostas.industria_cnpj === 'string' && respostas.industria_cnpj.trim()) ||
    (typeof respostas.trade_cnpj === 'string' && respostas.trade_cnpj.trim()) ||
    (typeof respostas.fac_cnpj === 'string' && respostas.fac_cnpj.trim()) ||
    (typeof respostas.tech_cnpj === 'string' && respostas.tech_cnpj.trim()) ||
    (typeof respostas.const_cnpj === 'string' && respostas.const_cnpj.trim()) ||
    (typeof respostas.log_cnpj === 'string' && respostas.log_cnpj.trim()) ||
    (typeof respostas.edu_cnpj === 'string' && respostas.edu_cnpj.trim()) ||
    (typeof respostas.agro_cnpj === 'string' && respostas.agro_cnpj.trim()) ||
    (typeof respostas.acad_cnpj === 'string' && respostas.acad_cnpj.trim()) ||
    (typeof respostas.cnpj === 'string' && respostas.cnpj.trim()) ||
    ''

  if (!cnpjFound) {
    errors.push('CNPJ da empresa não informado ou ausente no cadastro do lead.')
  }

  // Avisos de campos complementares recomendados
  if (!cadastro.empresa) {
    warnings.push('Razão Social / Nome da empresa não especificado no bloco de cadastro.')
  }
  if (!cadastro.email) {
    warnings.push('E-mail corporativo não informado.')
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings,
  }
}

/**
 * Calcula o hash SHA-256 de um ArrayBuffer usando Web Crypto API
 */
export async function calculateSha256(buffer: ArrayBuffer): Promise<string> {
  if (typeof crypto !== 'undefined' && crypto.subtle && crypto.subtle.digest) {
    const hashBuffer = await crypto.subtle.digest('SHA-256', buffer)
    const hashArray = Array.from(new Uint8Array(hashBuffer))
    return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('')
  }
  // Fallback caso crypto.subtle não esteja disponível no ambiente (raro em browsers modernos)
  return 'crypto_subtle_indisponivel'
}

/**
 * Resolve valor da pergunta aplicando as mesmas regras consolidadas do modal:
 * - "Outro: ..." se marcado 'Outro' ou campo complementar
 * - Varejo: "«segmento escolhido» + E-commerce complementar" se aplicável
 */
export function resolveQuestionAnswer(
  questionId: string,
  respostas: Record<string, unknown>,
): { hasAnswer: boolean; value: string | null } {
  let val = respostas[questionId]

  // Ponto 4: Tratamento de "Outro"
  const outroText =
    (respostas[`${questionId}_outro`] as string) ||
    (respostas[`${questionId}Outro`] as string) ||
    (questionId.endsWith('_segmento')
      ? (respostas[`${questionId}Outro`] as string) || (respostas[`${questionId}_outro`] as string)
      : '')

  const isValEmpty = val === undefined || val === '' || val === null
  const isValOutro = typeof val === 'string' && val.trim().toLowerCase() === 'outro'

  if (isValEmpty && outroText && outroText.trim()) {
    val = `Outro: ${outroText.trim()}`
  } else if (isValOutro) {
    if (outroText && outroText.trim()) {
      val = `Outro: ${outroText.trim()}`
    } else {
      val = 'Outro (não detalhado)'
    }
  }

  // Ponto 2: Varejo - "e-commerce" agregável
  if (questionId === 'varejo_segmento') {
    const ecomIntegrated = respostas['varejo_1_ecommerce_integrado'] as string | undefined
    const isYesEcom =
      ecomIntegrated &&
      (ecomIntegrated.toLowerCase().startsWith('sim') || ecomIntegrated.includes('omnichannel'))
    const segmentStr = typeof val === 'string' ? val : ''
    const isNotEcommerce = segmentStr && !segmentStr.toLowerCase().includes('e-commerce')

    if (isNotEcommerce && isYesEcom) {
      val = `${segmentStr} + E-commerce complementar`
    }
  }

  // Regras de preenchimento congeladas:
  // - Vazio ou ausente -> nao_respondido com resposta null
  // - Texto digitado pelo cliente (ex.: 'N/A', 'Não aplicável') é resposta real -> 'respondido'
  if (val === undefined || val === null) {
    return { hasAnswer: false, value: null }
  }

  const strVal = String(val).trim()
  if (strVal === '') {
    return { hasAnswer: false, value: null }
  }

  return { hasAnswer: true, value: strVal }
}

/**
 * Constrói a URL autenticada de download de um arquivo no PocketBase
 */
export function getAuthenticatedFileUrl(lead: LeadRecord, filename: string): string {
  const baseUrl = getFileUrl(lead, filename)
  const token = pb.authStore.token
  if (!token) return baseUrl
  const separator = baseUrl.includes('?') ? '&' : '?'
  return `${baseUrl}${separator}token=${encodeURIComponent(token)}`
}

/**
 * Busca o arquivo via fetch autenticado, obtém tamanho, mime-type e SHA-256
 */
export async function inspectFileMetadata(
  lead: LeadRecord,
  filename: string,
): Promise<{
  nome: string
  tipo: string
  tamanho_bytes: number | null
  url_download: string
  hash_sha256: string | null
  dataBuffer?: Uint8Array
}> {
  const downloadUrl = getAuthenticatedFileUrl(lead, filename)
  const ext = filename.split('.').pop()?.toLowerCase() || ''

  let mimeType = 'application/octet-stream'
  if (ext === 'pdf') mimeType = 'application/pdf'
  else if (ext === 'docx')
    mimeType = 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
  else if (ext === 'doc') mimeType = 'application/msword'
  else if (ext === 'xlsx')
    mimeType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
  else if (ext === 'xls') mimeType = 'application/vnd.ms-excel'
  else if (ext === 'csv') mimeType = 'text/csv'
  else if (ext === 'png') mimeType = 'image/png'
  else if (ext === 'jpg' || ext === 'jpeg') mimeType = 'image/jpeg'

  let sha256: string | null = null
  let byteSize: number | null = null
  let bufferData: Uint8Array | undefined

  try {
    const headers: Record<string, string> = {}
    if (pb.authStore.token) {
      headers.Authorization = pb.authStore.token
    }

    const res = await fetch(downloadUrl, { headers })
    if (res.ok) {
      const contentType = res.headers.get('content-type')
      if (contentType) mimeType = contentType.split(';')[0].trim()

      const arrayBuffer = await res.arrayBuffer()
      byteSize = arrayBuffer.byteLength
      bufferData = new Uint8Array(arrayBuffer)
      sha256 = await calculateSha256(arrayBuffer)
    } else {
      console.warn(`Não foi possível baixar anexo "${filename}" (HTTP ${res.status}).`)
    }
  } catch (err) {
    console.warn(`Erro ao calcular SHA256 do anexo "${filename}":`, err)
  }

  return {
    nome: filename,
    tipo: mimeType,
    tamanho_bytes: byteSize,
    url_download: downloadUrl,
    hash_sha256: sha256,
    dataBuffer: bufferData,
  }
}

/**
 * Constrói o objeto JSON completo do dossiê (Schema V6.7 v1.0)
 */
export async function buildDossieJson(
  lead: LeadRecord,
  onProgress?: (progressText: string) => void,
): Promise<{
  dossieData: DossieJsonSchema
  filename: string
  anexosBuffers: { group: string; filename: string; data: Uint8Array }[]
}> {
  onProgress?.('Validando dados do dossiê...')
  const cadastro = parseLeadCadastro(lead)
  const respostas = parseLeadRespostas(lead)

  const normalizedSectorId = normalizeSectorIdForDictionary(lead.setor_id, lead.setor)
  const sectorInfo = findSector(normalizedSectorId)
  const standardizedSectorEnum = getStandardizedSectorEnum(lead.setor_id, lead.setor)
  const sectorDisplayed = lead.setor || sectorInfo?.name || 'Setor não informado'

  // Resolver segmento do lead (com tratamento de Outro e Varejo)
  let segmentoResolvido: string | null = null
  const possibleSegmentKeys = [
    `${normalizedSectorId}_segmento`,
    `${standardizedSectorEnum}_segmento`,
    'segmento',
    'trade_segmento',
    'fac_segmento',
    'agro_segmento',
    'tech_segmento',
    'const_segmento',
    'log_segmento',
    'edu_segmento',
    'acad_segmento',
    'saude_segmento',
    'servicos_segmento',
    'industria_segmento',
    'varejo_segmento',
  ]
  for (const key of possibleSegmentKeys) {
    if (respostas[key] !== undefined && respostas[key] !== null) {
      const { hasAnswer, value } = resolveQuestionAnswer(key, respostas)
      if (hasAnswer && value) {
        segmentoResolvido = value
        break
      }
    }
  }

  // Resolver CNPJ
  const cnpjResolvido =
    (typeof cadastro.cnpj === 'string' && cadastro.cnpj.trim()) ||
    (typeof respostas.saude_cnpj === 'string' && respostas.saude_cnpj.trim()) ||
    (typeof respostas.varejo_cnpj === 'string' && respostas.varejo_cnpj.trim()) ||
    (typeof respostas.servicos_cnpj === 'string' && respostas.servicos_cnpj.trim()) ||
    (typeof respostas.industria_cnpj === 'string' && respostas.industria_cnpj.trim()) ||
    (typeof respostas.trade_cnpj === 'string' && respostas.trade_cnpj.trim()) ||
    (typeof respostas.fac_cnpj === 'string' && respostas.fac_cnpj.trim()) ||
    (typeof respostas.tech_cnpj === 'string' && respostas.tech_cnpj.trim()) ||
    (typeof respostas.const_cnpj === 'string' && respostas.const_cnpj.trim()) ||
    (typeof respostas.log_cnpj === 'string' && respostas.log_cnpj.trim()) ||
    (typeof respostas.edu_cnpj === 'string' && respostas.edu_cnpj.trim()) ||
    (typeof respostas.agro_cnpj === 'string' && respostas.agro_cnpj.trim()) ||
    (typeof respostas.acad_cnpj === 'string' && respostas.acad_cnpj.trim()) ||
    (typeof respostas.cnpj === 'string' && respostas.cnpj.trim()) ||
    'Não informado'

  // Resolver Razão Social
  const razaoSocialResolvida =
    cadastro.empresa ||
    (typeof respostas.saude_razaoSocial === 'string' && respostas.saude_razaoSocial) ||
    (typeof respostas.varejo_razaoSocial === 'string' && respostas.varejo_razaoSocial) ||
    (typeof respostas.servicos_razaoSocial === 'string' && respostas.servicos_razaoSocial) ||
    (typeof respostas.industria_razaoSocial === 'string' && respostas.industria_razaoSocial) ||
    (typeof respostas.trade_razaoSocial === 'string' && respostas.trade_razaoSocial) ||
    (typeof respostas.fac_razaoSocial === 'string' && respostas.fac_razaoSocial) ||
    (typeof respostas.tech_razaoSocial === 'string' && respostas.tech_razaoSocial) ||
    (typeof respostas.const_razaoSocial === 'string' && respostas.const_razaoSocial) ||
    (typeof respostas.log_razaoSocial === 'string' && respostas.log_razaoSocial) ||
    (typeof respostas.edu_razaoSocial === 'string' && respostas.edu_razaoSocial) ||
    (typeof respostas.agro_razaoSocial === 'string' && respostas.agro_razaoSocial) ||
    (typeof respostas.acad_razaoSocial === 'string' && respostas.acad_razaoSocial) ||
    (typeof respostas.razaoSocial === 'string' && respostas.razaoSocial) ||
    'Empresa não informada'

  // Resolver Respondente
  const respondenteResolvido =
    cadastro.nomeCompleto ||
    (typeof respostas.saude_respondente === 'string' && respostas.saude_respondente) ||
    (typeof respostas.varejo_respondente === 'string' && respostas.varejo_respondente) ||
    (typeof respostas.servicos_respondente === 'string' && respostas.servicos_respondente) ||
    (typeof respostas.industria_respondente === 'string' && respostas.industria_respondente) ||
    (typeof respostas.trade_respondente === 'string' && respostas.trade_respondente) ||
    (typeof respostas.fac_respondente === 'string' && respostas.fac_respondente) ||
    (typeof respostas.tech_respondente === 'string' && respostas.tech_respondente) ||
    (typeof respostas.const_respondente === 'string' && respostas.const_respondente) ||
    (typeof respostas.log_respondente === 'string' && respostas.log_respondente) ||
    (typeof respostas.edu_respondente === 'string' && respostas.edu_respondente) ||
    (typeof respostas.agro_respondente === 'string' && respostas.agro_respondente) ||
    (typeof respostas.acad_respondente === 'string' && respostas.acad_respondente) ||
    (typeof respostas.respondente === 'string' && respostas.respondente) ||
    'Não informado'

  // Resolver Cargo
  const cargoResolvido =
    cadastro.cargo ||
    (typeof respostas.saude_cargo === 'string' && respostas.saude_cargo) ||
    (typeof respostas.varejo_cargo === 'string' && respostas.varejo_cargo) ||
    (typeof respostas.servicos_cargo === 'string' && respostas.servicos_cargo) ||
    (typeof respostas.industria_cargo === 'string' && respostas.industria_cargo) ||
    (typeof respostas.trade_cargo === 'string' && respostas.trade_cargo) ||
    (typeof respostas.fac_cargo === 'string' && respostas.fac_cargo) ||
    (typeof respostas.tech_cargo === 'string' && respostas.tech_cargo) ||
    (typeof respostas.const_cargo === 'string' && respostas.const_cargo) ||
    (typeof respostas.log_cargo === 'string' && respostas.log_cargo) ||
    (typeof respostas.edu_cargo === 'string' && respostas.edu_cargo) ||
    (typeof respostas.agro_cargo === 'string' && respostas.agro_cargo) ||
    (typeof respostas.acad_cargo === 'string' && respostas.acad_cargo) ||
    (typeof respostas.cargo === 'string' && respostas.cargo) ||
    'Não informado'

  const dateDownloadIso = new Date().toISOString()
  const dateSubmissaoIso = lead.created ? new Date(lead.created).toISOString() : dateDownloadIso

  // 1. Bloco Dossiê
  const dossieMetadata: DossieMetadataExport = {
    id: lead.id,
    setor: standardizedSectorEnum,
    setor_exibido: sectorDisplayed,
    segmento: segmentoResolvido,
    data_download: dateDownloadIso,
    data_submissao: dateSubmissaoIso,
    questionario_versao: 'V6.7',
    origem: 'vetor_master',
  }

  // 2. Bloco Cliente
  const clienteData: DossieClienteExport = {
    razao_social: razaoSocialResolvida,
    cnpj: cnpjResolvido,
    respondente: respondenteResolvido,
    cargo: cargoResolvido,
    email: cadastro.email || 'Não informado',
    telefone: cadastro.telefone ? String(cadastro.telefone) : cadastro.whatsapp || 'Não informado',
    whatsapp: cadastro.whatsapp || 'Não informado',
    faturamento: cadastro.faturamento || (respostas.faturamentoAnual as string) || undefined,
    plano_pretendido: cadastro.planoEscolhido || (respostas.plano_escolhido as string) || undefined,
    autorizacao_devolutiva: lead.autorizacao_devolutiva || undefined,
    formato_interesse: lead.formato_interesse || undefined,
    responsavel_documentos: lead.responsavel_documentos || undefined,
  }

  // 3. Bloco Seções 1–9 com perguntas enriquecidas com o dicionário
  onProgress?.('Enriquecendo seções e perguntas com o dicionário V6.7...')
  const rawSections = getQuestionnaireSections(normalizedSectorId)

  const secoesMap: Record<string, DossieSecaoExport> = {}

  rawSections.forEach((sec, idx) => {
    // Normalizar ID da seção: identificacao -> secao_identificacao, secao1 -> secao_1
    const secKey = sec.id.startsWith('secao')
      ? sec.id.replace('secao', 'secao_')
      : `secao_${sec.id}`

    let answeredCount = 0
    const perguntas: DossiePerguntaExport[] = sec.questions.map((q) => {
      const { hasAnswer, value } = resolveQuestionAnswer(q.id, respostas)
      const status: DossieStatus = hasAnswer ? 'respondido' : 'nao_respondido'
      if (hasAnswer) answeredCount++

      // Regra de ouro da especificação:
      // requer_verificacao é SEMPRE derivada: (status !== 'respondido'), nunca gravada
      const requer_verificacao = status !== 'respondido'

      return {
        id: q.id,
        enunciado: q.label,
        tipo: q.type,
        status,
        resposta: value,
        requer_verificacao,
      }
    })

    secoesMap[secKey] = {
      id: secKey,
      numero: sec.stepNumber ?? idx + 1,
      titulo: sec.title,
      subtitulo: sec.subtitle || undefined,
      total_perguntas: sec.questions.length,
      total_respondidas: answeredCount,
      perguntas,
    }
  })

  // 4. Bloco Anexos com cálculo de SHA-256 e sem embutir binário no JSON
  onProgress?.('Processando anexos e calculando hashes criptográficos...')

  const contratoFiles = Array.isArray(lead.contrato_social)
    ? lead.contrato_social
    : lead.contrato_social
      ? [lead.contrato_social]
      : []

  const certFiles = Array.isArray(lead.certificacoes)
    ? lead.certificacoes
    : lead.certificacoes
      ? [lead.certificacoes]
      : []

  const docFiles = Array.isArray(lead.documentacao_adicional)
    ? lead.documentacao_adicional
    : lead.documentacao_adicional
      ? [lead.documentacao_adicional]
      : []

  const anexosBuffers: { group: string; filename: string; data: Uint8Array }[] = []

  const processFileList = async (files: string[], groupName: string) => {
    const list: DossieAnexoArquivoExport[] = []
    for (const f of files) {
      if (!f) continue
      const meta = await inspectFileMetadata(lead, f)
      list.push({
        nome: meta.nome,
        tipo: meta.tipo,
        tamanho_bytes: meta.tamanho_bytes,
        url_download: meta.url_download,
        hash_sha256: meta.hash_sha256,
      })
      if (meta.dataBuffer) {
        anexosBuffers.push({
          group: groupName,
          filename: meta.nome,
          data: meta.dataBuffer,
        })
      }
    }
    return list
  }

  const processedContrato = await processFileList(contratoFiles, 'contrato_social')
  const processedCert = await processFileList(certFiles, 'certificacoes')
  const processedDocs = await processFileList(docFiles, 'documentacao_adicional')

  const totalArquivos = processedContrato.length + processedCert.length + processedDocs.length

  const anexosData: DossieAnexosExport = {
    total_arquivos: totalArquivos,
    contrato_social: processedContrato,
    certificacoes: processedCert,
    documentacao_adicional: processedDocs,
  }

  // 5. Montagem final do JSON (Schema 1.0)
  const finalJson: DossieJsonSchema = {
    schema_versao: '1.0',
    dossie: dossieMetadata,
    cliente: clienteData,
    secoes: secoesMap,
    anexos: anexosData,
  }

  // 6. Nome padronizado do arquivo:
  // dossie-<setor>-<empresa>-<data>.json
  const safeSector = standardizedSectorEnum.toLowerCase().replace(/[^a-z0-9_]/g, '')
  const safeCompany =
    razaoSocialResolvida
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')
      .slice(0, 30) || 'empresa'
  const dateFormatted = new Date().toISOString().slice(0, 10) // YYYY-MM-DD
  const filename = `dossie-${safeSector}-${safeCompany}-${dateFormatted}.json`

  return {
    dossieData: finalJson,
    filename,
    anexosBuffers,
  }
}

/**
 * Dispara o download de um arquivo no navegador
 */
export function triggerBrowserDownload(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  setTimeout(() => URL.revokeObjectURL(url), 1000)
}

/**
 * Exporta o Dossiê Estratégico como arquivo JSON
 */
export async function exportDossieAsJson(
  lead: LeadRecord,
  onProgress?: (progressText: string) => void,
): Promise<{ filename: string; dossieData: DossieJsonSchema }> {
  const { dossieData, filename } = await buildDossieJson(lead, onProgress)
  const jsonString = JSON.stringify(dossieData, null, 2)
  const blob = new Blob([jsonString], { type: 'application/json;charset=utf-8' })
  triggerBrowserDownload(blob, filename)
  return { filename, dossieData }
}

/**
 * Baixa todos os anexos do lead em lote em um único arquivo .zip
 */
export async function downloadAllLeadAttachmentsZip(
  lead: LeadRecord,
  onProgress?: (progressText: string) => void,
): Promise<{ totalFiles: number; zipFilename: string }> {
  onProgress?.('Coletando lista de anexos do dossiê...')
  const contratoFiles = Array.isArray(lead.contrato_social)
    ? lead.contrato_social
    : lead.contrato_social
      ? [lead.contrato_social]
      : []

  const certFiles = Array.isArray(lead.certificacoes)
    ? lead.certificacoes
    : lead.certificacoes
      ? [lead.certificacoes]
      : []

  const docFiles = Array.isArray(lead.documentacao_adicional)
    ? lead.documentacao_adicional
    : lead.documentacao_adicional
      ? [lead.documentacao_adicional]
      : []

  const allFiles = [
    ...contratoFiles.map((f) => ({ group: 'contrato_social', filename: f })),
    ...certFiles.map((f) => ({ group: 'certificacoes', filename: f })),
    ...docFiles.map((f) => ({ group: 'documentacao_adicional', filename: f })),
  ]

  if (allFiles.length === 0) {
    throw new Error('Este dossiê não possui nenhum documento ou anexo registrado.')
  }

  const zipEntries: ZipEntry[] = []

  for (let i = 0; i < allFiles.length; i++) {
    const item = allFiles[i]
    onProgress?.(`Baixando anexo ${i + 1} de ${allFiles.length}: ${item.filename}...`)
    const fileUrl = getAuthenticatedFileUrl(lead, item.filename)
    try {
      const headers: Record<string, string> = {}
      if (pb.authStore.token) {
        headers.Authorization = pb.authStore.token
      }
      const res = await fetch(fileUrl, { headers })
      if (!res.ok) {
        console.warn(`Falha ao baixar "${item.filename}" (HTTP ${res.status})`)
        continue
      }
      const arrayBuffer = await res.arrayBuffer()
      // Prefixo por pasta para manter organizado: contrato_social/arquivo.pdf
      const zipPath = `${item.group}/${item.filename}`
      zipEntries.push({
        filename: zipPath,
        data: new Uint8Array(arrayBuffer),
      })
    } catch (err) {
      console.warn(`Erro no download de "${item.filename}":`, err)
    }
  }

  if (zipEntries.length === 0) {
    throw new Error('Nenhum anexo pôde ser baixado com sucesso do servidor.')
  }

  onProgress?.('Compactando arquivos no pacote .zip...')
  const zipBytes = createZipArchive(zipEntries)
  const zipBlob = new Blob([zipBytes.buffer as ArrayBuffer], { type: 'application/zip' })

  const cadastro = parseLeadCadastro(lead)
  const safeSector = getStandardizedSectorEnum(lead.setor_id, lead.setor)
  const safeCompany = (cadastro.empresa || 'empresa')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 30)
  const dateFormatted = new Date().toISOString().slice(0, 10)
  const zipFilename = `anexos-${safeSector}-${safeCompany}-${dateFormatted}.zip`

  triggerBrowserDownload(zipBlob, zipFilename)
  return { totalFiles: zipEntries.length, zipFilename }
}
