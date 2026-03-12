import { useFinanceStore } from '@/store/useFinanceStore';

export function HouseholdSummary() {
  const { household, transactions } = useFinanceStore();
  const shared = transactions.filter((t) => t.shared);
  return <div className="bg-white rounded-xl p-4"><h3 className="font-semibold">Balance del hogar</h3><p className="text-sm">Miembros: {household.length}</p><p className="text-sm">Gastos compartidos: {shared.length}</p></div>;
}
