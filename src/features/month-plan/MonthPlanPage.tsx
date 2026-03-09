import { Card } from '@/components/ui/card';
import { EmptyState } from '@/components/shared/EmptyState';
import { useFinanceStore } from '@/store/useFinanceStore';
import { calculateAnnualReserve, calculateQuarterlyReserve, monthKey, monthProjection } from '@/domain/logic/calculations';
import { getExpectedIncome } from '@/domain/selectors/financeSelectors';
import { formatCurrency } from '@/lib/format';

export function MonthPlanPage() {
  const state = useFinanceStore();
  const expectedIncome = getExpectedIncome(state);
  const projection = monthProjection(state.transactions, state.annual, state.quarterly, monthKey(), expectedIncome);

  const annualCards = state.annual.map((item) => ({ ...item, ...calculateAnnualReserve(item) }));
  const quarterlyCards = state.quarterly.map((item) => ({ ...item, ...calculateQuarterlyReserve(item, expectedIncome) }));
  const totalReserve = projection.annualReserve + projection.quarterlyReserve;

  if (state.incomes.length === 0 && state.transactions.length === 0) {
    return (
      <div className="space-y-4">
        <h1 className="text-2xl font-bold">Plan del mes</h1>
        <EmptyState title="Aún no hay datos" hint="Añade ingresos y gastos o carga un demo para ver cuánto puedes gastar sin quedarte corto." />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Plan del mes</h1>
      <p className="text-sm text-slate-500">Aquí decides con calma: qué está comprometido, qué conviene reservar y cuánto queda libre.</p>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <Card><p className="text-xs text-slate-500">Ingresos esperados</p><p className="text-lg font-semibold text-income">{formatCurrency(expectedIncome)}</p></Card>
        <Card><p className="text-xs text-slate-500">Compromisos fijos</p><p className="text-lg font-semibold">{formatCurrency(projection.fixed)}</p></Card>
        <Card><p className="text-xs text-slate-500">Reserva recomendada</p><p className="text-lg font-semibold text-reserve">{formatCurrency(totalReserve)}</p></Card>
        <Card><p className="text-xs text-slate-500">Disponible para gastar</p><p className={`text-lg font-semibold ${projection.available < 0 ? 'text-expense' : 'text-income'}`}>{formatCurrency(projection.available)}</p></Card>
      </div>

      <Card>
        <h2 className="font-semibold mb-2">Tus ingresos que cuentan para el plan</h2>
        {state.incomes.length === 0 ? (
          <p className="text-sm text-slate-500">No hay ingresos definidos. Ve a la sección <strong>Ingresos</strong> para añadir tu nómina y otros cobros.</p>
        ) : (
          <div className="space-y-1 text-sm">
            {state.incomes.map((income) => (
              <div key={income.id} className="flex justify-between">
                <span>{income.name}{!income.active ? ' (archivado)' : ''}</span>
                <span className={income.includeInProjection && income.active ? 'text-income font-medium' : 'text-slate-400'}>{formatCurrency(income.expectedAmount)}</span>
              </div>
            ))}
          </div>
        )}
      </Card>

      <Card>
        <h2 className="font-semibold mb-2">Cómo vamos este mes</h2>
        <ul className="space-y-1 text-sm">
          <li>Ingresos recibidos: <strong>{formatCurrency(projection.receivedIncome)}</strong></li>
          <li>Gasto variable actual: <strong>{formatCurrency(projection.variable)}</strong></li>
          <li>Resultado previsto al cierre: <strong className={projection.projectedEndOfMonth < 0 ? 'text-expense' : 'text-income'}>{formatCurrency(projection.projectedEndOfMonth)}</strong></li>
        </ul>
      </Card>

      <Card>
        <h2 className="font-semibold mb-2">Reservas anuales (para evitar sustos)</h2>
        {annualCards.length === 0 ? (
          <p className="text-sm text-slate-500">No hay pagos anuales configurados. Añadirlos mejora mucho la previsión real del mes.</p>
        ) : (
          <div className="space-y-2 text-sm">
            {annualCards.map((item) => (
              <div key={item.id} className="rounded-xl bg-slate-50 p-3">
                <p className="font-medium">{item.title}</p>
                <p>Vencimiento: {item.dueLabel} · Apartar al mes: <strong>{formatCurrency(item.monthlyReserve)}</strong></p>
                <p>Deberías llevar reservado: {formatCurrency(item.shouldReservedByNow)} · Pendiente: {formatCurrency(item.remaining)}</p>
              </div>
            ))}
          </div>
        )}
      </Card>

      <Card>
        <h2 className="font-semibold mb-2">Reservas trimestrales</h2>
        {quarterlyCards.length === 0 ? (
          <p className="text-sm text-slate-500">No hay pagos trimestrales configurados.</p>
        ) : (
          <div className="space-y-2 text-sm">
            {quarterlyCards.map((item) => (
              <div key={item.id} className="rounded-xl bg-slate-50 p-3">
                <p className="font-medium">{item.title}</p>
                <p>Próximo: {item.nextDueQuarter} · Total esperado: <strong>{formatCurrency(item.expectedAmount)}</strong></p>
                <p>Apartar al mes: {formatCurrency(item.recommendedMonthly)} · Deberías llevar: {formatCurrency(item.shouldReservedByNow)}</p>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}
