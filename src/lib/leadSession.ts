export interface StoredQuestionnaireLead {
  leadId: string
  empresa: string
  nomeCompleto: string
  email: string
  setor: string
  submittedAt: string
  planoEscolhido?: string
  statusDevolutiva?: 'aguardando' | 'agendada' | 'concluida'
}

const STORAGE_KEY = 'vetormaster_submitted_lead'
const CHOSEN_PLAN_KEY = 'vetormaster_chosen_plan'
const SESSION_CHOSEN_PLAN_KEY = 'vetor_chosen_plan'

export function getStoredLead(): StoredQuestionnaireLead | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return null
    return JSON.parse(raw) as StoredQuestionnaireLead
  } catch {
    return null
  }
}

export function saveStoredLead(lead: StoredQuestionnaireLead): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(lead))
  } catch {
    // localStorage unavailable or full
  }
}

export function getChosenPlan(): string | null {
  try {
    return (
      sessionStorage.getItem(SESSION_CHOSEN_PLAN_KEY) ||
      localStorage.getItem(CHOSEN_PLAN_KEY) ||
      null
    )
  } catch {
    return null
  }
}

export function saveChosenPlan(planName: string): void {
  try {
    sessionStorage.setItem(SESSION_CHOSEN_PLAN_KEY, planName)
    localStorage.setItem(CHOSEN_PLAN_KEY, planName)
    // Se já houver lead salvo, atualizar nele também
    const lead = getStoredLead()
    if (lead) {
      lead.planoEscolhido = planName
      saveStoredLead(lead)
    }
  } catch {
    // storage unavailable
  }
}
