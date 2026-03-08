import { monthProjection, monthKey, recommendationsFromData, upcomingPayments } from '@/domain/logic/calculations';
import type { FinanceState } from '@/types';

export const getExpectedIncome = (state: FinanceState) =>
  state.incomes.filter((income) => income.active && income.includeInProjection).reduce((acc, income) => acc + income.expectedAmount, 0);

export const getCurrentMonthProjection = (state: FinanceState) => {
  const month = monthKey();
  return monthProjection(state.transactions, state.annual, state.quarterly, month, getExpectedIncome(state));
};

export const getRecommendations = (state: FinanceState) => {
  const projection = getCurrentMonthProjection(state);
  return recommendationsFromData({
    income: getExpectedIncome(state),
    fixed: projection.fixed,
    reserve: projection.annualReserve + projection.quarterlyReserve,
    variable: projection.variable,
    upcoming: upcomingPayments(state.transactions).length,
    projected: projection.projectedEndOfMonth
  });
};
