import { addMonths, differenceInCalendarMonths, endOfMonth, format, isAfter, isBefore, parseISO, startOfMonth } from 'date-fns';
import type { AnnualObligation, Budget, QuarterlyObligation, Transaction } from '@/domain/types/finance';

export const monthKey = (date = new Date()) => `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;

export const expandRecurringRule = (tx: Transaction, months = 3): Transaction[] => {
  if (!tx.recurrence) return [tx];
  return Array.from({ length: months }).map((_, i) => ({ ...tx, id: `${tx.id}-${i}`, date: addMonths(parseISO(tx.date), i).toISOString() }));
};

export const calculateAnnualReserve = (item: AnnualObligation, now = new Date()) => {
  const createdMonth = startOfMonth(parseISO(item.createdAt));
  const dueMonth = startOfMonth(parseISO(item.dueDate));
  const currentMonth = startOfMonth(now);
  const planningMonth = isAfter(createdMonth, currentMonth) ? createdMonth : currentMonth;

  const totalMonths = Math.max(1, differenceInCalendarMonths(dueMonth, createdMonth) + 1);
  const monthlyReserve = item.amount / totalMonths;
  const monthsElapsed = Math.max(0, differenceInCalendarMonths(planningMonth, createdMonth) + 1);
  const shouldReservedByNow = Math.min(item.amount, monthsElapsed * monthlyReserve);
  const remaining = Math.max(0, item.amount - shouldReservedByNow);
  const monthsLeft = Math.max(1, differenceInCalendarMonths(dueMonth, planningMonth) + 1);
  const progressPercent = item.amount > 0 ? Math.min(100, (shouldReservedByNow / item.amount) * 100) : 0;
  const adjustedMonthlyNeeded = remaining / monthsLeft;

  return {
    monthlyReserve,
    shouldReservedByNow,
    dueLabel: format(parseISO(item.dueDate), 'MMM yyyy'),
    monthsLeft,
    remaining,
    progressPercent,
    adjustedMonthlyNeeded,
    isTight: adjustedMonthlyNeeded > monthlyReserve * 1.1
  };
};

export const calculateQuarterlyReserve = (item: QuarterlyObligation, monthlyIncome = 0, now = new Date()) => {
  const dueMonth = startOfMonth(parseISO(item.nextDueDate));
  const currentMonth = startOfMonth(now);
  const monthsLeft = Math.max(1, differenceInCalendarMonths(dueMonth, currentMonth) + 1);

  const expectedAmount = item.reserveMode === 'percentage' ? monthlyIncome * 3 * (item.reserveValue / 100) : item.amount;
  const recommendedMonthly = expectedAmount / 3;
  const shouldReservedByNow = Math.max(0, (3 - monthsLeft) * recommendedMonthly);

  return {
    monthsLeft,
    expectedAmount,
    recommendedMonthly,
    shouldReservedByNow,
    reserveGap: Math.max(0, expectedAmount - shouldReservedByNow),
    nextDueQuarter: `${dueMonth.getFullYear()} T${Math.floor(dueMonth.getMonth() / 3) + 1}`
  };
};

export const aggregateCategorySpending = (transactions: Transaction[], month: string) =>
  transactions
    .filter((tx) => tx.date.slice(0, 7) === month && tx.type.includes('expense'))
    .reduce<Record<string, number>>((acc, tx) => ({ ...acc, [tx.categoryId]: (acc[tx.categoryId] ?? 0) + tx.amount }), {});

export const detectBudgetHealth = (spent: number, budget: number) => {
  if (budget <= 0) return 'healthy';
  const ratio = spent / budget;
  if (ratio > 1) return 'exceeded';
  if (ratio > 0.85) return 'close_to_limit';
  return 'healthy';
};

export const upcomingPayments = (transactions: Transaction[], days = 20, now = new Date()) => {
  const limit = endOfMonth(now);
  return transactions.filter((tx) => {
    const date = parseISO(tx.date);
    return isAfter(date, now) && isBefore(date, limit) && tx.status === 'planned';
  }).slice(0, days);
};

export const projectedSavings = (income: number, expenses: number, reserves: number) => income - expenses - reserves;
export const availableToSpend = (income: number, committed: number, reserves: number, spent: number) => income - committed - reserves - spent;

export const monthProjection = (
  transactions: Transaction[],
  annual: AnnualObligation[],
  quarterly: QuarterlyObligation[],
  month: string,
  expectedIncome: number,
  now = new Date()
) => {
  const monthTx = transactions.filter((t) => t.date.slice(0, 7) === month);
  const fixed = monthTx.filter((t) => t.type === 'recurring_fixed_expense').reduce((a, b) => a + b.amount, 0);
  const variable = monthTx.filter((t) => t.type === 'variable_expense' || t.type === 'one_time_expense').reduce((a, b) => a + b.amount, 0);
  const receivedIncome = monthTx.filter((t) => t.type === 'income' && t.status === 'paid').reduce((a, b) => a + b.amount, 0);

  const annualReserve = annual.reduce((acc, item) => acc + calculateAnnualReserve(item, now).monthlyReserve, 0);
  const quarterlyReserve = quarterly.reduce((acc, item) => acc + calculateQuarterlyReserve(item, expectedIncome, now).recommendedMonthly, 0);
  const committed = fixed + annualReserve + quarterlyReserve;

  return {
    fixed,
    variable,
    annualReserve,
    quarterlyReserve,
    committed,
    receivedIncome,
    projectedEndOfMonth: expectedIncome - fixed - variable - annualReserve - quarterlyReserve,
    available: availableToSpend(expectedIncome, fixed, annualReserve + quarterlyReserve, variable)
  };
};

export const snapshotFromMonth = (month: string, income: number, expenses: number, reserves: number) => ({
  id: crypto.randomUUID(),
  month,
  income,
  expenses,
  reserves,
  savings: projectedSavings(income, expenses, reserves),
  available: income - expenses - reserves,
  closedAt: new Date().toISOString()
});

export const recommendationsFromData = (params: {
  income: number;
  fixed: number;
  reserve: number;
  upcoming: number;
  projected: number;
  variable: number;
}) => {
  const tips: string[] = [];
  if (params.income > 0 && params.fixed / params.income >= 0.55) tips.push(`Tus gastos fijos se comen ${Math.round((params.fixed / params.income) * 100)}% de lo que entra.`);
  if (params.reserve > 0) tips.push(`Te conviene apartar ${params.reserve.toFixed(0)}€ este mes para pagos anuales y trimestrales.`);
  if (params.variable > 0 && params.income > 0 && params.variable / params.income > 0.3) tips.push('Tu gasto variable va alto para este punto del mes.');
  if (params.upcoming >= 3) tips.push(`Tienes ${params.upcoming} pagos próximos: revisa liquidez.`);
  if (params.projected < 0) tips.push('Cierre previsto en negativo. Reduce gasto opcional o mueve pagos no urgentes.');
  if (tips.length === 0) tips.push('Mes estable: mantén esta planificación.');
  return tips;
};

export const normalizeCurrency = (amount: number) => Math.round(amount * 100) / 100;
export const mergeCategoryUsage = (transactions: Transaction[], fromId: string, toId: string) => transactions.map((tx) => tx.categoryId === fromId ? { ...tx, categoryId: toId } : tx);
export const budgetProgress = (budgets: Budget[], spentByCat: Record<string, number>) => budgets.map((b) => ({ ...b, spent: spentByCat[b.categoryId] ?? 0, status: detectBudgetHealth(spentByCat[b.categoryId] ?? 0, b.amount) }));
