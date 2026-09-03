import React, { useState } from 'react'
import pb from '@/lib/pocketbase/client'
import { getErrorMessage } from '@/lib/pocketbase/errors'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Lock, Mail, Loader2, AlertCircle, ShieldCheck } from 'lucide-react'

interface LeadsLoginProps {
  onSuccess: () => void
}

export function LeadsLogin({ onSuccess }: LeadsLoginProps) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      await pb.collection('users').authWithPassword(email.trim(), password)
      onSuccess()
    } catch (err) {
      setError(getErrorMessage(err) || 'Credenciais inválidas. Verifique seu e-mail e senha.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-[75vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <Card className="w-full max-w-md shadow-xl border-[#0066CC]/20 bg-white">
        <CardHeader className="text-center space-y-2 pb-6">
          <div className="mx-auto w-12 h-12 rounded-full bg-[#EAF3FD] flex items-center justify-center text-[#0066CC]">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <CardTitle className="text-2xl font-bold text-[#333333]">
            Área Interna · Dossiês
          </CardTitle>
          <CardDescription className="text-sm text-gray-600">
            Acesso restrito para consulta dos dossiês estratégicos e leads recebidos pelo VETOR
            MASTER.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {error && (
            <div
              className="mb-5 p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm flex items-start gap-2"
              role="alert"
            >
              <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="login-email">E-mail institucional</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                <Input
                  id="login-email"
                  type="email"
                  required
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="ex: joao.batista@qgassist.com.br"
                  className="pl-10 h-10 border-gray-300 focus:border-[#0066CC] focus:ring-[#0066CC]"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="login-password">Senha de acesso</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                <Input
                  id="login-password"
                  type="password"
                  required
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="pl-10 h-10 border-gray-300 focus:border-[#0066CC] focus:ring-[#0066CC]"
                />
              </div>
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full h-11 bg-[#0066CC] hover:bg-[#0052a3] text-white font-semibold transition-colors mt-2"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Autenticando…
                </>
              ) : (
                'Entrar no Painel'
              )}
            </Button>
          </form>

          <div className="mt-6 pt-4 border-t border-gray-100 text-center">
            <p className="text-xs text-gray-500">
              VETOR MASTER — Inteligência Executiva Determinística. Acesso restrito a
              administradores.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
export default LeadsLogin
