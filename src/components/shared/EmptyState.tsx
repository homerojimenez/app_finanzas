export function EmptyState({ title, hint }: { title: string; hint: string }) {
  return <div className="rounded-2xl border border-dashed border-slate-300 p-6 text-center bg-white"><h3 className="font-semibold">{title}</h3><p className="text-sm text-slate-500 mt-2">{hint}</p></div>;
}
