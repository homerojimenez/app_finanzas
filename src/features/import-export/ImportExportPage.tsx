import { useState } from 'react';
import { EmptyState } from '@/components/shared/EmptyState';

export function ImportExportPage() {
  const sample = [
    'date,type,amount,category,notes',
    '2026-01-02,variable_expense,32.5,Groceries,Supermercado',
    '2026-01-03,income,2200,Other,Nómina'
  ].join('\n');

  const [preview, setPreview] = useState<string[]>([]);

  const downloadTemplate = () => {
    const blob = new Blob([sample], { type: 'text/csv' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'plantilla-movimientos.csv';
    link.click();
  };

  const handleCsv = async (file?: File) => {
    if (!file) return;
    const text = await file.text();
    setPreview(text.split('\n').filter(Boolean).slice(0, 5));
  };

  return (
    <div className="space-y-3">
      <h1 className="text-2xl font-bold">Importar / Exportar</h1>
      <div className="space-y-2 rounded-xl bg-white p-4 text-sm">
        <p>Formato recomendado: <code>date,type,amount,category,notes</code>.</p>
        <p className="text-slate-500">Campos mínimos: fecha, tipo, importe y categoría.</p>
        <input type="file" accept=".csv" onChange={(event) => handleCsv(event.target.files?.[0])} />
      </div>

      {preview.length > 0 ? (
        <div className="rounded-xl bg-white p-4 text-xs">
          <p className="mb-1 font-semibold">Vista previa y ayuda de mapeo</p>
          {preview.map((line, idx) => <p key={`${line}-${idx}`}>{line}</p>)}
        </div>
      ) : (
        <EmptyState title="Sube un CSV para validar" hint="Te mostraremos una vista previa rápida para revisar columnas antes de importar." />
      )}

      <button className="rounded-xl bg-slate-900 px-4 py-2 text-white" onClick={downloadTemplate}>Descargar plantilla CSV</button>
    </div>
  );
}
