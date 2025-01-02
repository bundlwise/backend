import { z } from 'zod';

export const paymentMethodEnum = z.enum(['CREDIT_CARD', 'DEBIT_CARD', 'PAYPAL', 'BANK_TRANSFER']);
export const paymentStatusEnum = z.enum(['PENDING', 'COMPLETED', 'FAILED', 'REFUNDED']);

export const paymentSchema = z.object({
  user_id: z.number().int().positive(),
  subscription_id: z.number().int().positive(),
  amount: z.number().positive().multipleOf(0.01),
  payment_method: paymentMethodEnum,
  payment_status: paymentStatusEnum,
  transaction_id: z.string().max(255),
  region: z.string().max(50).optional(),
});

export type PaymentInput = z.infer<typeof paymentSchema>; 