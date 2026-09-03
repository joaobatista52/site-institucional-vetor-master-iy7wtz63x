migrate(
  (app) => {
    const users = app.findCollectionByNameOrId('users')
    // Apenas admin/auth pode criar novas contas se fechado, mas deixamos createRule null (apenas superuser/admin) ou fechado
    users.createRule = null
    app.save(users)

    const leads = app.findCollectionByNameOrId('leads')

    // Garantir created e updated como autodate se ainda não existirem
    if (!leads.fields.getByName('created')) {
      leads.fields.add(
        new AutodateField({
          name: 'created',
          onCreate: true,
          onUpdate: false,
        }),
      )
    }

    if (!leads.fields.getByName('updated')) {
      leads.fields.add(
        new AutodateField({
          name: 'updated',
          onCreate: true,
          onUpdate: true,
        }),
      )
    }

    // Regras de acesso dos leads:
    // createRule: público ("") para que o questionário público continue enviando leads normalmente
    // listRule e viewRule: protegidos para usuários autenticados ("@request.auth.id != ''")
    // updateRule: usuários autenticados para alterar status ("@request.auth.id != ''")
    // deleteRule: usuários autenticados ("@request.auth.id != ''")
    leads.listRule = "@request.auth.id != ''"
    leads.viewRule = "@request.auth.id != ''"
    leads.createRule = ''
    leads.updateRule = "@request.auth.id != ''"
    leads.deleteRule = "@request.auth.id != ''"

    app.save(leads)
  },
  (app) => {
    try {
      const leads = app.findCollectionByNameOrId('leads')
      leads.listRule = ''
      leads.viewRule = ''
      leads.updateRule = ''
      app.save(leads)

      const users = app.findCollectionByNameOrId('users')
      users.createRule = ''
      app.save(users)
    } catch (_) {}
  },
)
