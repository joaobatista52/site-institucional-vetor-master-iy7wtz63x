migrate(
  (app) => {
    const collection = new Collection({
      type: 'base',
      name: 'leads',
      listRule: '',
      viewRule: '',
      createRule: '',
      updateRule: null,
      deleteRule: null,
      fields: [
        {
          name: 'setor',
          type: 'text',
          required: true,
          presentable: true,
        },
        {
          name: 'setor_id',
          type: 'text',
        },
        {
          name: 'cadastro',
          type: 'json',
          maxSize: 2000000,
        },
        {
          name: 'respostas',
          type: 'json',
          maxSize: 4000000,
        },
        {
          name: 'contrato_social',
          type: 'file',
          maxSelect: 5,
          maxSize: 52428800,
          mimeTypes: [
            'application/pdf',
            'image/jpeg',
            'image/png',
            'application/msword',
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
          ],
        },
        {
          name: 'certificacoes',
          type: 'file',
          maxSelect: 10,
          maxSize: 52428800,
          mimeTypes: [
            'application/pdf',
            'image/jpeg',
            'image/png',
            'application/msword',
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
          ],
        },
        {
          name: 'documentacao_adicional',
          type: 'file',
          maxSelect: 10,
          maxSize: 52428800,
          mimeTypes: [
            'application/pdf',
            'application/msword',
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
            'application/vnd.ms-excel',
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            'text/csv',
            'image/jpeg',
            'image/png',
          ],
        },
        {
          name: 'autorizacao_devolutiva',
          type: 'select',
          maxSelect: 1,
          values: ['Sim, autorizo', 'Não autorizo'],
        },
        {
          name: 'formato_interesse',
          type: 'select',
          maxSelect: 1,
          values: ['MaaS', 'Híbrido', 'CaaS', 'Ainda não sei'],
        },
        {
          name: 'responsavel_documentos',
          type: 'text',
        },
        {
          name: 'status',
          type: 'select',
          maxSelect: 1,
          values: ['novo', 'em_analise', 'devolutiva_agendada', 'concluido', 'descartado'],
        },
      ],
    })

    collection.addIndex('idx_leads_setor', false, 'setor')

    app.save(collection)
  },
  (app) => {
    try {
      const collection = app.findCollectionByNameOrId('leads')
      app.delete(collection)
    } catch (_) {}
  },
)
