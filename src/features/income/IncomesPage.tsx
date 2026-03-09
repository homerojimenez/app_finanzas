import { useForm } from 'react-hook-form';
import { EmptyState } from '@/components/shared/EmptyState';
import { Button } from '@/components/ui/button';
import { useFinanceStore } from '@/store/useFinanceStore';
import type { Frequency, IncomeSource, Scope } from '@/domain/types/finance';
import { formatCurrency } from '@/lib/format';

type IncomeForm = {
  name: string;
  type: 'fixed' | 'variable';
  scope: Scope;
  frequency: Frequency;
  expectedAmount: number;
  expectedDate: string;
  notes?: string;
};

export function IncomesPage() {
  const { incomes, settings, addIncome, toggleIncomeActive, toggleIncomeProjection, removeIncome } = useFinanceStore();
  const { register, handleSubmit, reset } = useForm<IncomeForm>({
    defaultValues: {
      name: '',
      type: 'fixed',
      scope: 'personal',
      frequency: 'monthly',
      expectedAmount: 0,
      expectedDate: new Date().toISOString().slice(0, 10),
      notes: ''
    }
  });

  const onSubmit = handleSubmit((values) => {
    if (!values.name || values.expectedAmount <= 0) return;
    const income: IncomeSource = {
      id: crypto.randomUUID(),
      name: values.name,
      type: values.type,
      scope: values.scope,
      frequency: values.frequency,
      expectedAmount: Number(values.expectedAmount),
      expectedDate: values.expectedDate,
      notes: values.notes,
      active: true,
      includeInProjection: true,
      irregular: values.type === 'variable'
    };
    addIncome(income);
    reset({ ...values, name: '', expectedAmount: 0 });
  });

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Ingresos</h1>
      <p className="text-sm text-slate-500">Añade tu nómina fija y otros ingresos. Solo los marcados para proyección contarán en el Plan del mes.</p>

      <form className="grid gap-2 rounded-2xl bg-white p-4 shadow-sm sm:grid-cols-2 lg:grid-cols-3" onSubmit={onSubmit}>
        <label className="text-xs text-slate-500">Nombre
          <input className="mt-1 w-full rounded-xl border p-2 text-sm" {...register('name')} placeholder="Nómina principal" />
        </label>
        <label className="text-xs text-slate-500">Tipo
          <select className="mt-1 w-full rounded-xl border p-2 text-sm" {...register('type')}>
            <option value="fixed">Fijo</option>
            <option value="variable">Variable</option>
          </select>
        </label>
        <label className="text-xs text-slate-500">Importe esperado
          <input className="mt-1 w-full rounded-xl border p-2 text-sm" type="number" step="0.01" {...register('expectedAmount', { valueAsNumber: true })} />
        </label>
        <label className="text-xs text-slate-500">Frecuencia
          <select className="mt-1 w-full rounded-xl border p-2 text-sm" {...register('frequency')}>
            <option value="monthly">Mensual</option>
            <option value="biweekly">Quincenal</option>
            <option value="quarterly">Trimestral</option>
            <option value="yearly">Anual</option>
            <option value="one_time">Puntual</option>
          </select>
        </label>
        <label className="text-xs text-slate-500">Fecha esperada
          <input className="mt-1 w-full rounded-xl border p-2 text-sm" type="date" {...register('expectedDate')} />
        </label>
        <label className="text-xs text-slate-500">Ámbito
          <select className="mt-1 w-full rounded-xl border p-2 text-sm" {...register('scope')}>
            <option value="personal">Personal</option>
            <option value="shared">Compartido</option>
            <option value="business">Negocio</option>
          </select>
        </label>
        <div className="sm:col-span-2 lg:col-span-3 flex justify-end">
          <Button type="submit">Guardar ingreso</Button>
        </div>
      </form>

      {incomes.length === 0 ? (
        <EmptyState title="No hay ingresos configurados" hint="Empieza por tu nómina fija y después añade ingresos variables para mejorar la proyección mensual." />
      ) : (
        <div className="space-y-2">
          {incomes.map((income) => (
            <div key={income.id} className="rounded-xl bg-white p-3 border border-slate-100">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="font-medium">{income.name}</p>
                  <p className="text-xs text-slate-500">{income.type === 'fixed' ? 'Fijo' : 'Variable'} · {income.frequency} · {formatCurrency(income.expectedAmount, settings.currency, settings.locale)}</p>
                </div>
                <button type="button" className="text-xs text-red-600" onClick={() => removeIncome(income.id)}>Eliminar</button>
              </div>
              <div className="mt-2 flex flex-wrap gap-2 text-xs">
                <button type="button" className={`rounded-full px-2 py-1 ${income.active ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-600'}`} onClick={() => toggleIncomeActive(income.id)}>{income.active ? 'Activo' : 'Archivado'}</button>
                <button type="button" className={`rounded-full px-2 py-1 ${income.includeInProjection ? 'bg-indigo-100 text-indigo-700' : 'bg-slate-100 text-slate-600'}`} onClick={() => toggleIncomeProjection(income.id)}>{income.includeInProjection ? 'Incluido en plan' : 'No incluido en plan'}</button>
                <span className="rounded-full bg-slate-100 px-2 py-1">Fecha: {income.expectedDate}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
