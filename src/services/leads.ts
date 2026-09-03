import pb from '@/lib/pocketbase/client'
import type { RecordModel } from 'pocketbase'

export interface LeadCadastro {
  nomeCompleto?: string
  empresa?: string
  email?: string
  whatsapp?: string
  cnpj?: string
  faturamento?: string
  cargo?: string
  [key: string]: unknown
}

export type LeadStatus = 'novo' | 'em_analise' | 'devolutiva_agendada' | 'concluido' | 'descartado'

export interface LeadRecord extends RecordModel {
  id: string
  created: string
  updated: string
  setor: string
  setor_id?: string
  cadastro: LeadCadastro | string
  respostas: Record<string, unknown> | string
  contrato_social?: string[]
  certificacoes?: string[]
  documentacao_adicional?: string[]
  autorizacao_devolutiva?: 'Sim, autorizo' | 'Não autorizo' | string
  formato_interesse?: 'MaaS' | 'Híbrido' | 'CaaS' | 'Ainda não sei' | string
  responsavel_documentos?: string
  status?: LeadStatus
}

export function parseLeadCadastro(lead: LeadRecord): LeadCadastro {
  if (!lead.cadastro) return {}
  if (typeof lead.cadastro === 'string') {
    try {
      return JSON.parse(lead.cadastro) as LeadCadastro
    } catch {
      return {}
    }
  }
  return lead.cadastro
}

export function parseLeadRespostas(lead: LeadRecord): Record<string, unknown> {
  if (!lead.respostas) return {}
  if (typeof lead.respostas === 'string') {
    try {
      return JSON.parse(lead.respostas) as Record<string, unknown>
    } catch {
      return {}
    }
  }
  return lead.respostas
}

export function getFileUrl(record: RecordModel, filename: string): string {
  return pb.files.getURL(record, filename)
}

export async function fetchLeads(options?: {
  filter?: string
  sort?: string
  page?: number
  perPage?: number
}): Promise<{ items: LeadRecord[]; totalItems: number; totalPages: number }> {
  const result = await pb
    .collection('leads')
    .getList<LeadRecord>(options?.page || 1, options?.perPage || 100, {
      sort: options?.sort || '-created',
      filter: options?.filter || '',
    })
  return result
}

export async function fetchLeadById(id: string): Promise<LeadRecord> {
  return await pb.collection('leads').getOne<LeadRecord>(id)
}

export async function updateLeadStatus(id: string, status: LeadStatus): Promise<LeadRecord> {
  return await pb.collection('leads').update<LeadRecord>(id, { status })
}
