import type { ButtonHTMLAttributes, PropsWithChildren } from 'react';

export function Button({ children, className = '', ...props }: PropsWithChildren<ButtonHTMLAttributes<HTMLButtonElement>>) {
  return <button className={`rounded-xl bg-slate-900 text-white px-4 py-2 text-sm font-medium disabled:opacity-50 ${className}`} {...props}>{children}</button>;
}
