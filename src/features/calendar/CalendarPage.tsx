import { format } from 'date-fns';
import { EmptyState } from '@/components/shared/EmptyState';
import { useFinanceStore } from '@/store/useFinanceStore';
import { formatCurrency, sentenceType } from '@/lib/format';

export function CalendarPage() {
  const { incomes, transactions, annual, quarterly } = useFinanceStore();

  const events = [
    ...incomes.map((income) => ({ date: income.expectedDate, label: `Ingreso esperado · ${income.name}`, amount: income.expectedAmount })),
    ...transactions.map((tx) => ({ date: tx.date, label: sentenceType(tx.type), amount: tx.amount })),
    ...annual.map((item) => ({ date: item.dueDate, label: `Pago anual · ${item.title}`, amount: item.amount })),
    ...quarterly.map((item) => ({ date: item.nextDueDate, label: `Pago trimestral · ${item.title}`, amount: item.amount }))
  ].sort((a, b) => a.date.localeCompare(b.date));

  return (
    <div className="space-y-3">
      <h1 className="text-2xl font-bold">Calendario de caja</h1>
      {events.length === 0 ? (
        <EmptyState title="Sin eventos por ahora" hint="Cuando añadas ingresos y pagos, aquí verás el orden en el tiempo para evitar quedarte corto." />
      ) : (
        <div className="space-y-2">
          {events.map((event, index) => (
            <div key={`${event.label}-${index}`} className="flex justify-between rounded-xl bg-white p-3">
              <div>
                <p className="font-medium">{event.label}</p>
                <p className="text-xs text-slate-500">{format(new Date(event.date), 'dd MMM yyyy')}</p>
              </div>
              <span>{formatCurrency(event.amount)}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
