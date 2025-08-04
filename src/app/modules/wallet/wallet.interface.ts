import { Types } from "mongoose";

export interface IWallet {
  balance: number;
  isBlocked: boolean;
  user: Types.ObjectId;
}
