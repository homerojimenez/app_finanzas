import { useForm } from 'react-hook-form';
import { EmptyState } from '@/components/shared/EmptyState';
import { Button } from '@/components/ui/button';
import { useFinanceStore } from '@/store/useFinanceStore';
import type { Transaction } from '@/domain/types/finance';
import { formatCurrency, sentenceType } from '@/lib/format';

type TxForm = {
  amount: number;
  categoryId: string;
  type: Transaction['type'];
};

export function TransactionsPage() {
  const { transactions, categories, addTransaction } = useFinanceStore();
  const { register, handleSubmit, reset } = useForm<TxForm>({
    defaultValues: {
      amount: 0,
      categoryId: categories[0]?.id ?? '',
      type: 'variable_expense'
    }
  });

  const onSubmit = handleSubmit((values) => {
    if (!values.categoryId || values.amount <= 0) return;
    addTransaction({
      id: crypto.randomUUID(),
      amount: Number(values.amount),
      categoryId: values.categoryId,
      type: values.type,
      date: new Date().toISOString(),
      status: 'paid',
      shared: false,
      scope: 'personal'
    });
    reset({ amount: 0, categoryId: values.categoryId, type: values.type });
  });

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Movimientos</h1>

      <form className="grid gap-2 rounded-2xl bg-white p-4 shadow-sm sm:grid-cols-2 lg:grid-cols-4" onSubmit={onSubmit}>
        <label className="text-xs text-slate-500">Importe
          <input className="mt-1 w-full rounded-xl border p-2 text-sm" type="number" step="0.01" {...register('amount', { valueAsNumber: true })} />
        </label>

        <label className="text-xs text-slate-500">Categoría
          <select className="mt-1 w-full rounded-xl border p-2 text-sm" {...register('categoryId')}>
            {categories.map((category) => <option key={category.id} value={category.id}>{category.name}</option>)}
          </select>
        </label>

        <label className="text-xs text-slate-500">Tipo
          <select className="mt-1 w-full rounded-xl border p-2 text-sm" {...register('type')}>
            <option value="variable_expense">Gasto variable</option>
            <option value="recurring_fixed_expense">Gasto fijo</option>
            <option value="one_time_expense">Gasto puntual</option>
            <option value="income">Ingreso</option>
          </select>
        </label>

        <div className="flex items-end">
          <Button type="submit" className="w-full">Guardar</Button>
        </div>
      </form>

      {transactions.length === 0 ? (
        <EmptyState title="No hay movimientos todavía" hint="Añade tu primer ingreso o gasto para que el plan del mes empiece a darte recomendaciones." />
      ) : (
        <div className="space-y-2">
          {transactions.map((tx) => (
            <div key={tx.id} className="flex items-center justify-between rounded-xl bg-white p-3">
              <div>
                <p className="text-sm font-medium">{categories.find((c) => c.id === tx.categoryId)?.name ?? 'Sin categoría'}</p>
                <p className="text-xs text-slate-500">{sentenceType(tx.type)}</p>
              </div>
              <span className={tx.type === 'income' ? 'font-medium text-income' : 'font-medium text-expense'}>{formatCurrency(tx.amount)}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
