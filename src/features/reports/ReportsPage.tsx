import { Line, LineChart, ResponsiveContainer, XAxis, YAxis } from 'recharts';
import { Card } from '@/components/ui/card';
import { EmptyState } from '@/components/shared/EmptyState';
import { AdBannerPlaceholder } from '@/components/ads/AdBannerPlaceholder';
import { useFinanceStore } from '@/store/useFinanceStore';

export function ReportsPage() {
  const { snapshots } = useFinanceStore();
  const data = snapshots.slice(0, 6).reverse().map((snap) => ({ month: snap.month.slice(5), income: snap.income, expenses: snap.expenses, savings: snap.savings }));

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Reportes</h1>
      {data.length === 0 ? (
        <EmptyState title="Aún no hay historial" hint="Cierra meses para ver tendencias reales de ingresos, gastos y ahorro." />
      ) : (
        <Card>
          <h2 className="font-semibold">Tendencia mensual</h2>
          <div className="h-56">
            <ResponsiveContainer>
              <LineChart data={data}>
                <XAxis dataKey="month" />
                <YAxis />
                <Line dataKey="income" stroke="#0f766e" />
                <Line dataKey="expenses" stroke="#b91c1c" />
                <Line dataKey="savings" stroke="#7c3aed" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>
      )}
      <AdBannerPlaceholder />
    </div>
  );
}
