import { ClientResponseError } from 'pocketbase'

export type FieldErrors = Record<string, string>

export function isAuthError(error: unknown): boolean {
  if (error instanceof ClientResponseError) {
    return error.status === 401 || error.status === 403
  }
  return false
}

export function extractFieldErrors(error: unknown): FieldErrors {
  if (!(error instanceof ClientResponseError)) return {}
  const data = error.response?.data
  if (!data || typeof data !== 'object') return {}
  const errors: FieldErrors = {}
  for (const [field, detail] of Object.entries(data)) {
    if (
      detail &&
      typeof detail === 'object' &&
      'message' in detail &&
      typeof (detail as { message: unknown }).message === 'string'
    ) {
      errors[field] = (detail as { message: string }).message
    }
  }
  return errors
}

export function getErrorMessage(error: unknown): string {
  if (!error) return 'Ocorreu um erro inesperado ao processar a solicitação.'

  if (!(error instanceof ClientResponseError)) {
    if (error instanceof Error) {
      if (error.message.toLowerCase().includes('something went wrong')) {
        return 'Falha ao conectar com o servidor. Verifique sua conexão e tente novamente.'
      }
      return error.message
    }
    return 'Ocorreu um erro inesperado ao processar a solicitação.'
  }

  // Se for erro do PocketBase (ClientResponseError)
  const fieldErrors = extractFieldErrors(error)
  const fieldEntries = Object.entries(fieldErrors)

  if (fieldEntries.length > 0) {
    const fieldTranslations: Record<string, string> = {
      contrato_social: 'Contrato Social',
      certificacoes: 'Comprovantes de Certificações',
      documentacao_adicional: 'Documentação Adicional',
      setor: 'Setor',
      setor_id: 'Identificador do Setor',
      cadastro: 'Dados de Cadastro',
      respostas: 'Respostas do Questionário',
      autorizacao_devolutiva: 'Autorização de Devolutiva',
      formato_interesse: 'Formato de Interesse',
      responsavel_documentos: 'Responsável pelos Documentos',
      status: 'Status',
    }

    const messages = fieldEntries.map(([field, msg]) => {
      const translated = fieldTranslations[field] || field
      return `${translated}: ${msg}`
    })
    return `Não foi possível enviar: ${messages.join(' · ')}`
  }

  const rawMsg = (error.message || '').trim()
  if (!rawMsg || rawMsg.toLowerCase().includes('something went wrong')) {
    if (error.status === 400) {
      return 'Dados incompletos ou arquivo em formato/tamanho não suportado (máx. 100 MB por arquivo). Verifique os campos e tente novamente.'
    }
    if (error.status === 413) {
      return 'Os arquivos anexados excederam o limite permitido (máximo de 100 MB por arquivo).'
    }
    if (error.status === 0) {
      return 'Falha de comunicação de rede ao enviar os dados e arquivos. Verifique sua conexão e tente novamente.'
    }
    return `Falha no processamento (código ${error.status || 'desconhecido'}). Por favor, tente novamente.`
  }

  return rawMsg
}
