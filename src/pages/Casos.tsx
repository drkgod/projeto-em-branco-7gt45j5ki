import { useEffect, useState } from 'react'
import { AlertCircle, Plus, Search, X } from 'lucide-react'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Skeleton } from '@/components/ui/skeleton'
import pb from '@/lib/pocketbase/client'
import { extractFieldErrors, getErrorMessage } from '@/lib/pocketbase/errors'

// adapta-divida: formulário sem autenticação real; cria registros sem login;
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

type FormState = {
  caso_id: string
  origem: string
  unidade: string
  etapa: string
  estado: string
  responsavel: string
  proxima_acao: string
  prazo: string
  evidencia: string
}

const initialForm: FormState = {
  caso_id: '',
  origem: '',
  unidade: '',
  etapa: '',
  estado: '',
  responsavel: '',
  proxima_acao: '',
  prazo: '',
  evidencia: '',
}

const estadoVariant: Record<string, 'default' | 'secondary' | 'destructive' | 'outline'> = {
  ativo: 'default',
  pendente: 'secondary',
  duplicidade: 'destructive',
}

const estadoOptions = ['ativo', 'pendente', 'duplicidade']
const etapaOptions = ['entrada', 'triagem', 'agendamento', 'atendimento', 'concluido']
const origemOptions = ['WhatsApp', 'Telefone', 'Presencial', 'Indicação']

export default function Casos() {
  const [casos, setCasos] = useState<Caso[]>([])
  const [loading, setLoading] = useState(true)
  const [erro, setErro] = useState<string | null>(null)
  const [busca, setBusca] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState<FormState>(initialForm)
  const [formErrors, setFormErrors] = useState<Record<string, string>>({})
  const [formSubmitError, setFormSubmitError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    carregar()
  }, [])

  async function carregar() {
    setLoading(true)
    setErro(null)
    try {
      const records = await pb.collection('casos').getFullList<Caso>({
        sort: 'caso_id',
      })
      setCasos(records)
    } catch (err) {
      setErro(getErrorMessage(err))
    } finally {
      setLoading(false)
    }
  }

  const casosFiltrados = busca
    ? casos.filter((c) => c.caso_id.toLowerCase().includes(busca.toLowerCase()))
    : casos

  function handleFieldChange(field: keyof FormState, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }))
    if (formErrors[field]) {
      setFormErrors((prev) => {
        const next = { ...prev }
        delete next[field]
        return next
      })
    }
  }

  function validateForm(): boolean {
    const errors: Record<string, string> = {}
    if (!form.caso_id.trim()) errors.caso_id = 'Informe o ID do caso'
    if (!form.origem) errors.origem = 'Selecione a origem'
    if (!form.etapa) errors.etapa = 'Selecione a etapa'
    if (!form.estado) errors.estado = 'Selecione o estado'
    if (!form.responsavel.trim()) errors.responsavel = 'Informe o responsável'
    if (!form.proxima_acao.trim()) errors.proxima_acao = 'Informe a próxima ação'
    setFormErrors(errors)
    return Object.keys(errors).length === 0
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setFormSubmitError(null)

    if (!validateForm()) return

    setSubmitting(true)
    try {
      const data = {
        caso_id: form.caso_id.trim(),
        origem: form.origem,
        unidade: form.unidade.trim(),
        etapa: form.etapa,
        estado: form.estado,
        responsavel: form.responsavel.trim(),
        proxima_acao: form.proxima_acao.trim(),
        prazo: form.prazo || undefined,
        evidencia: form.evidencia.trim(),
      }
      await pb.collection('casos').create(data)
      setForm(initialForm)
      setShowForm(false)
      await carregar()
    } catch (err) {
      const fieldErrors = extractFieldErrors(err)
      if (Object.keys(fieldErrors).length > 0) {
        setFormErrors(fieldErrors)
        setFormSubmitError(null)
      } else {
        setFormSubmitError(getErrorMessage(err))
      }
    } finally {
      setSubmitting(false)
    }
  }

  function handleCancel() {
    setForm(initialForm)
    setFormErrors({})
    setFormSubmitError(null)
    setShowForm(false)
  }

  return (
    <div className="mx-auto max-w-5xl px-5 py-8 sm:px-8">
      <div className="mb-8 flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-950">
            Casos — Registro mínimo
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Fixture de teste com dados fictícios — F1-001
          </p>
        </div>
        {!showForm && (
          <Button onClick={() => setShowForm(true)} size="sm">
            <Plus className="mr-1.5 size-4" />
            Novo caso
          </Button>
        )}
      </div>

      {/* Formulário de registro */}
      {showForm && (
        <Card className="mb-6">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">Registrar novo caso</CardTitle>
              <Button
                variant="ghost"
                size="icon"
                onClick={handleCancel}
                aria-label="Fechar formulário"
              >
                <X className="size-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <form
              onSubmit={handleSubmit}
              className="grid grid-cols-1 gap-4 sm:grid-cols-2"
              noValidate
            >
              {/* caso_id */}
              <div className="space-y-1.5">
                <Label htmlFor="caso_id">ID do caso *</Label>
                <Input
                  id="caso_id"
                  value={form.caso_id}
                  onChange={(e) => handleFieldChange('caso_id', e.target.value)}
                  aria-invalid={!!formErrors.caso_id}
                  aria-describedby={formErrors.caso_id ? 'caso_id-error' : undefined}
                  placeholder="Ex: C-004"
                />
                {formErrors.caso_id && (
                  <p id="caso_id-error" className="text-xs text-red-500" role="alert">
                    {formErrors.caso_id}
                  </p>
                )}
              </div>

              {/* origem */}
              <div className="space-y-1.5">
                <Label htmlFor="origem">Origem *</Label>
                <Select value={form.origem} onValueChange={(v) => handleFieldChange('origem', v)}>
                  <SelectTrigger id="origem" aria-invalid={!!formErrors.origem}>
                    <SelectValue placeholder="Selecione..." />
                  </SelectTrigger>
                  <SelectContent>
                    {origemOptions.map((o) => (
                      <SelectItem key={o} value={o}>
                        {o}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {formErrors.origem && (
                  <p className="text-xs text-red-500" role="alert">
                    {formErrors.origem}
                  </p>
                )}
              </div>

              {/* unidade */}
              <div className="space-y-1.5">
                <Label htmlFor="unidade">Unidade</Label>
                <Input
                  id="unidade"
                  value={form.unidade}
                  onChange={(e) => handleFieldChange('unidade', e.target.value)}
                  placeholder="Opcional"
                />
              </div>

              {/* etapa */}
              <div className="space-y-1.5">
                <Label htmlFor="etapa">Etapa *</Label>
                <Select value={form.etapa} onValueChange={(v) => handleFieldChange('etapa', v)}>
                  <SelectTrigger id="etapa" aria-invalid={!!formErrors.etapa}>
                    <SelectValue placeholder="Selecione..." />
                  </SelectTrigger>
                  <SelectContent>
                    {etapaOptions.map((t) => (
                      <SelectItem key={t} value={t}>
                        {t}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {formErrors.etapa && (
                  <p className="text-xs text-red-500" role="alert">
                    {formErrors.etapa}
                  </p>
                )}
              </div>

              {/* estado */}
              <div className="space-y-1.5">
                <Label htmlFor="estado">Estado *</Label>
                <Select value={form.estado} onValueChange={(v) => handleFieldChange('estado', v)}>
                  <SelectTrigger id="estado" aria-invalid={!!formErrors.estado}>
                    <SelectValue placeholder="Selecione..." />
                  </SelectTrigger>
                  <SelectContent>
                    {estadoOptions.map((s) => (
                      <SelectItem key={s} value={s}>
                        {s}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {formErrors.estado && (
                  <p className="text-xs text-red-500" role="alert">
                    {formErrors.estado}
                  </p>
                )}
              </div>

              {/* responsavel */}
              <div className="space-y-1.5">
                <Label htmlFor="responsavel">Responsável *</Label>
                <Input
                  id="responsavel"
                  value={form.responsavel}
                  onChange={(e) => handleFieldChange('responsavel', e.target.value)}
                  aria-invalid={!!formErrors.responsavel}
                  placeholder="Ex: Recepção A"
                />
                {formErrors.responsavel && (
                  <p className="text-xs text-red-500" role="alert">
                    {formErrors.responsavel}
                  </p>
                )}
              </div>

              {/* proxima_acao */}
              <div className="space-y-1.5 sm:col-span-2">
                <Label htmlFor="proxima_acao">Próxima ação *</Label>
                <Input
                  id="proxima_acao"
                  value={form.proxima_acao}
                  onChange={(e) => handleFieldChange('proxima_acao', e.target.value)}
                  aria-invalid={!!formErrors.proxima_acao}
                  placeholder="Ex: Confirmar agendamento"
                />
                {formErrors.proxima_acao && (
                  <p className="text-xs text-red-500" role="alert">
                    {formErrors.proxima_acao}
                  </p>
                )}
              </div>

              {/* prazo */}
              <div className="space-y-1.5">
                <Label htmlFor="prazo">Prazo</Label>
                <Input
                  id="prazo"
                  type="date"
                  value={form.prazo}
                  onChange={(e) => handleFieldChange('prazo', e.target.value)}
                />
              </div>

              {/* evidencia */}
              <div className="space-y-1.5">
                <Label htmlFor="evidencia">Evidência</Label>
                <Input
                  id="evidencia"
                  value={form.evidencia}
                  onChange={(e) => handleFieldChange('evidencia', e.target.value)}
                  placeholder="Opcional"
                />
              </div>

              {/* Erro de submit */}
              {formSubmitError && (
                <div className="sm:col-span-2 flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 px-3 py-2">
                  <AlertCircle className="size-4 text-red-500" />
                  <p className="text-sm text-red-700">{formSubmitError}</p>
                </div>
              )}

              {/* Botões */}
              <div className="sm:col-span-2 flex gap-3 pt-2">
                <Button type="submit" disabled={submitting}>
                  {submitting ? 'Salvando...' : 'Salvar caso'}
                </Button>
                <Button type="button" variant="outline" onClick={handleCancel}>
                  Cancelar
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

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

      {/* Erro de carregamento */}
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
