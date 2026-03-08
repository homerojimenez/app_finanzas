import { useFinanceStore } from '@/store/useFinanceStore';
import { useState } from 'react';
import { Button } from '@/components/ui/button';

export function CategoriesPage() {
  const { categories, addCategory } = useFinanceStore();
  const [name, setName] = useState('');
  return <div className="space-y-4"><h1 className="text-2xl font-bold">Categories</h1><div className="bg-white rounded-2xl p-4 shadow-sm flex gap-2"><input className="border rounded-xl p-2 flex-1" value={name} onChange={(e) => setName(e.target.value)} placeholder="Nueva categoría" /><Button onClick={() => { if (!name) return; addCategory({ id: crypto.randomUUID(), name, icon: 'Circle', color: '#64748b', scope: 'personal', archived: false, sortOrder: categories.length + 1 }); setName(''); }}>Crear</Button></div><div className="grid md:grid-cols-2 gap-2">{categories.map((c) => <div key={c.id} className="bg-white rounded-xl p-3">{c.name}</div>)}</div></div>;
}
