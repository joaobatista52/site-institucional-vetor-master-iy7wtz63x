migrate(
  (app) => {
    // Excluir os registros de leads de teste solicitados pelo usuário:
    // 1) "Carlos Teste Transacional" (Inovação Tech Brasil Ltda, 2 envios: IDs p1bvl9qfmuejr4f e 2o5l7cndbzt6p9i)
    // 2) "Eduardo Martins / Apex Soluções Digitais" (dossiê quase vazio: ID ev2v2mtcbys363i)
    // 3) Lead teste com respostas "werw/ewrw" gravado por volta de 23h30 (ID ohlr7v8776x5m4r)
    // Preservar os leads legítimos e de teste validados (Antonio Carlos / MegaVarejo Modas, João Batista, etc.)

    const testLeadIds = [
      'ev2v2mtcbys363i', // Eduardo Martins / Apex Soluções Digitais
      '2o5l7cndbzt6p9i', // Carlos Teste Transacional
      'p1bvl9qfmuejr4f', // Carlos Teste Transacional
      'ohlr7v8776x5m4r', // werw / ewrw
    ]

    for (let i = 0; i < testLeadIds.length; i++) {
      const id = testLeadIds[i]
      try {
        const record = app.findRecordById('leads', id)
        if (record) {
          app.delete(record)
        }
      } catch (_) {
        // Registro já não existe ou foi removido
      }
    }

    // Limpeza defensiva caso existam outros registros com esses nomes de teste
    try {
      app
        .db()
        .newQuery(`
        DELETE FROM leads 
        WHERE id IN ('ev2v2mtcbys363i', '2o5l7cndbzt6p9i', 'p1bvl9qfmuejr4f', 'ohlr7v8776x5m4r')
      `)
        .execute()
    } catch (_) {}
  },
  () => {
    // Reversão não é necessária para exclusão de dados de teste
  },
)
