import { useState, useEffect, useCallback, useRef } from 'react'
import pb from '@/lib/pocketbase/client'
import type { RecordModel } from 'pocketbase'
import { isAuthError } from '@/lib/pocketbase/errors'

export function useAuth() {
  const [user, setUser] = useState<RecordModel | null>(pb.authStore.record)
  const [isValid, setIsValid] = useState<boolean>(pb.authStore.isValid)
  const [isValidating, setIsValidating] = useState<boolean>(() => pb.authStore.isValid)
  const validatingRef = useRef(false)

  const logout = useCallback(() => {
    pb.authStore.clear()
    setUser(null)
    setIsValid(false)
    setIsValidating(false)
  }, [])

  // Valida a sessão contra o servidor via authRefresh
  const validateSession = useCallback(async (): Promise<boolean> => {
    if (!pb.authStore.isValid || !pb.authStore.token) {
      logout()
      return false
    }

    if (validatingRef.current) return isValid

    validatingRef.current = true
    setIsValidating(true)

    try {
      // Faz uma checagem real com o servidor usando authRefresh
      const authData = await pb.collection('users').authRefresh()
      setUser(authData.record)
      setIsValid(true)
      return true
    } catch (err: unknown) {
      if (isAuthError(err)) {
        console.warn('Sessão expirada ou inválida. Limpando credenciais locais...')
        logout()
      } else {
        // Se foi erro de rede temporário, mantemos o estado atual do authStore mas encerramos a validação
        console.error('Falha ao validar sessão:', err)
      }
      return false
    } finally {
      validatingRef.current = false
      setIsValidating(false)
    }
  }, [isValid, logout])

  useEffect(() => {
    // Sincroniza quando o authStore mudar por qualquer razão
    const unsubscribe = pb.authStore.onChange((_token, model) => {
      setUser(model)
      setIsValid(pb.authStore.isValid)
    })

    // Ao montar, se o authStore tiver token, valida contra o servidor
    if (pb.authStore.isValid) {
      validateSession()
    } else {
      setIsValidating(false)
    }

    return () => {
      unsubscribe()
    }
  }, [validateSession])

  return {
    user,
    isValid,
    isValidating,
    logout,
    validateSession,
  }
}
