import { Types } from "mongoose";

export enum PayStatus {
  PENDING = "PENDING",
  COMPLETED = "COMPLETED",
  FAILED = "FAILED",
  REVERSED = "REVERSED",
}

export enum InitiatedBy {
  USER = "USER",
  AGENT = "AGENT",
}

export enum PayType {
  ADD_MONEY = "ADD_MONEY",
  WITHDRAW = "WITHDRAW",
  SEND_MONEY = "SEND_MONEY",
}
export interface ITransaction {
  type: PayType;
  amount: number;
  senderId?: Types.ObjectId;
  receiverId?: Types.ObjectId;
  wallet: Types.ObjectId;
  initiatedBy: InitiatedBy;
  fee?: number;
  commission?: number;
  status: PayStatus;
}
