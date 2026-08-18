// Liberar createRule público para a fase de fixture/teste (F1-001-02).
// listRule e viewRule já são públicos desde 0003.
// adapta-divida: createRule público para registro sem autenticação;
//   upgrade quando autenticação da Recepção for implementada
migrate(
  (app) => {
    const col = app.findCollectionByNameOrId('casos')
    col.createRule = ''
    app.save(col)
  },
  (app) => {
    const col = app.findCollectionByNameOrId('casos')
    col.createRule = "@request.auth.id != ''"
    app.save(col)
  },
)
