import { ClientResponseError } from 'pocketbase'

export type FieldErrors = Record<string, string>

export interface ServerErrorPayload {
  field?: string
  reason?: string
  message?: string
  filledCount?: number
  requiredCount?: number
  setorId?: string
  sectorPrefix?: string
  missingKeys?: string[]
  [key: string]: unknown
}

export function extractServerErrorData(error: unknown): ServerErrorPayload | null {
  if (!(error instanceof ClientResponseError)) return null
  const data = error.response?.data
  if (!data || typeof data !== 'object') return null
  return data as ServerErrorPayload
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

export function isAuthError(error: unknown): boolean {
  if (error instanceof ClientResponseError) {
    return error.status === 401 || error.status === 403
  }
  return false
}

export function getErrorMessage(error: unknown): string {
  if (!(error instanceof ClientResponseError)) {
    return error instanceof Error ? error.message : 'Ocorreu um erro inesperado.'
  }
  if (error.response?.message) return error.response.message
  const msgs = Object.values(extractFieldErrors(error))
  return msgs.length > 0 ? msgs.join(' ') : error.message || 'Ocorreu um erro inesperado.'
}
