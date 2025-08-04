import { model, Schema } from "mongoose";
import { IWallet } from "./wallet.interface";

const walletSchema = new Schema<IWallet>(
  {
    balance: {
      type: Number,
      required: [true, "balance is required"],
      // default: 50,
    },
    isBlocked: {
      type: Boolean,
      default: false,
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: [true, "UserId is required"],
    },
  },
  { timestamps: true, versionKey: false }
);

export const Wallet = model<IWallet>("Wallet", walletSchema);
