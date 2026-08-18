import { ClientResponseError } from 'pocketbase'

export type FieldErrors = Record<string, string>

export function extractFieldErrors(error: unknown): FieldErrors {
  const response =
    error && typeof error === 'object' && 'response' in error
      ? (error as { response?: unknown }).response
      : undefined
  const data =
    response && typeof response === 'object' && 'data' in response
      ? (response as { data?: unknown }).data
      : undefined
  if (!data || typeof data !== 'object') return {}
  const errors: FieldErrors = {}
  for (const [field, detail] of Object.entries(data)) {
    if (
      detail &&
      typeof detail === 'object' &&
      'message' in detail &&
      typeof (detail as { message: unknown }).message === 'string'
    ) {
      const message = (detail as { message: string }).message
      const code =
        'code' in detail && typeof (detail as { code: unknown }).code === 'string'
          ? (detail as { code: string }).code
          : ''
      errors[field] =
        field === 'caso_id' &&
        (code === 'validation_not_unique' || message === 'Value must be unique.')
          ? 'Já existe um caso com este ID. Use outro caso_id ou consulte o registro existente.'
          : message
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
