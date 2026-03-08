export type UserProfileMode = 'personal' | 'household' | 'freelancer' | 'self_employed';
export type IncomePattern = 'fixed' | 'mixed' | 'variable';
export type Scope = 'personal' | 'business' | 'shared';
export type Frequency = 'monthly' | 'biweekly' | 'quarterly' | 'yearly' | 'one_time';
export type TransactionType =
  | 'recurring_fixed_expense'
  | 'variable_expense'
  | 'annual_expense'
  | 'quarterly_expense'
  | 'one_time_expense'
  | 'income'
  | 'transfer_to_savings'
  | 'reserve_movement';

export interface UserSettings {
  id: string;
  language: string;
  currency: string;
  locale: string;
  mode: UserProfileMode;
  incomePattern: IncomePattern;
  startDayOfMonth: number;
  theme: 'light' | 'dark' | 'system';
  onboardingCompleted: boolean;
}

export interface AppPreferences {
  showHints: boolean;
  compactMode: boolean;
  riskAlerts: boolean;
}

export interface IncomeSource {
  id: string;
  name: string;
  type: 'fixed' | 'variable';
  scope: Scope;
  frequency: Frequency;
  expectedAmount: number;
  expectedDate: string;
  notes?: string;
  active: boolean;
  irregular?: boolean;
  includeInProjection: boolean;
}

export interface ExpenseCategory {
  id: string;
  name: string;
  icon: string;
  color: string;
  scope: Scope;
  archived: boolean;
  sortOrder: number;
}

export interface RecurringRule {
  frequency: Frequency;
  interval: number;
  dayOfMonth?: number;
  monthOfYear?: number;
}

export interface Transaction {
  id: string;
  type: TransactionType;
  amount: number;
  date: string;
  categoryId: string;
  notes?: string;
  recurrence?: RecurringRule;
  status: 'planned' | 'paid';
  shared: boolean;
  scope: Scope;
  tags?: string[];
  whoPaid?: string;
  splitStatus?: 'pending' | 'settled';
}

export interface AnnualObligation {
  id: string;
  title: string;
  amount: number;
  dueDate: string;
  categoryId: string;
  createdAt: string;
}

export interface QuarterlyObligation {
  id: string;
  title: string;
  amount: number;
  nextDueDate: string;
  categoryId: string;
  reserveMode: 'fixed' | 'percentage';
  reserveValue: number;
}

export interface Budget {
  id: string;
  categoryId: string;
  month: string;
  amount: number;
}

export interface SavingsGoal {
  id: string;
  title: string;
  targetAmount: number;
  targetDate: string;
  currentAmount: number;
  linkedCategoryId?: string;
}

export interface MonthlySnapshot {
  id: string;
  month: string;
  income: number;
  expenses: number;
  reserves: number;
  savings: number;
  available: number;
  closedAt: string;
}

export interface HouseholdMember {
  id: string;
  name: string;
  color: string;
}

export interface Recommendation {
  id: string;
  severity: 'info' | 'warning' | 'risk';
  message: string;
  createdAt: string;
}

export interface ImportJob {
  id: string;
  type: 'csv' | 'json';
  createdAt: string;
  status: 'pending' | 'completed' | 'failed';
  errors?: string[];
}
