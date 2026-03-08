export const formatCurrency = (amount: number, currency = 'EUR', locale = 'es-ES') =>
  new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
    maximumFractionDigits: 0
  }).format(Number.isFinite(amount) ? amount : 0);

export const sentenceType = (type: string) =>
  type
    .split('_').join(' ')
    .replace('recurring fixed expense', 'gasto fijo')
    .replace('variable expense', 'gasto variable')
    .replace('one time expense', 'gasto puntual')
    .replace('quarterly expense', 'gasto trimestral')
    .replace('annual expense', 'gasto anual');
