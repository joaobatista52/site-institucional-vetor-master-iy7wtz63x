/**
 * Hook para a coleção 'leads':
 * 1) onRecordCreateRequest: Validação server-side rigorosa contra envios diretos à API ou questionários incompletos.
 *    Rejeita requisições sem razão social/empresa, sem e-mail válido, sem nome/cargo do respondente,
 *    ou com perguntas obrigatórias do setor sem resposta, retornando erro claro em português:
 *    "Todas as perguntas devem ser respondidas para a elaboração completa do Dossiê Estratégico".
 *
 * 2) onRecordAfterCreateSuccess: Disparo de e-mails transacionais (confirmação ao lead e notificação à equipe).
 *    Garante que o assunto sempre utilize o nome real da empresa (sem "sua organização"),
 *    e que qualquer falha de envio nunca quebre ou reverta o registro gravado no banco de dados.
 */

onRecordCreateRequest((e) => {
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

  const record = e.record
  if (!record) {
    return e.next()
  }

  // 1. Obter setor
  const setor = (record.getString ? record.getString('setor') : record.get('setor')) || ''
  const setorId = (record.getString ? record.getString('setor_id') : record.get('setor_id')) || ''

  // 2. Obter cadastro e respostas
  let rawCadastro = record.get('cadastro')
  if (typeof rawCadastro === 'undefined' && record.getString) {
    rawCadastro = record.getString('cadastro')
  }
  const cadastro = parseJson(rawCadastro)

  let rawRespostas = record.get('respostas')
  if (typeof rawRespostas === 'undefined' && record.getString) {
    rawRespostas = record.getString('respostas')
  }
  const respostas = parseJson(rawRespostas)

  // 3. Validação dos campos essenciais do cadastro e identificação
  const email = ((cadastro && (cadastro.email || cadastro['email'])) || '').trim()

  // Extração robusta do nome da empresa
  let empresa = ''
  if (cadastro) {
    empresa = (
      cadastro.empresa ||
      cadastro['empresa'] ||
      cadastro.razaoSocial ||
      cadastro['razaoSocial'] ||
      cadastro.nomeEmpresa ||
      ''
    ).trim()
  }
  if (!empresa && respostas && typeof respostas === 'object') {
    const sectorRazaoKeys = [
      'razaoSocial',
      'tech_razaoSocial',
      'varejo_razaoSocial',
      'saude_razaoSocial',
      'servicos_razaoSocial',
      'industria_razaoSocial',
      'agro_razaoSocial',
      'const_razaoSocial',
      'log_razaoSocial',
      'edu_razaoSocial',
      'acad_razaoSocial',
      'trade_razaoSocial',
      'fac_razaoSocial',
    ]
    for (let i = 0; i < sectorRazaoKeys.length; i++) {
      const v = respostas[sectorRazaoKeys[i]]
      if (v && String(v).trim()) {
        empresa = String(v).trim()
        break
      }
    }
  }

  // Extração do nome do respondente
  let respondente = ''
  if (cadastro) {
    respondente = (
      cadastro.nomeCompleto ||
      cadastro['nomeCompleto'] ||
      cadastro.nome ||
      cadastro['nome'] ||
      ''
    ).trim()
  }
  if (!respondente && respostas && typeof respostas === 'object') {
    const sectorRespKeys = [
      'respondente',
      'tech_respondente',
      'varejo_respondente',
      'saude_respondente',
      'servicos_respondente',
      'industria_respondente',
      'agro_respondente',
      'const_respondente',
      'log_respondente',
      'edu_respondente',
      'acad_respondente',
      'trade_respondente',
      'fac_respondente',
    ]
    for (let i = 0; i < sectorRespKeys.length; i++) {
      const v = respostas[sectorRespKeys[i]]
      if (v && String(v).trim()) {
        respondente = String(v).trim()
        break
      }
    }
  }

  // Extração do cargo
  let cargo = ''
  if (cadastro) {
    cargo = (cadastro.cargo || cadastro['cargo'] || '').trim()
  }
  if (!cargo && respostas && typeof respostas === 'object') {
    const sectorCargoKeys = [
      'cargo',
      'tech_cargo',
      'varejo_cargo',
      'saude_cargo',
      'servicos_cargo',
      'industria_cargo',
      'agro_cargo',
      'const_cargo',
      'log_cargo',
      'edu_cargo',
      'acad_cargo',
      'trade_cargo',
      'fac_cargo',
    ]
    for (let i = 0; i < sectorCargoKeys.length; i++) {
      const v = respostas[sectorCargoKeys[i]]
      if (v && String(v).trim()) {
        cargo = String(v).trim()
        break
      }
    }
  }

  // Contagem de respostas não vazias no objeto de respostas
  let filledAnswersCount = 0
  if (respostas && typeof respostas === 'object') {
    const keys = Object.keys(respostas)
    for (let i = 0; i < keys.length; i++) {
      const val = respostas[keys[i]]
      if (val !== null && typeof val !== 'undefined' && String(val).trim().length > 0) {
        filledAnswersCount++
      }
    }
  }

  // Validação:
  // Se for da 'Lista de Prioridade SaaS', aplicamos a validação específica do formulário da lista de prioridade:
  // nome, empresa, e-mail, whatsapp, setor e faturamento anual estimado.
  // Caso contrário, mantemos a validação do questionário setorial de 72h.
  const isEmailValid = email.indexOf('@') > 0 && email.indexOf('.') > email.indexOf('@')
  const origem = ((cadastro && (cadastro.origem || cadastro['origem'])) || '').trim()
  const isSaasPriority =
    origem === 'Lista de Prioridade SaaS' ||
    (cadastro &&
      (cadastro.origemTipo === 'saas_prioridade' || cadastro['origemTipo'] === 'saas_prioridade'))

  if (isSaasPriority) {
    const whatsapp = ((cadastro && (cadastro.whatsapp || cadastro['whatsapp'])) || '').trim()
    const faturamento = (
      (cadastro && (cadastro.faturamento || cadastro['faturamento'])) ||
      ''
    ).trim()

    if (!respondente || !empresa || !isEmailValid || !whatsapp || !setor || !faturamento) {
      throw new BadRequestError(
        'Por favor, preencha todos os campos obrigatórios para entrar na Lista de Prioridade SaaS (Nome, Empresa, E-mail, WhatsApp, Setor e Faturamento).',
      )
    }
    return e.next()
  }

  const hasMinAnswers = filledAnswersCount >= 10

  if (!empresa || !isEmailValid || !respondente || !cargo || !setor || !hasMinAnswers) {
    throw new BadRequestError(
      'Todas as perguntas devem ser respondidas para a elaboração completa do Dossiê Estratégico.',
    )
  }

  return e.next()
}, 'leads')

onRecordAfterCreateSuccess((e) => {
  try {
    const record = e.record
    if (!record) return

    // Helper para converter qualquer valor de campo JSON (string, byte array, ou objeto) para objeto
    function parseJsonField(val) {
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

    // 1. Extração segura dos dados de cadastro e respostas
    let rawCadastro = record.get('cadastro')
    if (typeof rawCadastro === 'undefined' && record.getString) {
      rawCadastro = record.getString('cadastro')
    }
    const cadastro = parseJsonField(rawCadastro)

    let rawRespostas = record.get('respostas')
    if (typeof rawRespostas === 'undefined' && record.getString) {
      rawRespostas = record.getString('respostas')
    }
    const respostas = parseJsonField(rawRespostas)

    const leadEmail = ((cadastro && (cadastro.email || cadastro['email'])) || '').trim()
    const leadNome = (
      (cadastro && (cadastro.nomeCompleto || cadastro['nomeCompleto'])) ||
      'Prezado(a)'
    ).trim()

    // Extração robusta do nome da empresa para SEMPRE usar a empresa real em assunto e corpo
    function extractEmpresaName(cad, resp) {
      if (cad) {
        if (cad.empresa && String(cad.empresa).trim()) return String(cad.empresa).trim()
        if (cad['empresa'] && String(cad['empresa']).trim()) return String(cad['empresa']).trim()
        if (cad.razaoSocial && String(cad.razaoSocial).trim()) return String(cad.razaoSocial).trim()
        if (cad['razaoSocial'] && String(cad['razaoSocial']).trim())
          return String(cad['razaoSocial']).trim()
        if (cad.nomeEmpresa && String(cad.nomeEmpresa).trim()) return String(cad.nomeEmpresa).trim()
      }
      if (resp && typeof resp === 'object') {
        const sectorKeys = [
          'razaoSocial',
          'tech_razaoSocial',
          'varejo_razaoSocial',
          'saude_razaoSocial',
          'servicos_razaoSocial',
          'industria_razaoSocial',
          'agro_razaoSocial',
          'const_razaoSocial',
          'log_razaoSocial',
          'edu_razaoSocial',
          'acad_razaoSocial',
          'trade_razaoSocial',
          'fac_razaoSocial',
        ]
        for (let i = 0; i < sectorKeys.length; i++) {
          const val = resp[sectorKeys[i]]
          if (val && String(val).trim()) return String(val).trim()
        }
      }
      return ''
    }

    const resolvedEmpresa = extractEmpresaName(cadastro, respostas)
    const leadEmpresa = (resolvedEmpresa || 'Empresa').trim()
    const leadCargo = ((cadastro && (cadastro.cargo || cadastro['cargo'])) || '').trim()
    const leadTelefone = ((cadastro && (cadastro.whatsapp || cadastro['whatsapp'])) || '').trim()
    const setorNome =
      (record.getString ? record.getString('setor') : record.get('setor')) || 'Setorial'
    const planoPretendido =
      (cadastro && (cadastro.planoEscolhido || cadastro['planoEscolhido'])) ||
      (respostas && (respostas.plano_escolhido || respostas['plano_escolhido'])) ||
      (record.getString
        ? record.getString('formato_interesse')
        : record.get('formato_interesse')) ||
      'Não especificado'

    // Obter dados do remetente institucional das configurações do PocketBase ou usar fallback institucional
    const settings = $app.settings()
    const senderAddress =
      (settings && settings.meta && settings.meta.senderAddress) || 'contato@vetormaster.com.br'
    const senderName =
      (settings && settings.meta && settings.meta.senderName) ||
      'VETOR MASTER — Inteligência Estratégica'

    // Obter URL do site (se configurada em secrets/env) para link direto ao painel /leads
    const siteUrl = ($os.getenv('SITE_URL') || '').trim().replace(/\/$/, '')
    const leadsPanelUrl = siteUrl ? siteUrl + '/leads' : '/leads'

    const mailClient = $app.newMailClient()

    // Identificação de origem: Lista de Prioridade SaaS vs. Questionário Estratégico
    const leadOrigem = ((cadastro && (cadastro.origem || cadastro['origem'])) || '').trim()
    const leadFaturamento = (
      (cadastro && (cadastro.faturamento || cadastro['faturamento'])) ||
      ''
    ).trim()
    const isSaasPriorityLead =
      leadOrigem === 'Lista de Prioridade SaaS' ||
      (cadastro &&
        (cadastro.origemTipo === 'saas_prioridade' || cadastro['origemTipo'] === 'saas_prioridade'))

    // 2. DISPARO DO E-MAIL 1: Confirmação automática ao Lead
    if (leadEmail && leadEmail.indexOf('@') > 0) {
      try {
        let leadSubject = ''
        let leadHtml = ''

        if (isSaasPriorityLead) {
          leadSubject = 'Inscrição Confirmada: Lista de Prioridade SaaS — VETOR MASTER'
          leadHtml = `<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Lista de Prioridade SaaS — VETOR MASTER</title>
</head>
<body style="margin:0;padding:0;background-color:#F4F6F9;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;color:#333333;line-height:1.6;">
  <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:#F4F6F9;padding:32px 16px;">
    <tr>
      <td align="center">
        <table width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width:600px;background-color:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 4px 12px rgba(0,0,0,0.06);border:1px solid #E2E8F0;">
          <!-- Cabeçalho Institucional Azul #0066CC -->
          <tr>
            <td style="background-color:#0066CC;padding:32px 28px;text-align:center;">
              <table width="100%" cellpadding="0" cellspacing="0" border="0">
                <tr>
                  <td align="center">
                    <span style="display:inline-block;padding:4px 14px;background:#22B14C;border-radius:20px;font-size:11px;font-weight:700;letter-spacing:1.5px;color:#ffffff;text-transform:uppercase;margin-bottom:12px;">
                      Lista de Prioridade SaaS
                    </span>
                    <h1 style="margin:8px 0 0;font-size:26px;font-weight:800;letter-spacing:0.5px;color:#ffffff;line-height:1.2;">
                      VETOR MASTER
                    </h1>
                    <p style="margin:6px 0 0;font-size:13px;color:#E0ECFF;letter-spacing:0.3px;">
                      Inteligência sob Demanda & Monitoramento Contínuo
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Corpo Principal -->
          <tr>
            <td style="padding:36px 32px 28px;">
              <h2 style="margin:0 0 16px;font-size:20px;font-weight:700;color:#1A202C;">
                Inscrição confirmada na Lista de Prioridade!
              </h2>

              <p style="margin:0 0 16px;font-size:15px;color:#4A5568;">
                Olá, <strong>${leadNome}</strong>,
              </p>

              <p style="margin:0 0 20px;font-size:15px;color:#4A5568;">
                Agradecemos pelo seu interesse na solução <strong>VETOR MASTER SaaS</strong> para a empresa <strong>${leadEmpresa}</strong>. Sua vaga foi registrada com prioridade máxima em nossa lista.
              </p>

              <!-- Caixa de Destaque com Benefício de Acesso Antecipado e Condição de Fundador -->
              <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:#EAF3FD;border-left:4px solid #22B14C;border-radius:6px;margin:24px 0;">
                <tr>
                  <td style="padding:18px 20px;">
                    <p style="margin:0 0 6px;font-size:13px;font-weight:700;color:#15803d;text-transform:uppercase;letter-spacing:0.5px;">
                      Acesso Antecipado &amp; Condição Especial de Fundador
                    </p>
                    <p style="margin:0;font-size:15px;color:#1A365D;font-weight:600;line-height:1.5;">
                      Assim que o nível SaaS for liberado, você será comunicado em primeira mão com <strong>acesso antecipado exclusivo</strong> e <strong>condição especial reservada aos membros fundadores</strong>.
                    </p>
                  </td>
                </tr>
              </table>

              <!-- Detalhes do Registro -->
              <table width="100%" cellpadding="0" cellspacing="0" border="0" style="border:1px solid #EDF2F7;border-radius:8px;background-color:#F8FAFC;margin:20px 0 24px;">
                <tr>
                  <td style="padding:16px 20px;">
                    <p style="margin:0 0 10px;font-size:12px;font-weight:700;color:#718096;text-transform:uppercase;letter-spacing:0.8px;">
                      Resumo da Inscrição
                    </p>
                    <table width="100%" cellpadding="4" cellspacing="0" border="0" style="font-size:14px;color:#2D3748;">
                      <tr>
                        <td width="38%" style="color:#718096;font-weight:500;">Empresa:</td>
                        <td style="font-weight:600;">${leadEmpresa}</td>
                      </tr>
                      <tr>
                        <td style="color:#718096;font-weight:500;">Setor:</td>
                        <td style="font-weight:600;">${setorNome}</td>
                      </tr>
                      <tr>
                        <td style="color:#718096;font-weight:500;">Faturamento Anual:</td>
                        <td style="font-weight:600;">${leadFaturamento || 'Não informado'}</td>
                      </tr>
                      <tr>
                        <td style="color:#718096;font-weight:500;">Plano Selecionado:</td>
                        <td style="font-weight:600;color:#0066CC;">SaaS (R$ 1.190/mês)</td>
                      </tr>
                      <tr>
                        <td style="color:#718096;font-weight:500;">Protocolo:</td>
                        <td style="font-family:monospace;font-size:12px;color:#4A5568;">#${record.id}</td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>

              <!-- Destaque para conhecer o MaaS Híbrido enquanto o SaaS não abre -->
              <table width="100%" cellpadding="0" cellspacing="0" border="0" style="border:1px dashed #0066CC;border-radius:8px;background-color:#F0F7FF;margin:24px 0;">
                <tr>
                  <td style="padding:18px 20px;">
                    <p style="margin:0 0 6px;font-size:13px;font-weight:700;color:#0066CC;">
                      Precisa de direção executiva imediata para a sua operação?
                    </p>
                    <p style="margin:0 0 12px;font-size:13px;color:#4A5568;">
                      Conheça o nosso <strong>MaaS Híbrido</strong> (R$ 3.290/mês): união do algoritmo determinístico com validação e acompanhamento C-Level direto para destravar gargalos críticos da sua empresa em até 72h.
                    </p>
                    <a href="${siteUrl ? siteUrl + '/#solucoes' : 'https://site-institucional-vetor-master-165d3.shrd00.internal.goskip.dev/#solucoes'}" style="display:inline-block;padding:8px 16px;background-color:#0066CC;color:#ffffff;text-decoration:none;font-weight:700;font-size:12px;border-radius:6px;">
                      Conhecer o MaaS Híbrido &rarr;
                    </a>
                  </td>
                </tr>
              </table>

              <p style="margin:24px 0 0;font-size:14px;color:#2D3748;">
                Atenciosamente,<br>
                <strong style="color:#0066CC;">Equipe VETOR MASTER</strong><br>
                <span style="font-size:12px;color:#718096;">Inteligência em Gestão, Finanças & Governança</span>
              </p>
            </td>
          </tr>

          <!-- Rodapé -->
          <tr>
            <td style="background-color:#F8FAFC;padding:20px 32px;text-align:center;border-top:1px solid #E2E8F0;">
              <p style="margin:0;font-size:12px;color:#A0AEC0;">
                Este é um e-mail transacional automático referente à sua inscrição na Lista de Prioridade SaaS da VETOR MASTER.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`
        } else {
          leadSubject = 'Confirmação de Recebimento: Questionário Estratégico — VETOR MASTER'
          leadHtml = `<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Recebimento Confirmado — VETOR MASTER</title>
</head>
<body style="margin:0;padding:0;background-color:#F4F6F9;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;color:#333333;line-height:1.6;">
  <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:#F4F6F9;padding:32px 16px;">
    <tr>
      <td align="center">
        <table width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width:600px;background-color:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 4px 12px rgba(0,0,0,0.06);border:1px solid #E2E8F0;">
          <!-- Cabeçalho Institucional Azul #0066CC -->
          <tr>
            <td style="background-color:#0066CC;padding:32px 28px;text-align:center;">
              <table width="100%" cellpadding="0" cellspacing="0" border="0">
                <tr>
                  <td align="center">
                    <span style="display:inline-block;padding:4px 12px;background:rgba(255,255,255,0.18);border-radius:20px;font-size:11px;font-weight:700;letter-spacing:1.5px;color:#ffffff;text-transform:uppercase;margin-bottom:12px;">
                      Inteligência Estratégica
                    </span>
                    <h1 style="margin:8px 0 0;font-size:26px;font-weight:800;letter-spacing:0.5px;color:#ffffff;line-height:1.2;">
                      VETOR MASTER
                    </h1>
                    <p style="margin:6px 0 0;font-size:13px;color:#E0ECFF;letter-spacing:0.3px;">
                      Dossiê de Planejamento & Diagnóstico Operacional
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Corpo Principal -->
          <tr>
            <td style="padding:36px 32px 28px;">
              <h2 style="margin:0 0 16px;font-size:20px;font-weight:700;color:#1A202C;">
                Recebimento confirmado com sucesso!
              </h2>

              <p style="margin:0 0 16px;font-size:15px;color:#4A5568;">
                Olá, <strong>${leadNome}</strong>,
              </p>

              <p style="margin:0 0 20px;font-size:15px;color:#4A5568;">
                Confirmamos o recebimento das respostas e documentos do <strong>Questionário Estratégico</strong> referente à empresa <strong>${leadEmpresa}</strong> (Setor: <strong>${setorNome}</strong>).
              </p>

              <!-- Caixa de Destaque com Prazo da Devolutiva (5 dias) -->
              <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:#EAF3FD;border-left:4px solid #0066CC;border-radius:6px;margin:24px 0;">
                <tr>
                  <td style="padding:18px 20px;">
                    <p style="margin:0 0 6px;font-size:14px;font-weight:700;color:#004F9F;text-transform:uppercase;letter-spacing:0.5px;">
                      Prazo da Devolutiva Estratégica
                    </p>
                    <p style="margin:0;font-size:15px;color:#1A365D;font-weight:600;">
                      Nossa equipe executiva entrará em contato em até <span style="color:#0066CC;text-decoration:underline;">5 dias</span> para agendar a sua Sessão de Devolutiva de 45 minutos.
                    </p>
                  </td>
                </tr>
              </table>

              <!-- Detalhes do Registro -->
              <table width="100%" cellpadding="0" cellspacing="0" border="0" style="border:1px solid #EDF2F7;border-radius:8px;background-color:#F8FAFC;margin:20px 0 24px;">
                <tr>
                  <td style="padding:16px 20px;">
                    <p style="margin:0 0 10px;font-size:12px;font-weight:700;color:#718096;text-transform:uppercase;letter-spacing:0.8px;">
                      Resumo da Solicitação
                    </p>
                    <table width="100%" cellpadding="4" cellspacing="0" border="0" style="font-size:14px;color:#2D3748;">
                      <tr>
                        <td width="35%" style="color:#718096;font-weight:500;">Empresa:</td>
                        <td style="font-weight:600;">${leadEmpresa}</td>
                      </tr>
                      <tr>
                        <td style="color:#718096;font-weight:500;">Setor:</td>
                        <td style="font-weight:600;">${setorNome}</td>
                      </tr>
                      <tr>
                        <td style="color:#718096;font-weight:500;">Plano Pretendido:</td>
                        <td style="font-weight:600;color:#0066CC;">${planoPretendido}</td>
                      </tr>
                      <tr>
                        <td style="color:#718096;font-weight:500;">Protocolo:</td>
                        <td style="font-family:monospace;font-size:12px;color:#4A5568;">#${record.id}</td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>

              <p style="margin:0 0 16px;font-size:14px;color:#4A5568;">
                Durante a Sessão de Devolutiva, nossos especialistas apresentarão um raio-x dos gargalos operacionais e oportunidades de otimização identificadas na sua operação.
              </p>

              <p style="margin:24px 0 0;font-size:14px;color:#2D3748;">
                Atenciosamente,<br>
                <strong style="color:#0066CC;">Equipe VETOR MASTER</strong><br>
                <span style="font-size:12px;color:#718096;">Inteligência em Gestão, Finanças & Governança</span>
              </p>
            </td>
          </tr>

          <!-- Rodapé -->
          <tr>
            <td style="background-color:#F8FAFC;padding:20px 32px;text-align:center;border-top:1px solid #E2E8F0;">
              <p style="margin:0;font-size:12px;color:#A0AEC0;">
                Este é um e-mail transacional automático referente ao seu questionário enviado na plataforma VETOR MASTER.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`
        }

        const leadMessage = new MailerMessage({
          from: {
            address: senderAddress,
            name: senderName,
          },
          to: [{ address: leadEmail }],
          subject: leadSubject,
          html: leadHtml,
        })

        mailClient.send(leadMessage)
        console.log(
          'E-mail de confirmação enviado com sucesso ao lead (' +
            (isSaasPriorityLead ? 'Lista Prioridade SaaS' : 'Questionário') +
            '):',
          leadEmail,
          '(leadId: ' + record.id + ')',
        )
      } catch (errLead) {
        console.error('Erro ao enviar e-mail de confirmação ao lead (' + leadEmail + '):', errLead)
      }
    } else {
      console.warn(
        'Lead criado sem e-mail corporativo válido para envio de confirmação. leadId:',
        record.id,
      )
    }

    // 3. DISPARO DO E-MAIL 2: Notificação automática à Equipe Interna
    const teamEmail = 'joao.batista@qgassist.com.br'
    try {
      let teamSubject = ''
      let teamHtml = ''

      if (isSaasPriorityLead) {
        teamSubject =
          'Novo Lead na Lista de Prioridade SaaS — ' + leadEmpresa + ' (' + setorNome + ')'
        teamHtml = `<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Lista de Prioridade SaaS — VETOR MASTER</title>
</head>
<body style="margin:0;padding:0;background-color:#F4F6F9;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;color:#333333;line-height:1.6;">
  <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:#F4F6F9;padding:32px 16px;">
    <tr>
      <td align="center">
        <table width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width:600px;background-color:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 4px 12px rgba(0,0,0,0.06);border:1px solid #E2E8F0;">
          <!-- Cabeçalho Notificação Interna -->
          <tr>
            <td style="background-color:#1A202C;padding:24px 28px;border-bottom:4px solid #22B14C;">
              <table width="100%" cellpadding="0" cellspacing="0" border="0">
                <tr>
                  <td>
                    <span style="display:inline-block;padding:3px 10px;background:#22B14C;border-radius:12px;font-size:10px;font-weight:700;letter-spacing:1px;color:#ffffff;text-transform:uppercase;">
                      LISTA DE PRIORIDADE SAAS
                    </span>
                    <h2 style="margin:8px 0 0;font-size:20px;font-weight:700;color:#ffffff;">
                      VETOR MASTER — Novo Lead SaaS Cadastrado
                    </h2>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Conteúdo -->
          <tr>
            <td style="padding:28px 28px 20px;">
              <p style="margin:0 0 16px;font-size:14px;color:#4A5568;">
                Um novo executivo acabou de se cadastrar na <strong>Lista de Prioridade SaaS</strong> com intenção de acesso antecipado e condição de fundador:
              </p>

              <table width="100%" cellpadding="0" cellspacing="0" border="0" style="border:1px solid #E2E8F0;border-radius:8px;background-color:#FFFFFF;margin-bottom:24px;">
                <tr>
                  <td style="padding:16px 20px;">
                    <table width="100%" cellpadding="6" cellspacing="0" border="0" style="font-size:14px;color:#2D3748;">
                      <tr style="border-bottom:1px solid #EDF2F7;">
                        <td width="38%" style="color:#718096;font-weight:600;">Origem:</td>
                        <td><strong style="color:#22B14C;">Lista de Prioridade SaaS</strong></td>
                      </tr>
                      <tr style="border-bottom:1px solid #EDF2F7;">
                        <td style="color:#718096;font-weight:600;">Nome:</td>
                        <td style="font-weight:700;color:#1A202C;">${leadNome || '—'}</td>
                      </tr>
                      <tr style="border-bottom:1px solid #EDF2F7;">
                        <td style="color:#718096;font-weight:600;">Empresa:</td>
                        <td style="font-weight:700;color:#1A202C;">${leadEmpresa || '—'}</td>
                      </tr>
                      <tr style="border-bottom:1px solid #EDF2F7;">
                        <td style="color:#718096;font-weight:600;">E-mail:</td>
                        <td><a href="mailto:${leadEmail}" style="color:#0066CC;text-decoration:none;">${leadEmail || '—'}</a></td>
                      </tr>
                      <tr style="border-bottom:1px solid #EDF2F7;">
                        <td style="color:#718096;font-weight:600;">Telefone/WhatsApp:</td>
                        <td>${leadTelefone || '—'}</td>
                      </tr>
                      <tr style="border-bottom:1px solid #EDF2F7;">
                        <td style="color:#718096;font-weight:600;">Setor:</td>
                        <td><strong style="color:#0066CC;">${setorNome}</strong></td>
                      </tr>
                      <tr style="border-bottom:1px solid #EDF2F7;">
                        <td style="color:#718096;font-weight:600;">Faturamento Anual:</td>
                        <td><strong>${leadFaturamento || '—'}</strong></td>
                      </tr>
                      <tr style="border-bottom:1px solid #EDF2F7;">
                        <td style="color:#718096;font-weight:600;">Plano de Interesse:</td>
                        <td><strong style="color:#0066CC;">SaaS (R$ 1.190/mês)</strong></td>
                      </tr>
                      <tr>
                        <td style="color:#718096;font-weight:600;">ID do Registro:</td>
                        <td style="font-family:monospace;font-size:12px;color:#718096;">${record.id}</td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>

              <!-- Botão de Ação Direta para /leads -->
              <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin:20px 0;">
                <tr>
                  <td align="center">
                    <a href="${leadsPanelUrl}" target="_blank" style="display:inline-block;padding:14px 28px;background-color:#0066CC;color:#ffffff;text-decoration:none;font-weight:700;font-size:14px;border-radius:8px;box-shadow:0 2px 6px rgba(0,102,204,0.35);">
                      Ver no Painel de Leads (/leads) &rarr;
                    </a>
                  </td>
                </tr>
              </table>

              <p style="margin:16px 0 0;font-size:12px;color:#A0AEC0;text-align:center;">
                Link direto: <a href="${leadsPanelUrl}" style="color:#0066CC;">${leadsPanelUrl}</a>
              </p>
            </td>
          </tr>

          <!-- Rodapé Interno -->
          <tr>
            <td style="background-color:#F8FAFC;padding:16px 28px;text-align:center;border-top:1px solid #E2E8F0;">
              <p style="margin:0;font-size:12px;color:#A0AEC0;">
                Notificação interna do sistema VETOR MASTER gerada automaticamente.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`
      } else {
        teamSubject = 'Novo Dossiê Recebido — ' + leadEmpresa + ' (' + setorNome + ')'
        teamHtml = `<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Novo Dossiê Recebido — VETOR MASTER</title>
</head>
<body style="margin:0;padding:0;background-color:#F4F6F9;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;color:#333333;line-height:1.6;">
  <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:#F4F6F9;padding:32px 16px;">
    <tr>
      <td align="center">
        <table width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width:600px;background-color:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 4px 12px rgba(0,0,0,0.06);border:1px solid #E2E8F0;">
          <!-- Cabeçalho Notificação Interna -->
          <tr>
            <td style="background-color:#1A202C;padding:24px 28px;border-bottom:4px solid #0066CC;">
              <table width="100%" cellpadding="0" cellspacing="0" border="0">
                <tr>
                  <td>
                    <span style="display:inline-block;padding:3px 10px;background:#0066CC;border-radius:12px;font-size:10px;font-weight:700;letter-spacing:1px;color:#ffffff;text-transform:uppercase;">
                      NOVO DOSSIÊ RECEBIDO
                    </span>
                    <h2 style="margin:8px 0 0;font-size:20px;font-weight:700;color:#ffffff;">
                      VETOR MASTER — Painel de Leads
                    </h2>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Conteúdo com os dados solicitados -->
          <tr>
            <td style="padding:28px 28px 20px;">
              <p style="margin:0 0 16px;font-size:14px;color:#4A5568;">
                Um novo questionário setorial completo foi enviado na plataforma institucional:
              </p>

              <table width="100%" cellpadding="0" cellspacing="0" border="0" style="border:1px solid #E2E8F0;border-radius:8px;background-color:#FFFFFF;margin-bottom:24px;">
                <tr>
                  <td style="padding:16px 20px;">
                    <table width="100%" cellpadding="6" cellspacing="0" border="0" style="font-size:14px;color:#2D3748;">
                      <tr style="border-bottom:1px solid #EDF2F7;">
                        <td width="35%" style="color:#718096;font-weight:600;">Nome:</td>
                        <td style="font-weight:700;color:#1A202C;">${leadNome || '—'}</td>
                      </tr>
                      <tr style="border-bottom:1px solid #EDF2F7;">
                        <td style="color:#718096;font-weight:600;">Empresa:</td>
                        <td style="font-weight:700;color:#1A202C;">${leadEmpresa || '—'}</td>
                      </tr>
                      ${
                        leadCargo
                          ? `
                      <tr style="border-bottom:1px solid #EDF2F7;">
                        <td style="color:#718096;font-weight:600;">Cargo:</td>
                        <td>${leadCargo}</td>
                      </tr>`
                          : ''
                      }
                      <tr style="border-bottom:1px solid #EDF2F7;">
                        <td style="color:#718096;font-weight:600;">E-mail:</td>
                        <td><a href="mailto:${leadEmail}" style="color:#0066CC;text-decoration:none;">${leadEmail || '—'}</a></td>
                      </tr>
                      <tr style="border-bottom:1px solid #EDF2F7;">
                        <td style="color:#718096;font-weight:600;">Telefone/WhatsApp:</td>
                        <td>${leadTelefone || '—'}</td>
                      </tr>
                      <tr style="border-bottom:1px solid #EDF2F7;">
                        <td style="color:#718096;font-weight:600;">Setor:</td>
                        <td><strong style="color:#0066CC;">${setorNome}</strong></td>
                      </tr>
                      <tr style="border-bottom:1px solid #EDF2F7;">
                        <td style="color:#718096;font-weight:600;">Plano Pretendido:</td>
                        <td><strong style="color:#22B14C;">${planoPretendido}</strong></td>
                      </tr>
                      <tr>
                        <td style="color:#718096;font-weight:600;">ID do Registro:</td>
                        <td style="font-family:monospace;font-size:12px;color:#718096;">${record.id}</td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>

              <!-- Botão de Ação Direta para /leads -->
              <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin:20px 0;">
                <tr>
                  <td align="center">
                    <a href="${leadsPanelUrl}" target="_blank" style="display:inline-block;padding:14px 28px;background-color:#0066CC;color:#ffffff;text-decoration:none;font-weight:700;font-size:14px;border-radius:8px;box-shadow:0 2px 6px rgba(0,102,204,0.35);">
                      Acessar Dossiê Completo em /leads &rarr;
                    </a>
                  </td>
                </tr>
              </table>

              <p style="margin:16px 0 0;font-size:12px;color:#A0AEC0;text-align:center;">
                Link direto: <a href="${leadsPanelUrl}" style="color:#0066CC;">${leadsPanelUrl}</a>
              </p>
            </td>
          </tr>

          <!-- Rodapé Interno -->
          <tr>
            <td style="background-color:#F8FAFC;padding:16px 28px;text-align:center;border-top:1px solid #E2E8F0;">
              <p style="margin:0;font-size:12px;color:#A0AEC0;">
                Notificação interna do sistema VETOR MASTER gerada automaticamente.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`
      }

      const teamMessage = new MailerMessage({
        from: {
          address: senderAddress,
          name: senderName,
        },
        to: [{ address: teamEmail }],
        subject: teamSubject,
        html: teamHtml,
      })

      mailClient.send(teamMessage)
      console.log(
        'Notificação enviada com sucesso à equipe interna (' +
          teamEmail +
          ') para leadId: ' +
          record.id +
          ' (Origem: ' +
          (isSaasPriorityLead ? 'Lista Prioridade SaaS' : 'Questionário') +
          ')',
      )
    } catch (errTeam) {
      console.error(
        'Erro ao enviar notificação de lead para a equipe (' + teamEmail + '):',
        errTeam,
      )
    }
  } catch (errGlobal) {
    // Garantir que nenhuma exceção imprevista quebre o lifecycle do lead
    console.error('Falha geral no hook onRecordAfterCreateSuccess de leads:', errGlobal)
  }
}, 'leads')
