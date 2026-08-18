// Ajustar regras de acesso da collection casos para permitir leitura pública
// durante a fase de fixture (F1-001). A criação/atualização/exclusão continuam
// exigindo autenticação.
// adapta-divida: listRule/viewRule públicos para fixture de teste;
//   upgrade quando autenticação da Recepção for implementada (F1-001-02+)
migrate(
  (app) => {
    const col = app.findCollectionByNameOrId('casos')
    col.listRule = ''
    col.viewRule = ''
    app.save(col)
  },
  (app) => {
    const col = app.findCollectionByNameOrId('casos')
    col.listRule = "@request.auth.id != ''"
    col.viewRule = "@request.auth.id != ''"
    app.save(col)
  },
)
