export interface QuestionnaireDraftData {
  sectorId: string
  step: number
  highestReachedStep: number
  answers: Record<string, string>
  cadastro: {
    nomeCompleto: string
    empresa: string
    email: string
    whatsapp: string
  }
  autorizacaoDevolutiva: string
  formatoInteresse: string
  responsavelDocumentos: string
  savedAt: string
}

const DRAFT_PREFIX = 'vetor_questionnaire_draft_'

export function getSectorDraftKey(sectorId: string): string {
  return `${DRAFT_PREFIX}${sectorId}`
}

export function loadQuestionnaireDraft(sectorId: string): QuestionnaireDraftData | null {
  if (!sectorId) return null
  try {
    const raw = localStorage.getItem(getSectorDraftKey(sectorId))
    if (!raw) return null
    const parsed = JSON.parse(raw) as Partial<QuestionnaireDraftData>

    if (!parsed || parsed.sectorId !== sectorId) {
      return null
    }

    return {
      sectorId: parsed.sectorId,
      step: typeof parsed.step === 'number' ? parsed.step : 0,
      highestReachedStep:
        typeof parsed.highestReachedStep === 'number'
          ? parsed.highestReachedStep
          : typeof parsed.step === 'number'
            ? parsed.step
            : 0,
      answers: typeof parsed.answers === 'object' && parsed.answers !== null ? parsed.answers : {},
      cadastro: {
        nomeCompleto: parsed.cadastro?.nomeCompleto || '',
        empresa: parsed.cadastro?.empresa || '',
        email: parsed.cadastro?.email || '',
        whatsapp: parsed.cadastro?.whatsapp || '',
      },
      autorizacaoDevolutiva: parsed.autorizacaoDevolutiva || '',
      formatoInteresse: parsed.formatoInteresse || '',
      responsavelDocumentos: parsed.responsavelDocumentos || '',
      savedAt: parsed.savedAt || new Date().toISOString(),
    }
  } catch {
    return null
  }
}

export function saveQuestionnaireDraft(data: Omit<QuestionnaireDraftData, 'savedAt'>): void {
  if (!data.sectorId) return
  try {
    const payload: QuestionnaireDraftData = {
      ...data,
      savedAt: new Date().toISOString(),
    }
    localStorage.setItem(getSectorDraftKey(data.sectorId), JSON.stringify(payload))
  } catch {
    // localStorage indisponível ou quota excedida
  }
}

export function clearQuestionnaireDraft(sectorId: string): void {
  if (!sectorId) return
  try {
    localStorage.removeItem(getSectorDraftKey(sectorId))
  } catch {
    // localStorage indisponível
  }
}
