migrate(
  (app) => {
    const leads = app.findCollectionByNameOrId('leads')
    leads.fields.addAt(
      leads.fields.length,
      new Field({
        name: 'documentos_pendentes',
        type: 'bool',
        required: false,
      }),
    )
    leads.fields.addAt(
      leads.fields.length,
      new Field({
        name: 'documentos_opcao',
        type: 'text',
        required: false,
      }),
    )
    app.save(leads)
  },
  (app) => {
    try {
      const leads = app.findCollectionByNameOrId('leads')
      leads.fields.removeByName('documentos_pendentes')
      leads.fields.removeByName('documentos_opcao')
      app.save(leads)
    } catch (_) {}
  },
)
