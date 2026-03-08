import { z } from 'zod';

export const onboardingSchema = z.object({
  language: z.string().min(2),
  currency: z.string().min(3),
  locale: z.string().min(2),
  mode: z.enum(['personal', 'household', 'freelancer', 'self_employed']),
  incomePattern: z.enum(['fixed', 'mixed', 'variable'])
});

export const transactionSchema = z.object({
  type: z.string(),
  amount: z.number().positive(),
  date: z.string(),
  categoryId: z.string(),
  status: z.enum(['planned', 'paid'])
});
