import type {
  AnnualObligation,
  Budget,
  HouseholdMember,
  IncomeSource,
  QuarterlyObligation,
  SavingsGoal,
  Transaction,
  UserSettings
} from '@/domain/types/finance';
import { defaultCategories } from '@/domain/constants/categories';

const now = new Date();
const year = now.getFullYear();
const month = String(now.getMonth() + 1).padStart(2, '0');
const ym = `${year}-${month}`;

const tx = (id: string, type: Transaction['type'], amount: number, day: number, categoryId: string, status: Transaction['status'], scope: Transaction['scope'], shared = false): Transaction => ({
  id,
  type,
  amount,
  date: `${ym}-${String(day).padStart(2, '0')}`,
  categoryId,
  status,
  shared,
  scope
});

export const demoProfiles = {
  salaried: {
    settings: { id: 'settings', language: 'es', currency: 'EUR', locale: 'es-ES', mode: 'personal', incomePattern: 'fixed', startDayOfMonth: 1, theme: 'light', onboardingCompleted: true } as UserSettings,
    incomes: [
      { id: 'inc1', name: 'Nómina principal', type: 'fixed', scope: 'personal', frequency: 'monthly', expectedAmount: 2450, expectedDate: `${ym}-01`, active: true, includeInProjection: true } as IncomeSource
    ],
    transactions: [
      tx('s1', 'income', 2450, 1, 'cat-16', 'paid', 'personal'),
      tx('s2', 'recurring_fixed_expense', 890, 3, 'cat-1', 'paid', 'personal'),
      tx('s3', 'recurring_fixed_expense', 62, 6, 'cat-5', 'paid', 'personal'),
      tx('s4', 'variable_expense', 286, 8, 'cat-3', 'paid', 'personal'),
      tx('s5', 'variable_expense', 85, 18, 'cat-9', 'planned', 'personal')
    ],
    annual: [{ id: 'a1', title: 'Seguro del coche', amount: 760, dueDate: `${year}-11-15`, categoryId: 'cat-6', createdAt: `${year}-01-01` }] as AnnualObligation[],
    quarterly: [],
    budgets: [{ id: 'b1', categoryId: 'cat-3', month: ym, amount: 420 }, { id: 'b2', categoryId: 'cat-9', month: ym, amount: 140 }] as Budget[],
    goals: [{ id: 'g1', title: 'Fondo de emergencia', targetAmount: 6000, targetDate: `${year}-12-31`, currentAmount: 2100 }] as SavingsGoal[],
    household: [] as HouseholdMember[]
  },
  household: {
    settings: { id: 'settings', language: 'es', currency: 'EUR', locale: 'es-ES', mode: 'household', incomePattern: 'mixed', startDayOfMonth: 1, theme: 'light', onboardingCompleted: true } as UserSettings,
    incomes: [
      { id: 'inc2', name: 'Nómina Ana', type: 'fixed', scope: 'shared', frequency: 'monthly', expectedAmount: 2200, expectedDate: `${ym}-01`, active: true, includeInProjection: true },
      { id: 'inc3', name: 'Nómina Luis', type: 'fixed', scope: 'shared', frequency: 'monthly', expectedAmount: 1850, expectedDate: `${ym}-03`, active: true, includeInProjection: true }
    ] as IncomeSource[],
    transactions: [
      tx('h1', 'income', 2200, 1, 'cat-16', 'paid', 'shared', true),
      tx('h2', 'income', 1850, 3, 'cat-16', 'paid', 'shared', true),
      { ...tx('h3', 'recurring_fixed_expense', 1280, 2, 'cat-1', 'paid', 'shared', true), whoPaid: 'Ana', splitStatus: 'pending' },
      { ...tx('h4', 'variable_expense', 410, 9, 'cat-3', 'paid', 'shared', true), whoPaid: 'Luis', splitStatus: 'pending' },
      tx('h5', 'recurring_fixed_expense', 115, 16, 'cat-2', 'planned', 'shared', true)
    ],
    annual: [{ id: 'ha1', title: 'Seguro hogar', amount: 420, dueDate: `${year}-09-10`, categoryId: 'cat-6', createdAt: `${year}-01-01` }],
    quarterly: [],
    budgets: [{ id: 'hb1', categoryId: 'cat-3', month: ym, amount: 650 }],
    goals: [{ id: 'hg1', title: 'Vacaciones de verano', targetAmount: 3200, targetDate: `${year}-08-20`, currentAmount: 1250 }],
    household: [{ id: 'm1', name: 'Ana', color: '#0ea5e9' }, { id: 'm2', name: 'Luis', color: '#22c55e' }]
  },
  freelancer: {
    settings: { id: 'settings', language: 'es', currency: 'EUR', locale: 'es-ES', mode: 'freelancer', incomePattern: 'variable', startDayOfMonth: 1, theme: 'light', onboardingCompleted: true } as UserSettings,
    incomes: [
      { id: 'fi1', name: 'Cliente tienda online', type: 'variable', scope: 'business', frequency: 'one_time', expectedAmount: 1500, expectedDate: `${ym}-08`, active: true, irregular: true, includeInProjection: true },
      { id: 'fi2', name: 'Mantenimiento web', type: 'variable', scope: 'business', frequency: 'monthly', expectedAmount: 600, expectedDate: `${ym}-20`, active: true, irregular: true, includeInProjection: true }
    ],
    transactions: [
      tx('f1', 'income', 1500, 8, 'cat-16', 'paid', 'business'),
      tx('f2', 'variable_expense', 310, 5, 'cat-15', 'paid', 'business'),
      tx('f3', 'recurring_fixed_expense', 39, 1, 'cat-5', 'paid', 'business'),
      tx('f4', 'variable_expense', 120, 18, 'cat-10', 'planned', 'personal')
    ],
    annual: [{ id: 'fa1', title: 'Suite de diseño anual', amount: 420, dueDate: `${year}-12-01`, categoryId: 'cat-5', createdAt: `${year}-03-01` }],
    quarterly: [],
    budgets: [{ id: 'fb1', categoryId: 'cat-15', month: ym, amount: 520 }],
    goals: [{ id: 'fg1', title: 'Cambiar portátil', targetAmount: 1900, targetDate: `${year}-10-30`, currentAmount: 750 }],
    household: []
  },
  autonomo: {
    settings: { id: 'settings', language: 'es', currency: 'EUR', locale: 'es-ES', mode: 'self_employed', incomePattern: 'mixed', startDayOfMonth: 1, theme: 'light', onboardingCompleted: true } as UserSettings,
    incomes: [
      { id: 'ai1', name: 'Facturas emitidas', type: 'variable', scope: 'business', frequency: 'monthly', expectedAmount: 4300, expectedDate: `${ym}-21`, active: true, includeInProjection: true },
      { id: 'ai2', name: 'Retainer mensual', type: 'fixed', scope: 'business', frequency: 'monthly', expectedAmount: 1200, expectedDate: `${ym}-05`, active: true, includeInProjection: true }
    ],
    transactions: [
      tx('a1', 'income', 1200, 5, 'cat-16', 'paid', 'business'),
      tx('a2', 'variable_expense', 980, 7, 'cat-15', 'paid', 'business'),
      tx('a3', 'recurring_fixed_expense', 294, 12, 'cat-14', 'planned', 'business'),
      tx('a4', 'one_time_expense', 220, 19, 'cat-7', 'planned', 'personal')
    ],
    annual: [{ id: 'aa1', title: 'Seguro RC profesional', amount: 520, dueDate: `${year}-10-10`, categoryId: 'cat-6', createdAt: `${year}-02-01` }],
    quarterly: [
      { id: 'aq1', title: 'Reserva IVA (21%)', amount: 0, nextDueDate: `${year}-10-20`, categoryId: 'cat-14', reserveMode: 'percentage', reserveValue: 21 },
      { id: 'aq2', title: 'Pago fraccionado IRPF', amount: 900, nextDueDate: `${year}-10-20`, categoryId: 'cat-14', reserveMode: 'fixed', reserveValue: 300 }
    ] as QuarterlyObligation[],
    budgets: [{ id: 'ab1', categoryId: 'cat-15', month: ym, amount: 1300 }, { id: 'ab2', categoryId: 'cat-14', month: ym, amount: 600 }],
    goals: [{ id: 'ag1', title: 'Colchón para impuestos', targetAmount: 3500, targetDate: `${year}-12-31`, currentAmount: 1400 }],
    household: []
  }
};

export { defaultCategories };
