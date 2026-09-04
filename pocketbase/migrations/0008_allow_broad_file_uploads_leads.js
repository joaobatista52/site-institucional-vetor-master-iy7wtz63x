migrate(
  (app) => {
    const leads = app.findCollectionByNameOrId('leads')

    // 1. Ampliar tipos de arquivos aceitos e limites dos campos de upload
    // Permitir arquivos comuns de escritório e imagens sem restrição excessiva de mimeTypes
    const fileFields = ['contrato_social', 'certificacoes', 'documentacao_adicional']
    const broadMimes = [
      'application/pdf',
      'image/jpeg',
      'image/png',
      'image/webp',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'text/csv',
      'text/plain',
      'application/zip',
      'application/x-zip-compressed',
      'application/octet-stream',
    ]

    for (const fieldName of fileFields) {
      const field = leads.fields.getByName(fieldName)
      if (field) {
        field.maxSelect = 15
        field.maxSize = 104857600 // 100MB
        field.mimeTypes = broadMimes
      }
    }

    app.save(leads)
  },
  (app) => {
    try {
      const leads = app.findCollectionByNameOrId('leads')
      const fileFields = ['contrato_social', 'certificacoes', 'documentacao_adicional']
      for (const fieldName of fileFields) {
        const field = leads.fields.getByName(fieldName)
        if (field) {
          field.maxSelect = 10
          field.maxSize = 52428800
        }
      }
      app.save(leads)
    } catch (_) {}
  },
)
