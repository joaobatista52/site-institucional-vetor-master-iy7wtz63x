migrate(
  (app) => {
    const collection = app.findCollectionByNameOrId('leads')
    collection.updateRule = ''
    app.save(collection)
  },
  (app) => {
    try {
      const collection = app.findCollectionByNameOrId('leads')
      collection.updateRule = null
      app.save(collection)
    } catch (_) {}
  },
)
