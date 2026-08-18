import { ArrowLeft, LockKeyhole } from 'lucide-react'
import { Link } from 'react-router-dom'

import { Button } from '@/components/ui/button'

export default function Entrar() {
  return (
    <section className="relative flex flex-1 items-center justify-center overflow-hidden bg-slate-50 px-5 py-20 sm:px-8">
      <div className="absolute left-1/2 top-0 h-72 w-72 -translate-x-1/2 rounded-full bg-indigo-200/40 blur-3xl" />
      <div className="relative w-full max-w-md rounded-3xl border border-slate-200 bg-white p-7 text-center shadow-xl shadow-slate-950/[0.06] sm:p-10">
        <span className="mx-auto grid size-12 place-items-center rounded-2xl bg-indigo-50 text-indigo-500 ring-1 ring-indigo-100">
          <LockKeyhole className="size-5" />
        </span>
        <p className="mt-6 text-xs font-semibold uppercase tracking-[0.16em] text-indigo-500">
          Em breve
        </p>
        <h1 className="mt-3 text-3xl font-extrabold tracking-tight text-slate-950">
          Área de acesso
        </h1>
        <p className="mt-4 text-sm leading-6 text-slate-500">
          Este projeto começa intencionalmente em branco. O fluxo de autenticação está pronto para
          ser construído quando você precisar.
        </p>
        <Button
          asChild
          variant="outline"
          className="mt-8 w-full font-semibold transition-all hover:-translate-y-0.5 active:scale-[0.98]"
        >
          <Link to="/">
            <ArrowLeft className="mr-2 size-4" />
            Voltar ao início
          </Link>
        </Button>
      </div>
    </section>
  )
}
