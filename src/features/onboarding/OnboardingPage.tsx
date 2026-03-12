import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { onboardingSchema } from '@/domain/models/schemas';
import { useFinanceStore } from '@/store/useFinanceStore';
import { Button } from '@/components/ui/button';

export function OnboardingPage() {
  const complete = useFinanceStore((state) => state.completeOnboarding);
  const loadDemo = useFinanceStore((state) => state.loadDemo);

  const { register, handleSubmit } = useForm<z.infer<typeof onboardingSchema>>({
    resolver: zodResolver(onboardingSchema),
    defaultValues: { language: 'es', currency: 'EUR', locale: 'es-ES', mode: 'personal', incomePattern: 'fixed' }
  });

  return (
    <div className="mx-auto mt-6 max-w-xl space-y-4 rounded-2xl bg-white p-6 shadow-sm">
      <h1 className="text-2xl font-bold">Empieza tu organización en 1 minuto</h1>
      <p className="text-sm text-slate-500">Te ayudaremos a ver cuánto dinero tienes realmente disponible cada mes. Tus datos quedan en este dispositivo.</p>

      <form className="space-y-3" onSubmit={handleSubmit((values) => complete(values))}>
        <label className="block text-sm">Idioma
          <input className="mt-1 w-full rounded-xl border p-2" {...register('language')} placeholder="es" aria-label="Idioma" />
        </label>

        <label className="block text-sm">Moneda
          <input className="mt-1 w-full rounded-xl border p-2" {...register('currency')} placeholder="EUR" aria-label="Moneda" />
        </label>

        <label className="block text-sm">¿Cómo usarás la app?
          <select className="mt-1 w-full rounded-xl border p-2" {...register('mode')} aria-label="Modo">
            <option value="personal">Solo yo</option>
            <option value="household">Hogar / pareja</option>
            <option value="freelancer">Freelancer</option>
            <option value="self_employed">Autónomo (España)</option>
          </select>
        </label>

        <label className="block text-sm">Tus ingresos suelen ser...
          <select className="mt-1 w-full rounded-xl border p-2" {...register('incomePattern')} aria-label="Patrón de ingresos">
            <option value="fixed">Fijos</option>
            <option value="mixed">Mixtos</option>
            <option value="variable">Variables</option>
          </select>
        </label>

        <Button type="submit">Crear mi plan</Button>
      </form>

      <div>
        <p className="mb-2 text-xs text-slate-500">O prueba un escenario realista:</p>
        <div className="flex flex-wrap gap-2">
          <Button className="bg-slate-700" onClick={() => loadDemo('salaried')}>Asalariado</Button>
          <Button className="bg-slate-700" onClick={() => loadDemo('household')}>Hogar</Button>
          <Button className="bg-slate-700" onClick={() => loadDemo('freelancer')}>Freelancer</Button>
          <Button className="bg-slate-700" onClick={() => loadDemo('autonomo')}>Autónomo</Button>
        </div>
      </div>
    </div>
  );
}
