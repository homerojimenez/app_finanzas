import { Link, Outlet, useLocation } from 'react-router-dom';
import { Calendar, FolderKanban, Goal, LayoutDashboard, PieChart, Receipt, Settings, Wallet, Landmark } from 'lucide-react';

const desktopLinks = [
  { to: '/', label: 'Resumen', icon: LayoutDashboard },
  { to: '/month-plan', label: 'Plan del mes', icon: Wallet },
  { to: '/transactions', label: 'Movimientos', icon: Receipt },
  { to: '/incomes', label: 'Ingresos', icon: Landmark },
  { to: '/categories', label: 'Categorías', icon: FolderKanban },
  { to: '/calendar', label: 'Calendario', icon: Calendar },
  { to: '/reports', label: 'Reportes', icon: PieChart },
  { to: '/goals', label: 'Metas', icon: Goal },
  { to: '/settings', label: 'Ajustes', icon: Settings }
];

const mobileLinks = desktopLinks.filter((link) => ['/', '/month-plan', '/incomes', '/transactions', '/settings'].includes(link.to));

export function AppShell() {
  const { pathname } = useLocation();

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="mx-auto flex max-w-7xl gap-4 pb-24 md:pb-6">
        <aside className="hidden w-64 p-4 md:block">
          <div className="mb-4 text-lg font-bold">Finanzas Clara</div>
          <nav className="space-y-1">
            {desktopLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className={`flex items-center gap-2 rounded-xl px-3 py-2 text-sm ${pathname === link.to ? 'bg-slate-900 text-white' : 'text-slate-700 hover:bg-slate-100'}`}
              >
                <link.icon size={16} />
                {link.label}
              </Link>
            ))}
          </nav>
        </aside>

        <main className="flex-1 p-3 sm:p-4">
          <Outlet />
        </main>
      </div>

      <nav className="fixed bottom-0 left-0 right-0 border-t bg-white md:hidden">
        <div className="grid grid-cols-5 text-[11px]">
          {mobileLinks.map((link) => (
            <Link key={link.to} to={link.to} className={`p-2 text-center ${pathname === link.to ? 'font-semibold text-slate-900' : 'text-slate-500'}`}>
              <link.icon className="mx-auto mb-1" size={14} />
              {link.label.replace(' del mes', '')}
            </Link>
          ))}
        </div>
      </nav>
    </div>
  );
}
