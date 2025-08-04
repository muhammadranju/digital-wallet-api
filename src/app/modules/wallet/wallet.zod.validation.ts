import z from "zod";

export const createWalletZodSchema = z.object({
  balance: z.number().min(0).optional(),
  user: z.string(),
});
