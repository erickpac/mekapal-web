const LOCALE = 'es-GT'

export function formatCurrency(value: number) {
  return value.toLocaleString(LOCALE, {
    style: 'currency',
    currency: 'GTQ',
  })
}

export function formatDate(
  value: string | Date,
  options?: Intl.DateTimeFormatOptions,
) {
  return new Date(value).toLocaleDateString(LOCALE, options)
}

export function formatNumber(value: number) {
  return value.toLocaleString(LOCALE)
}
