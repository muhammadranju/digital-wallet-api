import { model, Schema } from "mongoose";
import {
  InitiatedBy,
  ITransaction,
  PayStatus,
  PayType,
} from "./transaction.interface";

const transactionSchema = new Schema<ITransaction>(
  {
    type: {
      type: String,
      enum: Object.values(PayType),
      required: [true, "type is required"],
    },
    amount: {
      type: Number,
      required: [true, "amount is required"],
      min: 50,
    },
    senderId: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    receiverId: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    wallet: {
      type: Schema.Types.ObjectId,
      ref: "Wallet",
      required: true,
    },
    initiatedBy: {
      type: String,
      enum: Object.values(InitiatedBy),
      required: [true, "InitiatedBy is required"],
    },
    fee: {
      type: Number,
      default: 0,
    },
    commission: {
      type: Number,
      default: 0,
    },
    status: {
      type: String,
      enum: Object.values(PayStatus),
      default: PayStatus.PENDING,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

export const Transaction = model<ITransaction>(
  "Transaction",
  transactionSchema
);
