import { apiClient } from '@/shared/api/client'
import type {
  IncidentResolution,
  IncidentSeverity,
  IncidentStatus,
  IncidentType,
  UserAction,
} from '@/shared/types'

export interface Incident {
  id: string
  incidentNumber: string
  type: IncidentType
  severity: IncidentSeverity
  status: IncidentStatus
  description: string
  evidenceUrls: string[]
  internalNotes: string | null
  resolution: IncidentResolution | null
  resolutionNotes: string | null
  refundAmount: number | null
  userAction: UserAction
  resolvedAt: string | null
  reportedById: string
  reportedAgainstId: string
  orderId: string
  assignedToId: string | null
  createdAt: string
  updatedAt: string
}

export interface IncidentStats {
  total: number
  open: number
  investigating: number
  resolved: number
  closed: number
}

export interface IncidentFilters {
  status?: IncidentStatus
  severity?: IncidentSeverity
  type?: IncidentType
  reportedById?: string
  reportedAgainstId?: string
  assignedToId?: string
  orderId?: string
  fromDate?: string
  toDate?: string
  limit?: number
  offset?: number
}

export interface UpdateIncidentData {
  status?: IncidentStatus
  severity?: IncidentSeverity
  internalNotes?: string
  assignedToId?: string
}

export interface ResolveIncidentData {
  resolution: IncidentResolution
  resolutionNotes: string
  refundAmount?: number
  userAction?: UserAction
}

export async function getIncidents(
  filters: IncidentFilters,
): Promise<Incident[]> {
  const { data } = await apiClient.get<Incident[]>('/incidents', {
    params: filters,
  })
  return data
}

export async function getIncident(id: string): Promise<Incident> {
  const { data } = await apiClient.get<Incident>(`/incidents/${id}`)
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
