// Fixture F1-001-01 — três casos fictícios para teste do contrato mínimo.
// Dados inteiramente fictícios: nenhum nome, telefone ou dado real.
// C-001: caso completo (todos os campos)
// C-002: caso sem unidade (exercitar pendência — CA-F1-002)
// C-003: caso com caso_id duplicado de C-001 (exercitar duplicidade — CA-F1-003)
migrate(
  (app) => {
    const col = app.findCollectionByNameOrId('casos')

    // C-001 — caso completo
    try {
      app.findFirstRecordByData('casos', 'caso_id', 'C-001')
    } catch (_) {
      const c001 = new Record(col)
      c001.set('caso_id', 'C-001')
      c001.set('origem', 'WhatsApp')
      c001.set('unidade', 'Unidade Norte')
      c001.set('etapa', 'triagem')
      c001.set('estado', 'ativo')
      c001.set('responsavel', 'Recepção A')
      c001.set('proxima_acao', 'Confirmar agendamento com paciente')
      c001.set('prazo', '2026-08-20')
      c001.set('evidencia', 'Print da conversa no WhatsApp arquivado')
      app.save(c001)
    }

    // C-002 — caso sem unidade (gera pendência)
    try {
      app.findFirstRecordByData('casos', 'caso_id', 'C-002')
    } catch (_) {
      const c002 = new Record(col)
      c002.set('caso_id', 'C-002')
      c002.set('origem', 'Telefone')
      c002.set('unidade', '')
      c002.set('etapa', 'entrada')
      c002.set('estado', 'pendente')
      c002.set('responsavel', 'Recepção B')
      c002.set('proxima_acao', 'Identificar unidade de atendimento')
      c002.set('prazo', '2026-08-19')
      c002.set('evidencia', 'Anotação manual de ligação telefônica')
      app.save(c002)
    }

    // C-003 — caso com caso_id duplicado de C-001 (sinaliza duplicidade)
    // adapta-divida: seed simula duplicidade via campo separado; integração real
    //   deve rejeitar inserção por constraint UNIQUE no PocketBase;
    //   upgrade quando task F1-001-03 exercitar via API
    try {
      app.findFirstRecordByData('casos', 'caso_id', 'C-001-dup')
    } catch (_) {
      const c003 = new Record(col)
      c003.set('caso_id', 'C-001-dup')
      c003.set('origem', 'WhatsApp')
      c003.set('unidade', 'Unidade Norte')
      c003.set('etapa', 'triagem')
      c003.set('estado', 'duplicidade')
      c003.set('responsavel', 'Recepção A')
      c003.set('proxima_acao', 'Confirmar se é o mesmo caso de C-001')
      c003.set('prazo', '2026-08-20')
      c003.set('evidencia', 'Segunda entrada com mesmo contexto do C-001')
      app.save(c003)
    }
  },
  (app) => {
    try {
      app.delete(app.findFirstRecordByData('casos', 'caso_id', 'C-001'))
    } catch (_) {}
    try {
      app.delete(app.findFirstRecordByData('casos', 'caso_id', 'C-002'))
    } catch (_) {}
    try {
      app.delete(app.findFirstRecordByData('casos', 'caso_id', 'C-001-dup'))
    } catch (_) {}
  },
)
