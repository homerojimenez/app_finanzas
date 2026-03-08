import { useRef, useState } from 'react';
import { useFinanceStore } from '@/store/useFinanceStore';
import { Button } from '@/components/ui/button';

export function SettingsPage() {
  const { settings, resetAll, loadDemo, restoreData } = useFinanceStore();
  const [message, setMessage] = useState('');
  const fileRef = useRef<HTMLInputElement>(null);

  const downloadBackup = () => {
    const json = JSON.stringify(useFinanceStore.getState());
    const blob = new Blob([json], { type: 'application/json' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'finanzas-backup.json';
    a.click();
    setMessage('Backup exportado correctamente.');
  };

  const restoreBackup = async (file?: File) => {
    if (!file) return;
    try {
      const content = await file.text();
      const parsed = JSON.parse(content);
      restoreData(parsed);
      setMessage('Backup restaurado.');
    } catch {
      setMessage('No se pudo restaurar el archivo. Revisa que sea un JSON válido.');
    }
  };

  return (
    <div className="space-y-3">
      <h1 className="text-2xl font-bold">Ajustes</h1>
      <div className="space-y-2 rounded-xl bg-white p-4 text-sm">
        <p><strong>Idioma:</strong> {settings.language}</p>
        <p><strong>Moneda:</strong> {settings.currency}</p>
        <p><strong>Privacidad:</strong> tus datos se guardan localmente en este dispositivo.</p>
        <p className="text-xs text-slate-500">Esta app ayuda a organizarte; no sustituye asesoramiento fiscal o legal.</p>
      </div>

      <div className="flex flex-wrap gap-2">
        <Button onClick={downloadBackup}>Exportar backup</Button>
        <Button className="bg-slate-700" onClick={() => fileRef.current?.click()}>Importar backup</Button>
        <Button className="bg-slate-700" onClick={() => loadDemo('autonomo')}>Recargar demo autónomo</Button>
        <Button className="bg-red-700" onClick={resetAll}>Borrar todos los datos</Button>
        <input ref={fileRef} type="file" accept="application/json" className="hidden" onChange={(e) => restoreBackup(e.target.files?.[0])} />
      </div>

      {message ? <p className="text-sm text-slate-600">{message}</p> : null}
    </div>
  );
}
