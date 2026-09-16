/**
 * Serviço de Geração e Impressão de PDF Institucional do Questionário Respondido
 * VETOR MASTER — Padrão Visual Institucional (#0066CC, #22B14C, tipografia limpa).
 *
 * Gera um documento formatado para impressão / salvamento nativo em PDF com:
 * 1. Cabeçalho com logo VETOR MASTER, protocolo e data
 * 2. Dados cadastrais da empresa e respondente
 * 3. Todas as seções e perguntas do setor com respostas formatadas
 * 4. Documentos e anexos listados
 * 5. Termo de confidencialidade e rodapé institucional
 */

import { getQuestionnaireSections } from '@/data/questionnaireSectors'
import { findSector } from '@/data/sectors'
import { normalizeSectorIdForDictionary, resolveQuestionAnswer } from '@/services/dossieExport'

export interface QuestionnairePdfData {
  id: string
  created?: string
  setor: string
  setor_id?: string
  status?: string
  autorizacao_devolutiva?: string
  formato_interesse?: string
  responsavel_documentos?: string
  contrato_social?: string[] | string
  certificacoes?: string[] | string
  documentacao_adicional?: string[] | string
  cadastro: {
    nomeCompleto?: string
    empresa?: string
    email?: string
    whatsapp?: string
    telefone?: string
    cargo?: string
    cnpj?: string
    faturamento?: string
    planoEscolhido?: string
    [key: string]: unknown
  }
  respostas: Record<string, unknown>
}

export function generateQuestionnaireHtml(data: QuestionnairePdfData): string {
  const normalizedSectorId = normalizeSectorIdForDictionary(data.setor_id, data.setor)
  const sector = findSector(normalizedSectorId)
  const sectorTitle = data.setor || sector?.name || 'Diagnóstico Setorial'

  const cadastro = data.cadastro || {}
  const respostas = data.respostas || {}

  // Extração inteligente de dados caso estejam dispersos nas respostas
  const nomeCompleto =
    cadastro.nomeCompleto ||
    (respostas[`${normalizedSectorId}_respondente`] as string) ||
    (respostas.respondente as string) ||
    'Não informado'

  const empresa =
    cadastro.empresa ||
    (respostas[`${normalizedSectorId}_razaoSocial`] as string) ||
    (respostas.razaoSocial as string) ||
    'Empresa não informada'

  const email = cadastro.email || 'Não informado'
  const telefone = cadastro.whatsapp || cadastro.telefone || 'Não informado'
  const cargo =
    cadastro.cargo ||
    (respostas[`${normalizedSectorId}_cargo`] as string) ||
    (respostas.cargo as string) ||
    'Não informado'

  const cnpj =
    cadastro.cnpj ||
    (respostas[`${normalizedSectorId}_cnpj`] as string) ||
    (respostas.cnpj as string) ||
    'Não informado'

  const faturamento =
    cadastro.faturamento ||
    (respostas[`${normalizedSectorId}_1_1`] as string) ||
    (respostas.faturamentoAnual as string) ||
    'Não informado'

  const plano =
    cadastro.planoEscolhido ||
    (respostas.plano_escolhido as string) ||
    data.formato_interesse ||
    'MaaS Híbrido'

  const formattedDate = data.created
    ? new Date(data.created).toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      })
    : new Date().toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
      })

  const sections = getQuestionnaireSections(normalizedSectorId)

  // Tratamento de anexos
  const normalizeFiles = (val: unknown): string[] => {
    if (!val) return []
    if (Array.isArray(val)) return val.filter(Boolean).map(String)
    return [String(val)]
  }

  const contratos = normalizeFiles(data.contrato_social)
  const certificacoes = normalizeFiles(data.certificacoes)
  const adicionais = normalizeFiles(data.documentacao_adicional)
  const totalAnexos = contratos.length + certificacoes.length + adicionais.length

  let secoesHtml = ''
  let countPerguntasTotal = 0
  let countRespondidas = 0

  sections.forEach((sec, idx) => {
    let perguntasHtml = ''
    sec.questions.forEach((q) => {
      countPerguntasTotal++
      const { hasAnswer, value } = resolveQuestionAnswer(q.id, respostas)
      if (hasAnswer) countRespondidas++

      perguntasHtml += `
        <div class="q-block">
          <div class="q-label">${escapeHtml(q.label)}</div>
          <div class="q-val ${hasAnswer ? 'answered' : 'empty'}">
            ${hasAnswer ? escapeHtml(value || '') : 'Não respondido'}
          </div>
        </div>
      `
    })

    secoesHtml += `
      <section class="section-card">
        <div class="section-header">
          <span class="section-badge">SEÇÃO ${idx + 1}</span>
          <h3 class="section-title">${escapeHtml(sec.title)}</h3>
          ${sec.subtitle ? `<div class="section-sub">${escapeHtml(sec.subtitle)}</div>` : ''}
        </div>
        <div class="section-content">
          ${perguntasHtml}
        </div>
      </section>
    `
  })

  return `<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="utf-8">
  <title>Questionário Respondido — VETOR MASTER — ${escapeHtml(empresa)}</title>
  <style>
    @page {
      size: A4;
      margin: 16mm 14mm 16mm 14mm;
    }
    * {
      box-sizing: border-box;
      -webkit-print-color-adjust: exact !important;
      print-color-adjust: exact !important;
    }
    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
      color: #1a202c;
      background-color: #ffffff;
      margin: 0;
      padding: 0;
      font-size: 11pt;
      line-height: 1.5;
    }
    .header-bar {
      border-bottom: 3px solid #0066CC;
      padding-bottom: 14px;
      margin-bottom: 20px;
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
    }
    .brand-title {
      font-size: 20pt;
      font-weight: 800;
      color: #0066CC;
      letter-spacing: 0.5px;
      margin: 0;
      line-height: 1.1;
    }
    .brand-sub {
      font-size: 9pt;
      color: #4a5568;
      margin-top: 4px;
      letter-spacing: 0.2px;
      text-transform: uppercase;
      font-weight: 600;
    }
    .protocol-box {
      text-align: right;
      background: #F0F7FF;
      border: 1px solid #BFDBFE;
      padding: 8px 12px;
      border-radius: 6px;
    }
    .protocol-label {
      font-size: 8pt;
      text-transform: uppercase;
      color: #0066CC;
      font-weight: 700;
      margin-bottom: 2px;
    }
    .protocol-id {
      font-family: monospace;
      font-size: 11pt;
      font-weight: 700;
      color: #1a365d;
    }
    .protocol-date {
      font-size: 8pt;
      color: #718096;
      margin-top: 2px;
    }
    .lead-summary-card {
      background: #F8FAFC;
      border: 1px solid #E2E8F0;
      border-left: 4px solid #22B14C;
      border-radius: 6px;
      padding: 14px 16px;
      margin-bottom: 20px;
    }
    .summary-title {
      font-size: 10pt;
      text-transform: uppercase;
      color: #15803d;
      font-weight: 700;
      letter-spacing: 0.5px;
      margin: 0 0 10px 0;
    }
    .summary-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 8px 16px;
      font-size: 9.5pt;
    }
    .summary-item strong {
      color: #4a5568;
      font-weight: 600;
    }
    .section-card {
      border: 1px solid #E2E8F0;
      border-radius: 6px;
      margin-bottom: 16px;
      page-break-inside: avoid;
      background: #ffffff;
      overflow: hidden;
    }
    .section-header {
      background: #F1F5F9;
      padding: 10px 14px;
      border-bottom: 1px solid #E2E8F0;
    }
    .section-badge {
      display: inline-block;
      background: #0066CC;
      color: #ffffff;
      font-size: 7.5pt;
      font-weight: 700;
      padding: 2px 8px;
      border-radius: 4px;
      letter-spacing: 0.5px;
      margin-bottom: 4px;
    }
    .section-title {
      font-size: 11.5pt;
      font-weight: 700;
      color: #0f172a;
      margin: 2px 0 0 0;
    }
    .section-sub {
      font-size: 8.5pt;
      color: #64748b;
      margin-top: 3px;
    }
    .section-content {
      padding: 12px 14px;
    }
    .q-block {
      margin-bottom: 11px;
      padding-bottom: 11px;
      border-bottom: 1px dashed #E2E8F0;
    }
    .q-block:last-child {
      margin-bottom: 0;
      padding-bottom: 0;
      border-bottom: none;
    }
    .q-label {
      font-size: 9pt;
      font-weight: 600;
      color: #334155;
      margin-bottom: 4px;
    }
    .q-val {
      font-size: 9.5pt;
      padding: 6px 10px;
      border-radius: 4px;
      white-space: pre-wrap;
      word-break: break-word;
    }
    .q-val.answered {
      background: #F8FAFC;
      border: 1px solid #E2E8F0;
      color: #0f172a;
      font-weight: 500;
    }
    .q-val.empty {
      background: #FFFBEB;
      border: 1px dashed #FDE68A;
      color: #92400E;
      font-style: italic;
    }
    .anexos-card {
      border: 1px solid #BFDBFE;
      background: #F0F7FF;
      border-radius: 6px;
      padding: 14px;
      margin-top: 20px;
      page-break-inside: avoid;
    }
    .anexos-card h4 {
      margin: 0 0 10px 0;
      font-size: 10pt;
      color: #0066CC;
      text-transform: uppercase;
      font-weight: 700;
    }
    .anexo-item {
      font-size: 9pt;
      color: #334155;
      padding: 3px 0;
    }
    .footer-note {
      margin-top: 24px;
      padding-top: 12px;
      border-top: 1px solid #CBD5E1;
      font-size: 8pt;
      color: #64748b;
      text-align: center;
      line-height: 1.4;
      page-break-inside: avoid;
    }
    @media screen {
      body {
        max-width: 860px;
        margin: 20px auto;
        padding: 32px 36px;
        background: #ffffff;
        box-shadow: 0 4px 16px rgba(0,0,0,0.08);
        border-radius: 8px;
      }
      .print-actions {
        position: sticky;
        top: 16px;
        background: #0066CC;
        color: white;
        padding: 12px 20px;
        border-radius: 8px;
        margin-bottom: 24px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        box-shadow: 0 4px 12px rgba(0,102,204,0.3);
        z-index: 100;
      }
      .print-btn {
        background: #22B14C;
        color: white;
        border: none;
        padding: 8px 18px;
        font-weight: 700;
        font-size: 10pt;
        border-radius: 6px;
        cursor: pointer;
      }
      .print-btn:hover {
        background: #1e9b42;
      }
    }
    @media print {
      .print-actions {
        display: none !important;
      }
    }
  </style>
</head>
<body>
  <div class="print-actions">
    <div>
      <strong>Cópia Oficial do Questionário — VETOR MASTER</strong>
      <span style="font-size:9pt;opacity:0.9;display:block;">Gere o PDF através do botão ao lado ou usando Ctrl+P / Cmd+P.</span>
    </div>
    <button class="print-btn" onclick="window.print()">Salvar como PDF / Imprimir</button>
  </div>

  <header class="header-bar">
    <div>
      <h1 class="brand-title">VETOR MASTER</h1>
      <div class="brand-sub">Inteligência Estratégica · Dossiê Diagnóstico V6.7</div>
    </div>
    <div class="protocol-box">
      <div class="protocol-label">Protocolo Oficial</div>
      <div class="protocol-id">#${escapeHtml(data.id)}</div>
      <div class="protocol-date">${formattedDate}</div>
    </div>
  </header>

  <section class="lead-summary-card">
    <div class="summary-title">Identificação do Lead &amp; Diagnóstico Setorial</div>
    <div class="summary-grid">
      <div class="summary-item"><strong>Empresa / Razão Social:</strong> ${escapeHtml(empresa)}</div>
      <div class="summary-item"><strong>Setor Diagnosticado:</strong> ${escapeHtml(sectorTitle)}</div>
      <div class="summary-item"><strong>Respondente:</strong> ${escapeHtml(nomeCompleto)}</div>
      <div class="summary-item"><strong>Cargo:</strong> ${escapeHtml(cargo)}</div>
      <div class="summary-item"><strong>E-mail Corporativo:</strong> ${escapeHtml(email)}</div>
      <div class="summary-item"><strong>Celular / WhatsApp:</strong> ${escapeHtml(telefone)}</div>
      <div class="summary-item"><strong>CNPJ:</strong> ${escapeHtml(cnpj)}</div>
      <div class="summary-item"><strong>Faixa de Faturamento:</strong> ${escapeHtml(faturamento)}</div>
      <div class="summary-item"><strong>Plano Pretendido:</strong> ${escapeHtml(plano)}</div>
      <div class="summary-item"><strong>Autorização de Devolutiva:</strong> ${escapeHtml(data.autorizacao_devolutiva || 'Sim, autorizo')}</div>
    </div>
  </section>

  <div style="margin-bottom:16px;font-size:9pt;color:#475569;display:flex;justify-content:space-between;border-bottom:1px solid #CBD5E1;padding-bottom:6px;">
    <span>Perguntas respondidas: <strong>${countRespondidas} de ${countPerguntasTotal}</strong></span>
    <span>Versão do Diagnóstico: <strong>Schema V6.7</strong></span>
  </div>

  ${secoesHtml}

  ${
    totalAnexos > 0
      ? `
  <section class="anexos-card">
    <h4>Documentos e Anexos Informados (${totalAnexos} arquivo(s))</h4>
    ${
      contratos.length > 0
        ? `<div class="anexo-item"><strong>Demonstrativos Econômico-Financeiros:</strong> ${contratos.map(escapeHtml).join(', ')}</div>`
        : ''
    }
    ${
      certificacoes.length > 0
        ? `<div class="anexo-item"><strong>Relatórios Gerenciais:</strong> ${certificacoes.map(escapeHtml).join(', ')}</div>`
        : ''
    }
    ${
      adicionais.length > 0
        ? `<div class="anexo-item"><strong>Sociedade e documentos complementares:</strong> ${adicionais.map(escapeHtml).join(', ')}</div>`
        : ''
    }
  </section>
  `
      : ''
  }

  <footer class="footer-note">
    Este documento é confidencial e constitui o Dossiê Estratégico fornecido à <strong>VETOR MASTER</strong>.<br>
    As informações aqui prestadas são protegidas por sigilo profissional e serão utilizadas na elaboração do Diagnóstico Operacional e na Sessão de Devolutiva de 45 minutos.<br>
    VETOR MASTER — Gestão, Finanças & Governança Corporativa · Protocolo #${escapeHtml(data.id)}
  </footer>
</body>
</html>`
}

function escapeHtml(str: string): string {
  if (!str) return ''
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}

/**
 * Abre a janela de visualização e aciona a impressão direta para PDF nativo
 */
export function downloadQuestionnaireAsPdf(data: QuestionnairePdfData): void {
  const html = generateQuestionnaireHtml(data)
  const printWindow = window.open('', '_blank')
  if (!printWindow) {
    // Caso popups estejam bloqueados, abrir via blob
    const blob = new Blob([html], { type: 'text/html;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    window.open(url, '_blank')
    return
  }

  printWindow.document.open()
  printWindow.document.write(html)
  printWindow.document.close()

  // Esperar o carregamento dos recursos do documento antes de disparar print
  printWindow.addEventListener('load', () => {
    setTimeout(() => {
      try {
        printWindow.print()
      } catch (err) {
        console.warn('Erro ao disparar printWindow.print():', err)
      }
    }, 250)
  })
}
