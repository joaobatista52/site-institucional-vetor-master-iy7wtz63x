migrate(
  (app) => {
    const leads = app.findCollectionByNameOrId('leads')
    const field = leads.fields.getByName('autorizacao_devolutiva')
    if (field) {
      field.values = ['Sim, autorizo', 'Não autorizo', 'Sim', 'Não']
      app.save(leads)
    }
  },
  (app) => {
    try {
      const leads = app.findCollectionByNameOrId('leads')
      const field = leads.fields.getByName('autorizacao_devolutiva')
      if (field) {
        field.values = ['Sim, autorizo', 'Não autorizo']
        app.save(leads)
      }
    } catch (_) {}
  },
)
