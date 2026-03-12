import type { PropsWithChildren } from 'react';

export function Card({ children }: PropsWithChildren) {
  return <div className="rounded-2xl bg-white p-4 shadow-sm border border-slate-100">{children}</div>;
}
