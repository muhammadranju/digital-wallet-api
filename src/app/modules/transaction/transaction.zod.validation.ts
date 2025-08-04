import z from "zod";
import { InitiatedBy, PayType } from "./transaction.interface";

export const createTransactionZodSchema = z.object({
  type: z
    .enum([PayType.ADD_MONEY, PayType.SEND_MONEY, PayType.WITHDRAW])
    .optional(),
  amount: z
    .number({
      required_error: "amount is required",
      invalid_type_error: "amount must be a number",
    })
    .min(50, "Minimum transaction amount is ৳50")
    .nonnegative(),

  senderId: z.string().optional(),
  receiverId: z.string().optional(),
  wallet: z.string().optional(),
  initiatedBy: z.enum([InitiatedBy.USER, InitiatedBy.AGENT]).optional(),
  fee: z.number().nonnegative().default(0).optional(),
  commission: z.number().nonnegative().default(0).optional(),
});
