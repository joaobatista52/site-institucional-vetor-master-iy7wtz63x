/**
 * Hook disparado após a criação bem-sucedida de um lead (envio de questionário).
 * Dispara dois e-mails transacionais:
 * 1) Confirmação ao lead (recebimento confirmado, prazo de devolutiva em até 5 dias, identidade visual VETOR MASTER azul #0066CC);
 * 2) Notificação à equipe interna (joao.batista@qgassist.com.br) com os dados principais e link para o painel /leads.
 *
 * Em caso de qualquer falha no envio dos e-mails, o erro é capturado e registrado em console.error
 * para nunca reverter ou quebrar o registro de lead já gravado no banco de dados.
 */

onRecordAfterCreateSuccess((e) => {
  try {
    const record = e.record
    if (!record) return

    // Helper para converter qualquer valor de campo JSON (string, byte array, ou objeto) para string/objeto
    function parseJsonField(val) {
      if (!val) return {}
      if (typeof val === 'object' && !Array.isArray(val)) {
        return val
      }
      let str = ''
      if (typeof val === 'string') {
        str = val
      } else if (Array.isArray(val)) {
        // Se for array de bytes do SQLite/Go BLOB, converter para string UTF-8
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
    const leadEmpresa = (
      (cadastro && (cadastro.empresa || cadastro['empresa'])) ||
      'sua organização'
    ).trim()
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

    // 2. DISPARO DO E-MAIL 1: Confirmação automática ao Lead
    if (leadEmail && leadEmail.indexOf('@') > 0) {
      try {
        const leadSubject = 'Confirmação de Recebimento: Questionário Estratégico — VETOR MASTER'

        const leadHtml = `<!DOCTYPE html>
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
          'E-mail de confirmação enviado com sucesso ao lead:',
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
      const teamSubject = 'Novo Dossiê Recebido — ' + leadEmpresa + ' (' + setorNome + ')'

      const teamHtml = `<!DOCTYPE html>
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
          record.id,
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
