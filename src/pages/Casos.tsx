import { useEffect, useState } from 'react'
import { AlertCircle, Search } from 'lucide-react'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Skeleton } from '@/components/ui/skeleton'
import pb from '@/lib/pocketbase/client'

// adapta-divida: listagem sem autenticação real; F1-001-02 adiciona fluxo de registro;
//   upgrade quando autenticação da Recepção for implementada

type Caso = {
  id: string
  caso_id: string
  origem: string
  unidade: string
  etapa: string
  estado: string
  responsavel: string
  proxima_acao: string
  prazo: string
  evidencia: string
  created: string
  updated: string
}

const estadoVariant: Record<string, 'default' | 'secondary' | 'destructive' | 'outline'> = {
  ativo: 'default',
  pendente: 'secondary',
  duplicidade: 'destructive',
}

export default function Casos() {
  const [casos, setCasos] = useState<Caso[]>([])
  const [loading, setLoading] = useState(true)
  const [erro, setErro] = useState<string | null>(null)
  const [busca, setBusca] = useState('')

  useEffect(() => {
    async function carregar() {
      setLoading(true)
      setErro(null)
      try {
        const records = await pb.collection('casos').getFullList<Caso>({
          sort: 'caso_id',
        })
        setCasos(records)
      } catch (err) {
        setErro(err instanceof Error ? err.message : 'Não foi possível carregar os casos.')
      } finally {
        setLoading(false)
      }
    }
    void carregar()
  }, [])

  const casosFiltrados = busca
    ? casos.filter((c) => c.caso_id.toLowerCase().includes(busca.toLowerCase()))
    : casos

  return (
    <div className="mx-auto max-w-5xl px-5 py-8 sm:px-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold tracking-tight text-slate-950">
          Casos — Registro mínimo
        </h1>
        <p className="mt-1 text-sm text-slate-500">
          Fixture de teste com dados fictícios — F1-001-01
        </p>
      </div>

      {/* Busca por caso_id */}
      <div className="relative mb-6 max-w-sm">
        <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
        <Input
          placeholder="Buscar por caso_id..."
          value={busca}
          onChange={(e) => setBusca(e.target.value)}
          className="pl-9"
          aria-label="Buscar por caso_id"
        />
      </div>

      {/* Erro */}
      {erro && (
        <Card className="mb-6 border-red-200 bg-red-50">
          <CardContent className="flex items-center gap-3 pt-6">
            <AlertCircle className="size-5 text-red-500" />
            <p className="text-sm text-red-700">{erro}</p>
          </CardContent>
        </Card>
      )}

      {/* Loading */}
      {loading && (
        <div className="grid gap-4">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-40 w-full rounded-xl" />
          ))}
        </div>
      )}

      {/* Lista de casos */}
      {!loading && !erro && (
        <div className="grid gap-4">
          {casosFiltrados.length === 0 && (
            <Card>
              <CardContent className="pt-6 text-center text-sm text-slate-500">
                Nenhum caso encontrado.
              </CardContent>
            </Card>
          )}
          {casosFiltrados.map((caso) => (
            <Card key={caso.id}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg font-semibold">{caso.caso_id}</CardTitle>
                  <Badge variant={estadoVariant[caso.estado] ?? 'outline'}>{caso.estado}</Badge>
                </div>
              </CardHeader>
              <CardContent>
                <dl className="grid grid-cols-1 gap-x-6 gap-y-3 sm:grid-cols-2">
                  <div>
                    <dt className="text-xs font-medium uppercase tracking-wide text-slate-400">
                      Origem
                    </dt>
                    <dd className="text-sm text-slate-700">{caso.origem}</dd>
                  </div>
                  <div>
                    <dt className="text-xs font-medium uppercase tracking-wide text-slate-400">
                      Unidade
                    </dt>
                    <dd className="text-sm text-slate-700">
                      {caso.unidade || <span className="text-red-500">Não informada</span>}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-xs font-medium uppercase tracking-wide text-slate-400">
                      Etapa
                    </dt>
                    <dd className="text-sm text-slate-700">{caso.etapa}</dd>
                  </div>
                  <div>
                    <dt className="text-xs font-medium uppercase tracking-wide text-slate-400">
                      Responsável
                    </dt>
                    <dd className="text-sm text-slate-700">{caso.responsavel}</dd>
                  </div>
                  <div className="sm:col-span-2">
                    <dt className="text-xs font-medium uppercase tracking-wide text-slate-400">
                      Próxima ação
                    </dt>
                    <dd className="text-sm text-slate-700">{caso.proxima_acao}</dd>
                  </div>
                  <div>
                    <dt className="text-xs font-medium uppercase tracking-wide text-slate-400">
                      Prazo
                    </dt>
                    <dd className="text-sm text-slate-700">
                      {caso.prazo ? new Date(caso.prazo).toLocaleDateString('pt-BR') : '—'}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-xs font-medium uppercase tracking-wide text-slate-400">
                      Evidência
                    </dt>
                    <dd className="text-sm text-slate-700">{caso.evidencia || '—'}</dd>
                  </div>
                </dl>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <div className="mt-8">
        <Button variant="outline" asChild>
          <a href="/">Voltar ao início</a>
        </Button>
      </div>
    </div>
  )
}
