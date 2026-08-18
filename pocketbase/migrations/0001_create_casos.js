migrate(
  (app) => {
    const collection = new Collection({
      name: 'casos',
      type: 'base',
      listRule: "@request.auth.id != ''",
      viewRule: "@request.auth.id != ''",
      createRule: "@request.auth.id != ''",
      updateRule: "@request.auth.id != ''",
      deleteRule: "@request.auth.id != ''",
      fields: [
        { name: 'caso_id', type: 'text', required: true },
        { name: 'origem', type: 'text', required: true },
        { name: 'unidade', type: 'text', required: false },
        { name: 'etapa', type: 'text', required: true },
        { name: 'estado', type: 'text', required: true },
        { name: 'responsavel', type: 'text', required: true },
        { name: 'proxima_acao', type: 'text', required: true },
        { name: 'prazo', type: 'date', required: false },
        { name: 'evidencia', type: 'text', required: false },
        { name: 'created', type: 'autodate', onCreate: true, onUpdate: false },
        { name: 'updated', type: 'autodate', onCreate: true, onUpdate: true },
      ],
      indexes: ['CREATE UNIQUE INDEX idx_casos_caso_id ON casos (caso_id)'],
    })
    app.save(collection)
  },
  (app) => {
    const collection = app.findCollectionByNameOrId('casos')
    app.delete(collection)
  },
)
