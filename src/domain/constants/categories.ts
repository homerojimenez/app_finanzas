import type { ExpenseCategory } from '@/domain/types/finance';

const names = ['Housing','Utilities','Groceries','Transport','Subscriptions','Insurance','Health','Education','Leisure','Family','Pets','Debt','Savings','Taxes','Business expenses','Other'];
export const defaultCategories: ExpenseCategory[] = names.map((name, i) => ({
  id: `cat-${i + 1}`,
  name,
  icon: 'Circle',
  color: ['#0ea5e9','#22c55e','#f59e0b','#6366f1','#ec4899'][i % 5],
  scope: name === 'Business expenses' || name === 'Taxes' ? 'business' : 'personal',
  archived: false,
  sortOrder: i
}));
