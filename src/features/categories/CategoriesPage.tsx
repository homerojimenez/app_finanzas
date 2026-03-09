import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useFinanceStore } from '@/store/useFinanceStore';
import { emojiByCategoryName } from '@/lib/format';

export function CategoriesPage() {
  const { categories, addCategory, removeCategory } = useFinanceStore();
  const [name, setName] = useState('');

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Categorías</h1>
      <div className="bg-white rounded-2xl p-4 shadow-sm flex gap-2">
        <input className="border rounded-xl p-2 flex-1" value={name} onChange={(e) => setName(e.target.value)} placeholder="Nueva categoría" />
        <Button onClick={() => {
          if (!name) return;
          addCategory({ id: crypto.randomUUID(), name, icon: 'Circle', color: '#64748b', scope: 'personal', archived: false, sortOrder: categories.length + 1 });
          setName('');
        }}>Crear</Button>
      </div>

      <p className="text-xs text-slate-500">Si eliminas una categoría, los movimientos existentes pasarán automáticamente a <strong>Other</strong>.</p>

      <div className="grid md:grid-cols-2 gap-2">
        {categories.map((category) => (
          <div key={category.id} className="bg-white rounded-xl p-3 flex items-center justify-between">
            <span>{emojiByCategoryName(category.name)} {category.name}</span>
            <button type="button" className="text-xs text-red-600" disabled={category.id === 'cat-16'} onClick={() => removeCategory(category.id)}>
              {category.id === 'cat-16' ? 'Base' : 'Eliminar'}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
