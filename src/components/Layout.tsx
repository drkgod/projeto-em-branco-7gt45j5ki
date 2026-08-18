import { useEffect, useState } from 'react'
import { Link, NavLink, Outlet } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

function Wordmark() {
  return (
    <span className="inline-flex items-center gap-2.5 font-bold tracking-tight text-slate-950">
      <span className="grid size-7 place-items-center rounded-lg bg-indigo-500 shadow-sm shadow-indigo-500/25">
        <span className="size-2.5 rounded-[3px] bg-white" />
      </span>
      <span>Projeto</span>
    </span>
  )
}

export function Layout() {
  const [isScrolled, setIsScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 8)
    handleScroll()
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <div className="flex min-h-screen flex-col bg-white text-slate-950">
      <header
        className={cn(
          'sticky top-0 z-50 w-full border-b border-transparent bg-white/80 transition-all duration-200',
          isScrolled &&
            'border-slate-200/80 bg-white/85 shadow-sm shadow-slate-950/[0.03] backdrop-blur-xl',
        )}
      >
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5 sm:px-8">
          <Link
            to="/"
            aria-label="Ir para o início"
            className="rounded-lg outline-none ring-indigo-500 focus-visible:ring-2 focus-visible:ring-offset-4"
          >
            <Wordmark />
          </Link>

          <div className="flex items-center gap-6">
            <nav aria-label="Navegação principal" className="hidden sm:block">
              <NavLink
                to="/"
                className={({ isActive }) =>
                  cn(
                    'text-sm font-semibold text-slate-500 transition-colors hover:text-slate-950',
                    isActive && 'text-slate-950',
                  )
                }
              >
                Início
              </NavLink>
            </nav>
            <Button
              asChild
              variant="outline"
              size="sm"
              className="group border-slate-200 bg-white font-semibold text-slate-700 shadow-sm transition-all duration-150 hover:-translate-y-0.5 hover:border-slate-300 hover:bg-slate-50 active:scale-[0.98]"
            >
              <Link to="/entrar">
                Entrar
                <ArrowRight className="ml-1.5 size-3.5 transition-transform group-hover:translate-x-0.5" />
              </Link>
            </Button>
          </div>
        </div>
      </header>

      <main className="flex flex-1 flex-col">
        <Outlet />
      </main>

      <footer className="border-t border-slate-200 bg-white">
        <div className="mx-auto flex max-w-6xl flex-col gap-6 px-5 py-8 sm:flex-row sm:items-center sm:justify-between sm:px-8">
          <div className="space-y-2">
            <Link to="/" aria-label="Ir para o início">
              <Wordmark />
            </Link>
            <p className="text-sm text-slate-500">Projeto em branco — pronto para construir.</p>
          </div>
          <p className="text-xs font-medium uppercase tracking-[0.16em] text-slate-400">
            Rodando na Skip Cloud
          </p>
        </div>
      </footer>
    </div>
  )
}
