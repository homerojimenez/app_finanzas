import { useFinanceStore } from '@/store/useFinanceStore';

export function SelfEmployedPanel() {
  const { quarterly, incomes, transactions } = useFinanceStore();
  const gross = incomes.reduce((a, b) => a + b.expectedAmount, 0);
  const opEx = transactions.filter((t) => t.scope === 'business').reduce((a, b) => a + b.amount, 0);
  const taxReserve = quarterly.reduce((a, b) => a + b.amount / 3, 0);
  return <div className="bg-white rounded-xl p-4"><h3 className="font-semibold">Panel autónomo</h3><p className="text-sm">Ingresos brutos: €{gross}</p><p className="text-sm">Reserva impuestos: €{taxReserve.toFixed(0)}</p><p className="text-sm">Gastos operativos: €{opEx}</p><p className="text-sm font-medium">Disponible personal: €{(gross - taxReserve - opEx).toFixed(0)}</p></div>;
}
