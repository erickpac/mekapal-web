import { apiClient } from '@/shared/api/client'

export type LocationLevel = 'country' | 'state' | 'municipality' | 'zone'

export interface LocationItem {
  id: string
  name: string
  active: boolean
}

export interface LocationFormData {
  name: string
  active: boolean
}

export async function getCountries(): Promise<LocationItem[]> {
  const { data } = await apiClient.get<LocationItem[]>('/locations/countries')
  return data
}

export async function createCountry(
  payload: LocationFormData,
): Promise<LocationItem> {
  const { data } = await apiClient.post<LocationItem>(
    '/locations/countries',
    payload,
  )
  return data
}

export async function updateCountry(
  id: string,
  payload: LocationFormData,
): Promise<LocationItem> {
  const { data } = await apiClient.put<LocationItem>(
    `/locations/countries/${id}`,
    payload,
  )
  return data
}

export async function deleteCountry(id: string): Promise<void> {
  await apiClient.delete(`/locations/countries/${id}`)
}

export async function getStates(countryId: string): Promise<LocationItem[]> {
  const { data } = await apiClient.get<LocationItem[]>(
    `/locations/countries/${countryId}/states`,
  )
  return data
}

export async function createState(
  countryId: string,
  payload: LocationFormData,
): Promise<LocationItem> {
  const { data } = await apiClient.post<LocationItem>(
    `/locations/countries/${countryId}/states`,
    payload,
  )
  return data
}

export async function updateState(
  id: string,
  payload: LocationFormData,
): Promise<LocationItem> {
  const { data } = await apiClient.put<LocationItem>(
    `/locations/states/${id}`,
    payload,
  )
  return data
}

export async function deleteState(id: string): Promise<void> {
  await apiClient.delete(`/locations/states/${id}`)
}

export async function getMunicipalities(
  stateId: string,
): Promise<LocationItem[]> {
  const { data } = await apiClient.get<LocationItem[]>(
    `/locations/states/${stateId}/municipalities`,
  )
  return data
}

export async function createMunicipality(
  stateId: string,
  payload: LocationFormData,
): Promise<LocationItem> {
  const { data } = await apiClient.post<LocationItem>(
    `/locations/states/${stateId}/municipalities`,
    payload,
  )
  return data
}

export async function updateMunicipality(
  id: string,
  payload: LocationFormData,
): Promise<LocationItem> {
  const { data } = await apiClient.put<LocationItem>(
    `/locations/municipalities/${id}`,
    payload,
  )
  return data
}

export async function deleteMunicipality(id: string): Promise<void> {
  await apiClient.delete(`/locations/municipalities/${id}`)
}

export async function getZones(municipalityId: string): Promise<LocationItem[]> {
  const { data } = await apiClient.get<LocationItem[]>(
    `/locations/municipalities/${municipalityId}/zones`,
  )
  return data
}

export async function createZone(
  municipalityId: string,
  payload: LocationFormData,
): Promise<LocationItem> {
  const { data } = await apiClient.post<LocationItem>(
    `/locations/municipalities/${municipalityId}/zones`,
    payload,
  )
  return data
}

export async function updateZone(
  id: string,
  payload: LocationFormData,
): Promise<LocationItem> {
  const { data } = await apiClient.put<LocationItem>(
    `/locations/zones/${id}`,
    payload,
  )
  return data
}

export async function deleteZone(id: string): Promise<void> {
  await apiClient.delete(`/locations/zones/${id}`)
}
