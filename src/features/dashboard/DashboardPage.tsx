import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis } from 'recharts';
import { Card } from '@/components/ui/card';
import { EmptyState } from '@/components/shared/EmptyState';
import { AdBannerPlaceholder } from '@/components/ads/AdBannerPlaceholder';
import { useFinanceStore } from '@/store/useFinanceStore';
import { getExpectedIncome, getRecommendations } from '@/domain/selectors/financeSelectors';
import { upcomingPayments } from '@/domain/logic/calculations';
import { formatCurrency, sentenceType } from '@/lib/format';

const chartColors = ['#0ea5e9', '#22c55e', '#f59e0b', '#ef4444', '#8b5cf6'];

export function DashboardPage() {
  const state = useFinanceStore();
  const expectedIncome = getExpectedIncome(state);
  const monthExpense = state.transactions.filter((t) => t.type.includes('expense')).reduce((acc, tx) => acc + tx.amount, 0);

  const recommendations = getRecommendations(state);
  const categoryData = state.categories
    .slice(0, 6)
    .map((cat) => ({
      name: cat.name,
      value: state.transactions.filter((tx) => tx.categoryId === cat.id && tx.type.includes('expense')).reduce((a, b) => a + b.amount, 0)
    }))
    .filter((item) => item.value > 0);
  const monthData = state.snapshots.slice(0, 5).reverse().map((snap) => ({ month: snap.month.slice(5), savings: snap.savings }));
  const nearPayments = upcomingPayments(state.transactions);

  if (state.incomes.length === 0 && state.transactions.length === 0) {
    return (
      <div className="space-y-4">
        <h1 className="text-2xl font-bold">Resumen</h1>
        <EmptyState
          title="Empieza con un perfil demo"
          hint="Verás en segundos cuánto reservar para trimestrales, qué pagos vienen y cuánto puedes gastar sin estrés."
        />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Resumen</h1>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <Card><p className="text-xs text-slate-500">Ingresos esperados</p><p className="text-lg font-semibold text-income">{formatCurrency(expectedIncome)}</p></Card>
        <Card><p className="text-xs text-slate-500">Gasto registrado</p><p className="text-lg font-semibold text-expense">{formatCurrency(monthExpense)}</p></Card>
        <Card><p className="text-xs text-slate-500">Pagos próximos</p><p className="text-lg font-semibold">{nearPayments.length}</p></Card>
        <Card><p className="text-xs text-slate-500">Objetivos de ahorro</p><p className="text-lg font-semibold">{state.goals.length}</p></Card>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <h2 className="font-semibold mb-2">¿En qué se va el dinero?</h2>
          <div className="h-52">
            {categoryData.length === 0 ? (
              <p className="text-sm text-slate-500">Aún no hay gastos con categoría.</p>
            ) : (
              <ResponsiveContainer>
                <PieChart>
                  <Pie data={categoryData} dataKey="value" nameKey="name" outerRadius={74}>
                    {categoryData.map((_, i) => <Cell key={i} fill={chartColors[i % chartColors.length]} />)}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            )}
          </div>
        </Card>

        <Card>
          <h2 className="font-semibold mb-2">Evolución de ahorro</h2>
          <div className="h-52">
            {monthData.length === 0 ? (
              <p className="text-sm text-slate-500">Cierra tu primer mes para ver la evolución.</p>
            ) : (
              <ResponsiveContainer>
                <BarChart data={monthData}>
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Bar dataKey="savings" fill="#0f766e" />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </Card>
      </div>

      <Card>
        <h2 className="font-semibold mb-2">Pagos en los próximos días</h2>
        {nearPayments.length === 0 ? (
          <p className="text-sm text-slate-500">Sin pagos planificados a corto plazo.</p>
        ) : (
          <ul className="text-sm space-y-1">
            {nearPayments.slice(0, 4).map((tx) => (
              <li key={tx.id}>• {sentenceType(tx.type)} · {formatCurrency(tx.amount)}</li>
            ))}
          </ul>
        )}
      </Card>

      <Card>
        <h2 className="font-semibold mb-2">Recomendaciones de este mes</h2>
        <ul className="text-sm space-y-1">
          {recommendations.map((tip, index) => <li key={`${tip}-${index}`}>• {tip}</li>)}
        </ul>
      </Card>

      <AdBannerPlaceholder />
    </div>
  );
}
