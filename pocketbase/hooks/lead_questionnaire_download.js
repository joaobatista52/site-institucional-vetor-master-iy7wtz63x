/**
 * Endpoint público seguro para o lead consultar e baixar o seu questionário respondido
 * via protocolo e token de verificação.
 *
 * GET /api/lead-questionnaire/download?protocolo=<id>&token=<token>
 *
 * Retorna os dados completos do questionário (respostas, cadastro, setor, anexos, data)
 * para exibição ou download em PDF no frontend sem exigir login no painel /leads.
 */
routerAdd('GET', '/backend/v1/lead-questionnaire/download', (e) => {
  const query = e.requestInfo().query || {}
  const protocolo = (query.protocolo || '').trim()
  const token = (query.token || '').trim()

  if (!protocolo) {
    throw new BadRequestError('Protocolo do questionário não informado.')
  }

  // Buscar registro do lead no banco
  let record = null
  try {
    record = $app.findRecordById('leads', protocolo)
  } catch (_) {
    throw new NotFoundError('Questionário não encontrado para o protocolo informado.')
  }

  // Helper para normalizar e converter qualquer formato de campo JSON (string, byte array, objeto)
  function parseJson(val) {
    if (!val) return {}
    if (typeof val === 'object' && !Array.isArray(val)) {
      return val
    }
    let str = ''
    if (typeof val === 'string') {
      str = val
    } else if (Array.isArray(val)) {
      try {
        let s = ''
        for (let i = 0; i < val.length; i++) {
          s += String.fromCharCode(val[i])
        }
        str = decodeURIComponent(escape(s))
      } catch (_) {
        let s = ''
        for (let i = 0; i < val.length; i++) {
          s += String.fromCharCode(val[i])
        }
        str = s
      }
    }
    if (!str) return {}
    try {
      return JSON.parse(str)
    } catch (_) {
      return {}
    }
  }

  const rawCadastro = record.get('cadastro')
  const cadastro = parseJson(rawCadastro)
  const leadEmail = ((cadastro && (cadastro.email || cadastro['email'])) || '').trim().toLowerCase()

  // Se um token for informado, validar o token via hash sha256 (protocolo + email)
  // Caso nenhum token seja fornecido, permitir acesso caso o leadEmail bata com query.email
  const expectedHash = $security.sha256(protocolo + ':' + leadEmail).slice(0, 32)
  const queryEmail = (query.email || '').trim().toLowerCase()

  const isTokenValid = token && token === expectedHash
  const isEmailMatching = queryEmail && queryEmail === leadEmail

  if (!isTokenValid && !isEmailMatching) {
    throw new ForbiddenError(
      'Acesso não autorizado ao questionário. Verifique o link completo recebido ou o protocolo e e-mail cadastrados.',
    )
  }

  const rawRespostas = record.get('respostas')
  const respostas = parseJson(rawRespostas)

  return e.json(200, {
    id: record.id,
    created: record.getString('created'),
    updated: record.getString('updated'),
    setor: record.getString('setor'),
    setor_id: record.getString('setor_id'),
    status: record.getString('status'),
    autorizacao_devolutiva: record.getString('autorizacao_devolutiva'),
    formato_interesse: record.getString('formato_interesse'),
    responsavel_documentos: record.getString('responsavel_documentos'),
    contrato_social: record.get('contrato_social') || [],
    certificacoes: record.get('certificacoes') || [],
    documentacao_adicional: record.get('documentacao_adicional') || [],
    cadastro: cadastro,
    respostas: respostas,
    verificationToken: expectedHash,
  })
})
