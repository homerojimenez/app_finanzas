import { useForm } from 'react-hook-form';
import { useFinanceStore } from '@/store/useFinanceStore';
import { Button } from '@/components/ui/button';
import { EmptyState } from '@/components/shared/EmptyState';
import { formatCurrency } from '@/lib/format';

type GoalForm = {
  title: string;
  targetAmount: number;
  targetDate: string;
};

export function GoalsPage() {
  const { goals, settings, addGoal, updateGoalAmount, removeGoal } = useFinanceStore();
  const { register, handleSubmit, reset } = useForm<GoalForm>({
    defaultValues: {
      title: '',
      targetAmount: 0,
      targetDate: new Date().toISOString().slice(0, 10)
    }
  });

  const onSubmit = handleSubmit((values) => {
    if (!values.title || values.targetAmount <= 0) return;
    addGoal({
      id: crypto.randomUUID(),
      title: values.title,
      targetAmount: Number(values.targetAmount),
      targetDate: values.targetDate,
      currentAmount: 0
    });
    reset({ title: '', targetAmount: 0, targetDate: values.targetDate });
  });

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Metas de ahorro</h1>

      <form className="grid gap-2 rounded-2xl bg-white p-4 shadow-sm sm:grid-cols-2 lg:grid-cols-4" onSubmit={onSubmit}>
        <label className="text-xs text-slate-500">Meta
          <input className="mt-1 w-full rounded-xl border p-2 text-sm" {...register('title')} placeholder="Viaje, fondo emergencia..." />
        </label>
        <label className="text-xs text-slate-500">Objetivo total
          <input className="mt-1 w-full rounded-xl border p-2 text-sm" type="number" step="0.01" {...register('targetAmount', { valueAsNumber: true })} />
        </label>
        <label className="text-xs text-slate-500">Fecha objetivo
          <input className="mt-1 w-full rounded-xl border p-2 text-sm" type="date" {...register('targetDate')} />
        </label>
        <div className="flex items-end">
          <Button type="submit" className="w-full">Crear meta</Button>
        </div>
      </form>

      {goals.length === 0 ? (
        <EmptyState title="Aún no tienes metas" hint="Crea una meta y ve aportando cada mes para mantener el hábito de ahorro." />
      ) : (
        <div className="space-y-3">
          {goals.map((goal) => {
            const pct = Math.min(100, (goal.currentAmount / goal.targetAmount) * 100);
            return (
              <div key={goal.id} className="bg-white rounded-xl p-4">
                <div className="flex justify-between mb-1">
                  <span>🎯 {goal.title}</span>
                  <span>{pct.toFixed(0)}%</span>
                </div>
                <p className="text-xs text-slate-500 mb-2">{formatCurrency(goal.currentAmount, settings.currency, settings.locale)} de {formatCurrency(goal.targetAmount, settings.currency, settings.locale)} · objetivo {goal.targetDate}</p>
                <div className="h-2 rounded-full bg-slate-100 mt-1 mb-3"><div className="h-2 rounded-full bg-income" style={{ width: `${pct}%` }} /></div>
                <div className="flex flex-wrap gap-2">
                  <button type="button" className="text-xs rounded-full bg-emerald-100 text-emerald-700 px-2 py-1" onClick={() => updateGoalAmount(goal.id, goal.currentAmount + 50)}>+50€</button>
                  <button type="button" className="text-xs rounded-full bg-emerald-100 text-emerald-700 px-2 py-1" onClick={() => updateGoalAmount(goal.id, goal.currentAmount + 100)}>+100€</button>
                  <button type="button" className="text-xs rounded-full bg-slate-100 text-slate-700 px-2 py-1" onClick={() => updateGoalAmount(goal.id, Math.max(0, goal.currentAmount - 50))}>-50€</button>
                  <button type="button" className="text-xs text-red-600 ml-auto" onClick={() => removeGoal(goal.id)}>Eliminar</button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
