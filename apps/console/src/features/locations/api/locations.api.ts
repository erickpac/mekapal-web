import { apiClient } from '@/shared/api/client'

export type LocationLevel = 'country' | 'state' | 'municipality' | 'zone'

export interface Country {
  id: string
  name: string
  code: string
  isActive: boolean
  createdAt: string
  updatedAt: string
}

export interface State {
  id: string
  name: string
  code: string
  isActive: boolean
  countryId: string
  createdAt: string
  updatedAt: string
}

export interface Municipality {
  id: string
  name: string
  code: string
  isActive: boolean
  stateId: string
  createdAt: string
  updatedAt: string
}

export interface Zone {
  id: string
  name: string
  code: string
  isActive: boolean
  municipalityId: string
  latitude: number | null
  longitude: number | null
  polygon: unknown | null
  createdAt: string
  updatedAt: string
}

export type LocationItem = Country | State | Municipality | Zone

export interface CountryFormData {
  name: string
  code: string
}

export interface StateFormData {
  name: string
  code: string
  countryId: string
}

export interface MunicipalityFormData {
  name: string
  code: string
  stateId: string
}

export interface ZoneFormData {
  name: string
  code: string
  municipalityId: string
  latitude?: number
  longitude?: number
}

export interface LocationFormData {
  name: string
  code: string
  latitude?: number
  longitude?: number
}

// --- Countries ---

export async function getCountries(activeOnly = true): Promise<Country[]> {
  const { data } = await apiClient.get<Country[]>('/locations/countries', {
    params: { activeOnly },
  })
  return data
}

export async function createCountry(
  payload: CountryFormData,
): Promise<Country> {
  const { data } = await apiClient.post<Country>(
    '/locations/countries',
    payload,
  )
  return data
}

export async function updateCountry(
  id: string,
  payload: Partial<CountryFormData>,
): Promise<Country> {
  const { data } = await apiClient.put<Country>(
    `/locations/countries/${id}`,
    payload,
  )
  return data
}

export async function toggleCountryStatus(id: string): Promise<Country> {
  const { data } = await apiClient.patch<Country>(
    `/locations/countries/${id}/toggle-status`,
  )
  return data
}

// --- States ---

export async function getStates(
  countryId: string,
  activeOnly = true,
): Promise<State[]> {
  const { data } = await apiClient.get<State[]>('/locations/states', {
    params: { countryId, activeOnly },
  })
  return data
}

export async function createState(payload: StateFormData): Promise<State> {
  const { data } = await apiClient.post<State>('/locations/states', payload)
  return data
}

export async function updateState(
  id: string,
  payload: Partial<Pick<StateFormData, 'name' | 'code'>>,
): Promise<State> {
  const { data } = await apiClient.put<State>(
    `/locations/states/${id}`,
    payload,
  )
  return data
}

export async function toggleStateStatus(id: string): Promise<State> {
  const { data } = await apiClient.patch<State>(
    `/locations/states/${id}/toggle-status`,
  )
  return data
}

// --- Municipalities ---

export async function getMunicipalities(
  stateId: string,
  activeOnly = true,
): Promise<Municipality[]> {
  const { data } = await apiClient.get<Municipality[]>(
    '/locations/municipalities',
    { params: { stateId, activeOnly } },
  )
  return data
}

export async function createMunicipality(
  payload: MunicipalityFormData,
): Promise<Municipality> {
  const { data } = await apiClient.post<Municipality>(
    '/locations/municipalities',
    payload,
  )
  return data
}

export async function updateMunicipality(
  id: string,
  payload: Partial<Pick<MunicipalityFormData, 'name' | 'code'>>,
): Promise<Municipality> {
  const { data } = await apiClient.put<Municipality>(
    `/locations/municipalities/${id}`,
    payload,
  )
  return data
}

export async function toggleMunicipalityStatus(
  id: string,
): Promise<Municipality> {
  const { data } = await apiClient.patch<Municipality>(
    `/locations/municipalities/${id}/toggle-status`,
  )
  return data
}

// --- Zones ---

export async function getZones(
  municipalityId: string,
  activeOnly = true,
): Promise<Zone[]> {
  const { data } = await apiClient.get<Zone[]>(
    '/locations/zones/by-municipality',
    { params: { municipalityId, activeOnly } },
  )
  return data
}

export async function searchZones(
  search: string,
  activeOnly = true,
): Promise<Zone[]> {
  const { data } = await apiClient.get<Zone[]>('/locations/zones', {
    params: { search, activeOnly },
  })
  return data
}

export async function createZone(payload: ZoneFormData): Promise<Zone> {
  const { data } = await apiClient.post<Zone>('/locations/zones', payload)
  return data
}

export async function updateZone(
  id: string,
  payload: Partial<Pick<ZoneFormData, 'name' | 'code' | 'latitude' | 'longitude'>>,
): Promise<Zone> {
  const { data } = await apiClient.put<Zone>(
    `/locations/zones/${id}`,
    payload,
  )
  return data
}

export async function toggleZoneStatus(id: string): Promise<Zone> {
  const { data } = await apiClient.patch<Zone>(
    `/locations/zones/${id}/toggle-status`,
  )
  return data
}
