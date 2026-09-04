import { ClientResponseError } from 'pocketbase'

export type FieldErrors = Record<string, string>

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
    } else if (typeof detail === 'string') {
      errors[field] = detail
    }
  }
  return errors
}

export function getErrorMessage(error: unknown): string {
  if (!(error instanceof ClientResponseError)) {
    return error instanceof Error ? error.message : 'Ocorreu um erro inesperado.'
  }
  const fieldErrors = extractFieldErrors(error)
  const entries = Object.entries(fieldErrors)
  if (entries.length > 0) {
    return entries.map(([field, msg]) => `${field}: ${msg}`).join(' | ')
  }
  if (error.response?.message) {
    return error.response.message
  }
  return error.message || 'Ocorreu um erro inesperado ao salvar os dados.'
}
