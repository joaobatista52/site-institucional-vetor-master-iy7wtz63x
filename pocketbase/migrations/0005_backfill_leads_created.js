migrate(
  (app) => {
    // Para registros que ficaram com created/updated vazios antes da adição do autodate, preencher com timestamp padrão
    const now = new Date().toISOString().replace('T', ' ').slice(0, 19) + '.000Z'
    app
      .db()
      .newQuery(`
      UPDATE leads 
      SET created = {:now} 
      WHERE created IS NULL OR created = ''
    `)
      .bind({ now })
      .execute()

    app
      .db()
      .newQuery(`
      UPDATE leads 
      SET updated = {:now} 
      WHERE updated IS NULL OR updated = ''
    `)
      .bind({ now })
      .execute()
  },
  () => {},
)
