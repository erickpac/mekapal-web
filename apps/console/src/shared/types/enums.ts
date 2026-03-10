export const UserRole = {
  CLIENT: 'CLIENT',
  TRANSPORTER: 'TRANSPORTER',
  ADMIN: 'ADMIN',
  BACKOFFICE: 'BACKOFFICE',
} as const
export type UserRole = (typeof UserRole)[keyof typeof UserRole]

export const TransporterStatus = {
  PENDING_DOCUMENTS: 'PENDING_DOCUMENTS',
  PENDING_REVIEW: 'PENDING_REVIEW',
  ACTIVE: 'ACTIVE',
  SUSPENDED: 'SUSPENDED',
} as const
export type TransporterStatus =
  (typeof TransporterStatus)[keyof typeof TransporterStatus]

export const VehicleType = {
  CAR: 'CAR',
  VAN: 'VAN',
  TRUCK: 'TRUCK',
  MOTORCYCLE: 'MOTORCYCLE',
} as const
export type VehicleType = (typeof VehicleType)[keyof typeof VehicleType]

export const VehicleStatus = {
  PENDING_REVIEW: 'PENDING_REVIEW',
  ACTIVE: 'ACTIVE',
  SUSPENDED: 'SUSPENDED',
} as const
export type VehicleStatus = (typeof VehicleStatus)[keyof typeof VehicleStatus]

export const LoadType = {
  LIGHT: 'LIGHT',
  HEAVY: 'HEAVY',
  BOTH: 'BOTH',
} as const
export type LoadType = (typeof LoadType)[keyof typeof LoadType]

export const CommissionType = {
  PERCENTAGE: 'PERCENTAGE',
  FIXED_AMOUNT: 'FIXED_AMOUNT',
} as const
export type CommissionType =
  (typeof CommissionType)[keyof typeof CommissionType]

export const OrderStatus = {
  CONFIRMED: 'CONFIRMED',
  IN_PROGRESS: 'IN_PROGRESS',
  PICKED_UP: 'PICKED_UP',
  IN_TRANSIT: 'IN_TRANSIT',
  DELIVERED: 'DELIVERED',
  COMPLETED: 'COMPLETED',
  CANCELLED: 'CANCELLED',
} as const
export type OrderStatus = (typeof OrderStatus)[keyof typeof OrderStatus]

export const SettlementStatus = {
  PENDING: 'PENDING',
  PAID: 'PAID',
} as const
export type SettlementStatus =
  (typeof SettlementStatus)[keyof typeof SettlementStatus]

export const IncidentStatus = {
  OPEN: 'OPEN',
  INVESTIGATING: 'INVESTIGATING',
  RESOLVED: 'RESOLVED',
  CLOSED: 'CLOSED',
} as const
export type IncidentStatus =
  (typeof IncidentStatus)[keyof typeof IncidentStatus]

export const IncidentType = {
  DELAY: 'DELAY',
  DAMAGE: 'DAMAGE',
  LOSS: 'LOSS',
  FRAUD: 'FRAUD',
  OTHER: 'OTHER',
} as const
export type IncidentType = (typeof IncidentType)[keyof typeof IncidentType]

export const IncidentSeverity = {
  LOW: 'LOW',
  MEDIUM: 'MEDIUM',
  HIGH: 'HIGH',
  CRITICAL: 'CRITICAL',
} as const
export type IncidentSeverity =
  (typeof IncidentSeverity)[keyof typeof IncidentSeverity]

export const IncidentResolution = {
  RESOLVED_SATISFACTORILY: 'RESOLVED_SATISFACTORILY',
  CLOSED_WITHOUT_RESOLUTION: 'CLOSED_WITHOUT_RESOLUTION',
} as const
export type IncidentResolution =
  (typeof IncidentResolution)[keyof typeof IncidentResolution]

export const UserAction = {
  NONE: 'NONE',
  WARNING: 'WARNING',
  SUSPENSION: 'SUSPENSION',
  BAN: 'BAN',
} as const
export type UserAction = (typeof UserAction)[keyof typeof UserAction]

export const BankAccountStatus = {
  PENDING_VERIFICATION: 'PENDING_VERIFICATION',
  VERIFIED: 'VERIFIED',
  REJECTED: 'REJECTED',
  SUSPENDED: 'SUSPENDED',
} as const
export type BankAccountStatus =
  (typeof BankAccountStatus)[keyof typeof BankAccountStatus]

export const AccountType = {
  CHECKING: 'CHECKING',
  SAVINGS: 'SAVINGS',
} as const
export type AccountType = (typeof AccountType)[keyof typeof AccountType]
