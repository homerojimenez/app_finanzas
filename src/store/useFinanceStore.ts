import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type {
  AnnualObligation,
  Budget,
  ExpenseCategory,
  HouseholdMember,
  IncomeSource,
  MonthlySnapshot,
  QuarterlyObligation,
  SavingsGoal,
  Transaction,
  UserSettings
} from '@/domain/types/finance';
import { demoProfiles, defaultCategories } from '@/data/demo/profiles';

export type DemoKey = keyof typeof demoProfiles;

export interface FinanceDataState {
  settings: UserSettings;
  incomes: IncomeSource[];
  categories: ExpenseCategory[];
  transactions: Transaction[];
  annual: AnnualObligation[];
  quarterly: QuarterlyObligation[];
  budgets: Budget[];
  goals: SavingsGoal[];
  snapshots: MonthlySnapshot[];
  household: HouseholdMember[];
}

interface FinanceState extends FinanceDataState {
  loadDemo: (key: DemoKey) => void;
  completeOnboarding: (settings: Partial<UserSettings>) => void;
  addTransaction: (tx: Transaction) => void;
  removeTransaction: (id: string) => void;
  addIncome: (income: IncomeSource) => void;
  toggleIncomeActive: (id: string) => void;
  toggleIncomeProjection: (id: string) => void;
  removeIncome: (id: string) => void;
  addCategory: (category: ExpenseCategory) => void;
  removeCategory: (id: string) => void;
  addGoal: (goal: SavingsGoal) => void;
  updateGoalAmount: (id: string, amount: number) => void;
  removeGoal: (id: string) => void;
  closeMonth: (snapshot: MonthlySnapshot) => void;
  restoreData: (payload: Partial<FinanceDataState>) => void;
  resetAll: () => void;
}

export const defaultSettings: UserSettings = {
  id: 'settings',
  language: 'es',
  currency: 'EUR',
  locale: 'es-ES',
  mode: 'personal',
  incomePattern: 'fixed',
  startDayOfMonth: 1,
  theme: 'light',
  onboardingCompleted: false
};

export const createInitialData = (): FinanceDataState => ({
  settings: defaultSettings,
  incomes: [],
  categories: defaultCategories,
  transactions: [],
  annual: [],
  quarterly: [],
  budgets: [],
  goals: [],
  snapshots: [],
  household: []
});

const applyDataFallbacks = (payload: Partial<FinanceDataState>): FinanceDataState => ({
  ...createInitialData(),
  ...payload,
  settings: { ...defaultSettings, ...(payload.settings ?? {}) },
  categories: payload.categories && payload.categories.length > 0 ? payload.categories : defaultCategories
});

const OTHER_CATEGORY_ID = 'cat-16';

export const useFinanceStore = create<FinanceState>()(
  persist(
    (set) => ({
      ...createInitialData(),
      loadDemo: (key) => set(() => ({ ...applyDataFallbacks(demoProfiles[key]), settings: { ...demoProfiles[key].settings, onboardingCompleted: true } })),
      completeOnboarding: (settings) => set((state) => ({ settings: { ...state.settings, ...settings, onboardingCompleted: true } })),
      addTransaction: (tx) => set((state) => ({ transactions: [tx, ...state.transactions] })),
      removeTransaction: (id) => set((state) => ({ transactions: state.transactions.filter((tx) => tx.id !== id) })),
      addIncome: (income) => set((state) => ({ incomes: [income, ...state.incomes] })),
      toggleIncomeActive: (id) => set((state) => ({ incomes: state.incomes.map((item) => item.id === id ? { ...item, active: !item.active } : item) })),
      toggleIncomeProjection: (id) => set((state) => ({ incomes: state.incomes.map((item) => item.id === id ? { ...item, includeInProjection: !item.includeInProjection } : item) })),
      removeIncome: (id) => set((state) => ({ incomes: state.incomes.filter((item) => item.id !== id) })),
      addCategory: (category) => set((state) => ({ categories: [...state.categories, category] })),
      removeCategory: (id) => set((state) => {
        if (id === OTHER_CATEGORY_ID) return state;
        return {
          categories: state.categories.filter((c) => c.id !== id),
          transactions: state.transactions.map((tx) => tx.categoryId === id ? { ...tx, categoryId: OTHER_CATEGORY_ID } : tx),
          budgets: state.budgets.filter((b) => b.categoryId !== id)
        };
      }),
      addGoal: (goal) => set((state) => ({ goals: [goal, ...state.goals] })),
      updateGoalAmount: (id, amount) => set((state) => ({ goals: state.goals.map((goal) => goal.id === id ? { ...goal, currentAmount: Math.max(0, amount) } : goal) })),
      removeGoal: (id) => set((state) => ({ goals: state.goals.filter((goal) => goal.id !== id) })),
      closeMonth: (snapshot) => set((state) => ({ snapshots: [snapshot, ...state.snapshots] })),
      restoreData: (payload) => set(() => applyDataFallbacks(payload)),
      resetAll: () => set(() => createInitialData())
    }),
    { name: 'finanzas-store-v1' }
  )
);
