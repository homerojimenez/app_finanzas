# Finanzas Clara (MVP)

Finanzas Clara es una app web para organizar dinero mes a mes con una experiencia clara y amigable: ingresos, gastos, reservas anuales/trimestrales, presupuestos y metas de ahorro.

## Qué resuelve
- Reemplaza la típica hoja Excel mensual por un plan visual y accionable.
- Te dice cuánto dinero puedes gastar sin perder control.
- Evita sorpresas de pagos anuales y trimestrales con reservas automáticas.
- Funciona para: asalariados, hogares, freelancers y autónomos en España.

## Stack técnico
- React + TypeScript + Vite
- Tailwind CSS
- Zustand
- Dexie + IndexedDB (capa lista para ampliar)
- React Hook Form + zod
- Recharts
- date-fns
- lucide-react
- PWA con `vite-plugin-pwa`

## Ejecutar localmente
```bash
npm install
npm run dev
```

## Build producción
```bash
npm run build
npm run preview
```

## Persistencia y privacidad
- MVP local-first: tus datos se guardan en el dispositivo.
- Estado persistido en localStorage con Zustand.
- Base Dexie preparada para evolución a sincronización cloud.
- Desde Ajustes puedes exportar/restaurar backup JSON y borrar todos los datos.

## Arquitectura
```
src/
  app/               # shell, routing y providers
  components/        # UI base + componentes de pantallas
  features/          # pantallas por dominio
  domain/            # tipos, reglas, cálculos y selectores
  store/             # estado global
  db/                # IndexedDB (Dexie)
  data/demo/         # perfiles demo realistas
```

## Deploy en Cloudflare (Workers Assets)
Este repo usa `wrangler.toml` (formato estándar de Wrangler) y **requiere build antes del upload**.

Comandos locales:
1. `npm run deploy:cf`
2. o `npm run deploy:cf:npx`

Si configuras Cloudflare con comando manual, usa exactamente:
- `npm run build && npx wrangler versions upload --assets=./dist`

> Importante: si ejecutas solo `npx wrangler versions upload` sin `--assets` y sin build previo,
> Wrangler no encuentra entrypoint/assets y falla con `Missing entry-point to Worker script or to assets directory`.

## Limitaciones del MVP
- No conexión bancaria.
- Importador CSV básico con vista previa.
- Sin login ni sync entre dispositivos.
- Iconos PWA de placeholder.

## Roadmap fase 2 / 3
- Supabase Auth + sync multi-dispositivo.
- Backup cloud automático.
- Recordatorios de pagos y reservas.
- Modo hogar colaborativo en tiempo real.
- OCR de tickets.
- Asistente de importación bancaria avanzada.
- Forecast avanzado para autónomos.
- Versión premium sin anuncios.

## Disclaimer
Herramienta de organización financiera personal. No sustituye asesoramiento fiscal, contable o legal.

