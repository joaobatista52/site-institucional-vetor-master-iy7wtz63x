import { ClientResponseError } from 'pocketbase'

export type FieldErrors = Record<string, string>

export function isAuthError(error: unknown): boolean {
  if (error instanceof ClientResponseError) {
    if (error.status === 401 || error.status === 403) return true
    if (error.status === 400) {
      const msg = (error.message || '').toLowerCase()
      const respMsg = (error.response?.message || '').toLowerCase()
      if (
        msg.includes('auth') ||
        msg.includes('token') ||
        msg.includes('record not found') ||
        respMsg.includes('auth') ||
        respMsg.includes('token') ||
        respMsg.includes('failed to authenticate') ||
        respMsg.includes('something went wrong while processing your request')
      ) {
        return true
      }
    }
    return false
  }
  if (error && typeof error === 'object') {
    const status =
      (error as { status?: unknown; statusCode?: unknown }).status ??
      (error as { statusCode?: unknown }).statusCode
    if (status === 401 || status === 403) return true
    const msg = String((error as { message?: unknown }).message || '').toLowerCase()
    if (
      msg.includes('unauthorized') ||
      msg.includes('forbidden') ||
      msg.includes('invalid token') ||
      msg.includes('token expired') ||
      msg.includes('failed to authenticate')
    ) {
      return true
    }
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
