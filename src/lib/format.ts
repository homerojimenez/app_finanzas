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

export const emojiByType = (type: string) => {
  const map: Record<string, string> = {
    income: '💸',
    recurring_fixed_expense: '🏠',
    variable_expense: '🛒',
    one_time_expense: '⚡',
    annual_expense: '📅',
    quarterly_expense: '🧾',
    transfer_to_savings: '🏦',
    reserve_movement: '🛡️'
  };
  return map[type] ?? '💰';
};

export const emojiByCategoryName = (name: string) => {
  const n = name.toLowerCase();
  if (n.includes('housing')) return '🏠';
  if (n.includes('groceries')) return '🛒';
  if (n.includes('transport')) return '🚗';
  if (n.includes('health')) return '🏥';
  if (n.includes('leisure')) return '🎉';
  if (n.includes('tax')) return '🧾';
  if (n.includes('savings')) return '🏦';
  if (n.includes('business')) return '💼';
  return '📁';
};
