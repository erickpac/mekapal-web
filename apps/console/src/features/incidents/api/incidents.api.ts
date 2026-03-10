import { apiClient } from '@/shared/api/client'
import type { PaginatedResponse } from '@/features/validations/api/validations.api'

export type IncidentStatus = 'OPEN' | 'INVESTIGATING' | 'RESOLVED'
export type IncidentSeverity = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL'
export type IncidentType = 'DAMAGE' | 'DELAY' | 'LOSS' | 'FRAUD' | 'OTHER'
export type UserAction = 'WARNING' | 'SUSPENSION' | 'BAN'

export interface IncidentItem {
  id: string
  type: IncidentType
  severity: IncidentSeverity
  status: IncidentStatus
  description: string
  reportedBy: string
  date: string
}

export interface TimelineEntry {
  id: string
  status: IncidentStatus
  note: string
  createdAt: string
  createdBy: string
}

export interface IncidentDetail extends IncidentItem {
  orderId: string
  orderDescription: string
  reporterEmail: string
  reporterPhone: string
  evidence: string[]
  timeline: TimelineEntry[]
}

export interface IncidentStats {
  open: number
  investigating: number
  resolved: number
}

export interface IncidentFilters {
  status?: IncidentStatus
  severity?: IncidentSeverity
  type?: IncidentType
  page?: number
  pageSize?: number
}

export interface UpdateIncidentData {
  status?: IncidentStatus
  notes?: string
}

export interface ResolveIncidentData {
  resolutionNotes: string
  refundAmount?: number
  userAction: UserAction
}

export async function getIncidents(
  filters: IncidentFilters,
): Promise<PaginatedResponse<IncidentItem>> {
  const { data } = await apiClient.get<PaginatedResponse<IncidentItem>>(
    '/incidents',
    { params: filters },
  )
  return data
}

export async function getIncident(id: string): Promise<IncidentDetail> {
  const { data } = await apiClient.get<IncidentDetail>(`/incidents/${id}`)
  return data
}

export async function updateIncident(
  id: string,
  payload: UpdateIncidentData,
): Promise<void> {
  await apiClient.patch(`/incidents/${id}`, payload)
}

export async function resolveIncident(
  id: string,
  payload: ResolveIncidentData,
): Promise<void> {
  await apiClient.post(`/incidents/${id}/resolve`, payload)
}

export async function getIncidentStats(): Promise<IncidentStats> {
  const { data } = await apiClient.get<IncidentStats>('/incidents/stats')
  return data
}
