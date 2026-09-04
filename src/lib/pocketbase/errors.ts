import { ClientResponseError } from 'pocketbase'

export type FieldErrors = Record<string, string>

/**
 * Verifica se um erro retornado pelo PocketBase / fetch indica que a sessão é inválida ou expirou (401 Unauthorized ou 403 Forbidden).
 */
export function isAuthError(error: unknown): boolean {
  if (!error) return false
  if (error instanceof ClientResponseError) {
    return error.status === 401 || error.status === 403
  }
  if (typeof error === 'object' && error !== null) {
    const status = (error as { status?: unknown }).status
    if (status === 401 || status === 403) return true
    const message = (error as { message?: unknown }).message
    if (typeof message === 'string') {
      const lower = message.toLowerCase()
      if (
        lower.includes('unauthorized') ||
        lower.includes('failed to authenticate') ||
        lower.includes('token expired') ||
        lower.includes('token has expired') ||
        lower.includes('token is invalid') ||
        lower.includes('invalid auth token') ||
        lower.includes('the request requires valid user authorization')
      ) {
        return true
      }
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
    }
  }
  return errors
}

export function getErrorMessage(error: unknown): string {
  if (!(error instanceof ClientResponseError)) {
    return error instanceof Error ? error.message : 'An unexpected error occurred.'
  }
  const msgs = Object.values(extractFieldErrors(error))
  return msgs.length > 0 ? msgs.join(' ') : error.message || 'An unexpected error occurred.'
}
