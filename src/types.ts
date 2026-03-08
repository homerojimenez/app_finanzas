import type { useFinanceStore } from '@/store/useFinanceStore';

export type FinanceState = ReturnType<typeof useFinanceStore.getState>;
