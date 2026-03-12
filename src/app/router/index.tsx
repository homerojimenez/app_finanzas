import { createBrowserRouter } from 'react-router-dom';
import { AppShell } from '@/app/layout/AppShell';
import { DashboardPage } from '@/features/dashboard/DashboardPage';
import { MonthPlanPage } from '@/features/month-plan/MonthPlanPage';
import { TransactionsPage } from '@/features/transactions/TransactionsPage';
import { IncomesPage } from '@/features/income/IncomesPage';
import { CategoriesPage } from '@/features/categories/CategoriesPage';
import { CalendarPage } from '@/features/calendar/CalendarPage';
import { ReportsPage } from '@/features/reports/ReportsPage';
import { GoalsPage } from '@/features/goals/GoalsPage';
import { SettingsPage } from '@/features/settings/SettingsPage';
import { ImportExportPage } from '@/features/import-export/ImportExportPage';
import { HistoryPage } from '@/features/month-plan/HistoryPage';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <AppShell />,
    children: [
      { index: true, element: <DashboardPage /> },
      { path: 'month-plan', element: <MonthPlanPage /> },
      { path: 'transactions', element: <TransactionsPage /> },
      { path: 'incomes', element: <IncomesPage /> },
      { path: 'categories', element: <CategoriesPage /> },
      { path: 'calendar', element: <CalendarPage /> },
      { path: 'reports', element: <ReportsPage /> },
      { path: 'goals', element: <GoalsPage /> },
      { path: 'settings', element: <SettingsPage /> },
      { path: 'import-export', element: <ImportExportPage /> },
      { path: 'history', element: <HistoryPage /> }
    ]
  }
]);
