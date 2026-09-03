import { useState, useEffect } from 'react'
import pb from '@/lib/pocketbase/client'
import type { RecordModel } from 'pocketbase'

export function useAuth() {
  const [user, setUser] = useState<RecordModel | null>(pb.authStore.record)
  const [isValid, setIsValid] = useState<boolean>(pb.authStore.isValid)

  useEffect(() => {
    return pb.authStore.onChange((_token, model) => {
      setUser(model)
      setIsValid(pb.authStore.isValid)
    })
  }, [])

  const logout = () => {
    pb.authStore.clear()
    setUser(null)
    setIsValid(false)
  }

  return {
    user,
    isValid,
    logout,
  }
}
