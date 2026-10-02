migrate(
  (app) => {
    const users = app.findCollectionByNameOrId('users')

    try {
      const existing = app.findAuthRecordByEmail('users', 'app@vetormaster.com.br')
      // Se já existir, garante que o nome está correto e a senha está atualizada
      existing.set('name', 'App VETOR MASTER')
      existing.setPassword('VmApp#2026@SecureAccess!')
      existing.setVerified(true)
      app.save(existing)
      return
    } catch (_) {}

    const record = new Record(users)
    record.setEmail('app@vetormaster.com.br')
    record.setPassword('VmApp#2026@SecureAccess!')
    record.setVerified(true)
    record.set('name', 'App VETOR MASTER')
    app.save(record)
  },
  (app) => {
    try {
      const record = app.findAuthRecordByEmail('users', 'app@vetormaster.com.br')
      app.delete(record)
    } catch (_) {}
  },
)
