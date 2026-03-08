import { useFinanceStore } from '@/store/useFinanceStore';
import { monthKey, snapshotFromMonth } from '@/domain/logic/calculations';
import { Button } from '@/components/ui/button';

export function HistoryPage() {
  const { snapshots, closeMonth, incomes, transactions, annual, quarterly } = useFinanceStore();
  const close = () => {
    const income = incomes.reduce((a, b) => a + b.expectedAmount, 0);
    const expenses = transactions.reduce((a, b) => a + b.amount, 0);
    const reserves = annual.reduce((a, b) => a + b.amount / 12, 0) + quarterly.reduce((a, b) => a + b.amount / 3, 0);
    closeMonth(snapshotFromMonth(monthKey(), income, expenses, reserves));
  };
  return <div className="space-y-3"><h1 className="text-2xl font-bold">Month history</h1><Button onClick={close}>Cerrar mes y crear snapshot</Button><div className="space-y-2">{snapshots.map((s) => <div key={s.id} className="bg-white rounded-xl p-3 flex justify-between"><span>{s.month}</span><span>€{s.savings.toFixed(0)}</span></div>)}</div></div>;
}
