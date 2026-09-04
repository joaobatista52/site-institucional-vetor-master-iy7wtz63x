migrate(
  (app) => {
    try {
      const record = app.findAuthRecordByEmail('users', 'joao.batista@qgassist.com.br')
      record.setPassword('Capitu@1952@')
      app.save(record)
    } catch (err) {
      // Se não encontrar o usuário por 'users', tenta pelo ID de auth do PocketBase
      const record = app.findAuthRecordByEmail('_pb_users_auth_', 'joao.batista@qgassist.com.br')
      record.setPassword('Capitu@1952@')
      app.save(record)
    }
  },
  (app) => {
    // Reverter para a senha anterior se necessário
    try {
      const record = app.findAuthRecordByEmail('users', 'joao.batista@qgassist.com.br')
      record.setPassword('Skip@Pass')
      app.save(record)
    } catch (_) {
      try {
        const record = app.findAuthRecordByEmail('_pb_users_auth_', 'joao.batista@qgassist.com.br')
        record.setPassword('Skip@Pass')
        app.save(record)
      } catch (_) {}
    }
  },
)
