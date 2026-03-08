import { useFinanceStore } from '@/store/useFinanceStore';

export function GoalsPage() {
  const { goals } = useFinanceStore();
  return <div><h1 className="text-2xl font-bold mb-4">Savings goals</h1><div className="space-y-3">{goals.map((g) => { const pct = Math.min(100, (g.currentAmount / g.targetAmount) * 100); return <div key={g.id} className="bg-white rounded-xl p-4"><div className="flex justify-between"><span>{g.title}</span><span>{pct.toFixed(0)}%</span></div><div className="h-2 rounded-full bg-slate-100 mt-2"><div className="h-2 rounded-full bg-income" style={{ width: `${pct}%` }} /></div></div>; })}</div></div>;
}
