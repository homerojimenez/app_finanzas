import Dexie, { type Table } from 'dexie';
import type { AnnualObligation, Budget, ExpenseCategory, HouseholdMember, IncomeSource, MonthlySnapshot, QuarterlyObligation, SavingsGoal, Transaction, UserSettings } from '@/domain/types/finance';

export class FinanzasDB extends Dexie {
  settings!: Table<UserSettings, string>;
  incomes!: Table<IncomeSource, string>;
  categories!: Table<ExpenseCategory, string>;
  transactions!: Table<Transaction, string>;
  annual!: Table<AnnualObligation, string>;
  quarterly!: Table<QuarterlyObligation, string>;
  budgets!: Table<Budget, string>;
  goals!: Table<SavingsGoal, string>;
  snapshots!: Table<MonthlySnapshot, string>;
  household!: Table<HouseholdMember, string>;

  constructor() {
    super('finanzas-db');
    this.version(1).stores({
      settings: 'id', incomes: 'id,active', categories: 'id,archived', transactions: 'id,date,categoryId,type',
      annual: 'id,dueDate', quarterly: 'id,nextDueDate', budgets: 'id,month,categoryId', goals: 'id,targetDate', snapshots: 'id,month', household: 'id'
    });
  }
}

export const db = new FinanzasDB();
