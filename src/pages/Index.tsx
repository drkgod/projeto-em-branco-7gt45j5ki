import { useEffect, useRef, useState } from 'react'
import {
  ArrowDown,
  Blocks,
  Check,
  ChevronRight,
  Database,
  Fingerprint,
  HeartPulse,
} from 'lucide-react'

import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

type BackendStatus = 'checking' | 'connected' | 'unavailable'

const hints = [
  { label: 'Autenticação pronta', icon: Fingerprint },
  { label: 'Banco de dados conectado', icon: Database },
  { label: 'Design system configurado', icon: Blocks },
]

function BackendStatusCard({
  status,
  highlighted,
}: {
  status: BackendStatus
  highlighted: boolean
}) {
  const isConnected = status === 'connected'
  const isChecking = status === 'checking'

  return (
    <div
      className={cn(
        'relative w-full overflow-hidden rounded-2xl border border-white/15 bg-white/[0.09] p-1 shadow-2xl shadow-slate-950/30 backdrop-blur-xl transition-all duration-500 sm:max-w-md',
        highlighted && 'scale-[1.02] border-indigo-300/80 ring-4 ring-indigo-400/20',
      )}
    >
      <div className="flex items-center gap-4 rounded-xl border border-white/10 bg-slate-950/40 px-4 py-4 sm:px-5">
        <span className="relative grid size-10 shrink-0 place-items-center rounded-xl bg-white/10 text-slate-200">
          <HeartPulse className="size-5" />
          {!isChecking && (
            <span
              className={cn(
                'absolute -right-1 -top-1 size-3 rounded-full border-2 border-slate-900',
                isConnected ? 'bg-emerald-500 status-pulse' : 'bg-red-500',
              )}
            />
          )}
        </span>
        <div className="min-w-0 flex-1 text-left">
          <p className="text-sm font-semibold text-white">
            {isChecking
              ? 'Verificando backend'
              : isConnected
                ? 'Backend conectado'
                : 'Backend indisponível'}
          </p>
          <p className="mt-0.5 truncate text-xs text-slate-400">
            {isChecking
              ? 'Estabelecendo conexão segura…'
              : isConnected
                ? 'PocketBase está respondendo normalmente'
                : 'Não foi possível concluir o health check'}
          </p>
        </div>
        {isChecking ? (
          <span
            className="size-4 animate-spin rounded-full border-2 border-white/20 border-t-indigo-400"
            aria-label="Carregando"
          />
        ) : isConnected ? (
          <Check className="size-5 text-emerald-400" aria-hidden="true" />
        ) : (
          <span className="size-2 rounded-full bg-red-500" aria-hidden="true" />
        )}
      </div>
    </div>
  )
}

export default function Index() {
  const [status, setStatus] = useState<BackendStatus>('checking')
  const [highlighted, setHighlighted] = useState(false)
  const statusRef = useRef<HTMLDivElement>(null)
  const highlightTimer = useRef<number | undefined>(undefined)

  useEffect(() => {
    const controller = new AbortController()
    const timeout = window.setTimeout(() => controller.abort(), 6000)

    async function checkBackend() {
      const baseUrl = import.meta.env.VITE_POCKETBASE_URL?.replace(/\/$/, '')
      if (!baseUrl) {
        setStatus('unavailable')
        return
      }

      try {
        const response = await fetch(`${baseUrl}/api/health`, {
          method: 'GET',
          headers: { Accept: 'application/json' },
          signal: controller.signal,
        })
        setStatus(response.ok ? 'connected' : 'unavailable')
      } catch {
        setStatus('unavailable')
      } finally {
        window.clearTimeout(timeout)
      }
    }

    void checkBackend()
    return () => {
      controller.abort()
      window.clearTimeout(timeout)
      if (highlightTimer.current) window.clearTimeout(highlightTimer.current)
    }
  }, [])

  const showBackend = () => {
    statusRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' })
    setHighlighted(true)
    if (highlightTimer.current) window.clearTimeout(highlightTimer.current)
    highlightTimer.current = window.setTimeout(() => setHighlighted(false), 1400)
  }

  return (
    <div className="bg-slate-950">
      <section className="hero-grid relative isolate min-h-[calc(100svh-4rem)] overflow-hidden px-5 py-16 sm:px-8 sm:py-24">
        <div className="absolute inset-0 -z-20 bg-slate-950" />
        <div className="hero-glow absolute inset-0 -z-10" />
        <div className="absolute left-1/2 top-0 -z-10 h-px w-[70%] -translate-x-1/2 bg-gradient-to-r from-transparent via-indigo-400/40 to-transparent" />

        <div className="mx-auto flex min-h-[calc(100svh-12rem)] max-w-5xl flex-col items-center justify-center text-center">
          <div className="fade-up fade-delay-1 inline-flex items-center gap-2 rounded-full border border-indigo-300/20 bg-indigo-400/10 px-3.5 py-1.5 text-xs font-semibold uppercase tracking-[0.15em] text-indigo-200 shadow-sm shadow-indigo-950/20 backdrop-blur-sm">
            <span className="size-1.5 rounded-full bg-indigo-400" />
            Projeto em branco
          </div>

          <h1 className="fade-up fade-delay-2 mt-7 max-w-4xl text-balance text-[clamp(2.5rem,7vw,4.75rem)] font-extrabold leading-[1.03] tracking-[-0.045em] text-white">
            Seu novo projeto
            <span className="block bg-gradient-to-r from-indigo-300 via-violet-300 to-indigo-200 bg-clip-text text-transparent">
              está pronto
            </span>
          </h1>

          <p className="fade-up fade-delay-3 mt-6 max-w-2xl text-pretty text-base leading-7 text-slate-300 sm:text-lg sm:leading-8">
            Comece a construir. A base, o visual e o backend já estão preparados para você.
          </p>

          <div className="fade-up fade-delay-4 mt-9 flex w-full flex-col items-center justify-center gap-3 sm:w-auto sm:flex-row">
            <Button
              size="lg"
              className="group w-full bg-indigo-500 px-6 font-semibold text-white shadow-lg shadow-indigo-500/25 transition-all duration-150 hover:-translate-y-0.5 hover:bg-indigo-600 hover:shadow-xl hover:shadow-indigo-500/30 active:scale-[0.98] sm:w-auto"
            >
              Começar a construir
              <ChevronRight className="ml-1.5 size-4 transition-transform group-hover:translate-x-0.5" />
            </Button>
            <Button
              size="lg"
              variant="ghost"
              onClick={showBackend}
              className="group w-full border border-white/10 bg-white/5 px-6 font-semibold text-slate-200 backdrop-blur-sm transition-all duration-150 hover:-translate-y-0.5 hover:bg-white/10 hover:text-white active:scale-[0.98] sm:w-auto"
            >
              Ver backend
              <ArrowDown className="ml-2 size-4 transition-transform group-hover:translate-y-0.5" />
            </Button>
          </div>

          <div
            ref={statusRef}
            className="fade-up fade-delay-5 mt-11 flex w-full justify-center scroll-mt-28"
            aria-live="polite"
          >
            <BackendStatusCard status={status} highlighted={highlighted} />
          </div>

          <div className="fade-up fade-delay-6 mt-8 grid w-full max-w-3xl grid-cols-1 gap-2.5 sm:grid-cols-2 lg:grid-cols-3">
            {hints.map(({ label, icon: Icon }) => (
              <div
                key={label}
                className="flex items-center justify-center gap-2 rounded-xl border border-white/[0.08] bg-white/[0.035] px-4 py-3 text-xs font-medium text-slate-400"
              >
                <Icon className="size-3.5 text-indigo-300" />
                {label}
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
