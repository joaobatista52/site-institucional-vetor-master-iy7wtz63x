import { Component, type ErrorInfo, type ReactNode } from 'react'
import { AlertTriangle, ArrowLeft, RefreshCw } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface Props {
  children: ReactNode
  fallbackTitle?: string
}

interface State {
  hasError: boolean
  error: Error | null
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  }

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary capturou erro no componente:', error, errorInfo)
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: null })
    window.location.reload()
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-[60vh] flex items-center justify-center p-4">
          <div className="max-w-xl w-full p-6 sm:p-8 rounded-2xl bg-white border border-amber-200 shadow-xl text-center space-y-4">
            <div className="w-14 h-14 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mx-auto border border-amber-200">
              <AlertTriangle className="w-7 h-7" />
            </div>

            <div className="space-y-2">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
                {this.props.fallbackTitle || 'Houve uma instabilidade no carregamento'}
              </h2>
              <p className="text-sm text-gray-600 leading-relaxed">
                Não se preocupe: suas respostas do questionário são salvas automaticamente em seu
                navegador como rascunho seguro.
              </p>
              {this.state.error?.message && (
                <div className="p-3 bg-red-50 text-red-800 rounded-lg text-xs font-mono text-left overflow-auto max-h-32 border border-red-200">
                  {this.state.error.message}
                </div>
              )}
            </div>

            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => (window.location.href = '/setores')}
                className="w-full sm:w-auto"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Voltar aos setores
              </Button>
              <Button
                type="button"
                className="w-full sm:w-auto bg-[#0066CC] hover:bg-[#0052A3] text-white"
                onClick={this.handleReset}
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Recarregar e recuperar rascunho
              </Button>
            </div>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}
