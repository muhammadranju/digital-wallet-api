import AppError from "../../errorHelpers/AppError";
import { Wallet } from "../wallet/wallet.model";
import { ITransaction, PayStatus } from "./transaction.interface";
import httpStatus from "http-status-codes";
import { Transaction } from "./transaction.model";
import { calculateTotalWithFee } from "../../utils/calculateTotalWithFee";
import { calculateBySendMoneyFee } from "../../utils/calculateBySendMoneyFee";
import { Role } from "../user/user.interface";

// add money
const addMoney = async (
  payload: ITransaction,
  type: string,
  role: string,
  userId: string
) => {
  const session = await Wallet.startSession();
  session.startTransaction();
  try {
    const isWallet = await Wallet.findOne({
      user: userId,
    });
    if (!isWallet) {
      throw new AppError(httpStatus.NOT_FOUND, "User wallet not found");
    }
    if (isWallet.isBlocked === true) {
      throw new AppError(
        httpStatus.FORBIDDEN,
        "This wallet is blocked. No transaction is allowed."
      );
    }
    await Wallet.findByIdAndUpdate(
      isWallet._id,
      {
        $set: {
          balance: isWallet.balance + payload.amount,
        },
      },
      { new: true, runValidators: true, session }
    );

    const addMoneyTransaction = await Transaction.create(
      [
        {
          ...payload,
          type,
          wallet: isWallet._id,
          senderId: userId,
          initiatedBy: role,
          status: PayStatus.COMPLETED,
        },
      ],
      {
        session,
      }
    );
    await session.commitTransaction();
    session.endSession();
    return addMoneyTransaction;
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    throw error;
  }
};

// with draw money
const withdrawMoney = async (
  payload: ITransaction,
  type: string,
  role: string,
  userId: string
) => {
  const session = await Wallet.startSession();
  session.startTransaction();
  try {
    const isWallet = await Wallet.findOne({ user: userId });
    if (!isWallet) {
      throw new AppError(httpStatus.NOT_FOUND, "User wallet not found");
    }
    if (isWallet.isBlocked === true) {
      throw new AppError(
        httpStatus.FORBIDDEN,
        "This wallet is blocked. No transaction is allowed."
      );
    }
    const { totalAmount, fee } = calculateTotalWithFee(payload.amount);

    if (isWallet.balance < totalAmount) {
      throw new AppError(
        httpStatus.BAD_REQUEST,
        `Insufficient balance. Your balance is ${isWallet.balance}, but you need ${totalAmount} including transaction charges.`
      );
    }

    await Wallet.findByIdAndUpdate(
      isWallet._id,
      {
        $set: {
          balance: isWallet.balance - totalAmount,
        },
      },
      { new: true, runValidators: true, session }
    );

    const withdrawMoneyTransaction = await Transaction.create(
      [
        {
          ...payload,
          type,
          initiatedBy: role,
          wallet: isWallet._id,
          senderId: userId,
          fee,
          status: PayStatus.COMPLETED,
        },
      ],
      {
        session,
      }
    );
    await session.commitTransaction();
    session.endSession();
    return withdrawMoneyTransaction;
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    throw error;
  }
};

// send money
const sendMoney = async (
  payload: ITransaction,
  type: string,
  role: string,
  userId: string
) => {
  const session = await Wallet.startSession();
  session.startTransaction();
  try {
    const isSenderWallet = await Wallet.findOne({ user: userId });
    if (!isSenderWallet) {
      throw new AppError(httpStatus.NOT_FOUND, "User wallet not found");
    }
    if (isSenderWallet.isBlocked === true) {
      throw new AppError(
        httpStatus.FORBIDDEN,
        "This wallet is blocked. No transaction is allowed."
      );
    }
    const { totalAmount, fee } = calculateBySendMoneyFee(payload.amount);

    if (isSenderWallet.balance < totalAmount) {
      throw new AppError(
        httpStatus.BAD_REQUEST,
        `Insufficient balance: Your wallet balance is ${isSenderWallet.balance}, but you need ${totalAmount} including fees to send money.`
      );
    }

    await Wallet.findByIdAndUpdate(
      isSenderWallet._id,
      {
        $set: {
          balance: isSenderWallet.balance - totalAmount,
        },
      },
      { new: true, runValidators: true, session }
    );

    const isReceiverWallet = await Wallet.findOne({ user: payload.receiverId });
    if (!isReceiverWallet) {
      throw new AppError(httpStatus.NOT_FOUND, "Receiver wallet not found");
    }
    if (isReceiverWallet.isBlocked === true) {
      throw new AppError(
        httpStatus.FORBIDDEN,
        "This wallet is blocked. No transaction is allowed."
      );
    }

    if (userId === payload.receiverId?.toString()) {
      throw new AppError(
        httpStatus.BAD_REQUEST,
        "You cannot send money to yourself."
      );
    }
    await Wallet.findByIdAndUpdate(
      isReceiverWallet._id,
      {
        $set: {
          balance: isReceiverWallet.balance + payload.amount,
        },
      },
      { new: true, runValidators: true, session }
    );

    const withdrawMoneyTransaction = await Transaction.create(
      [
        {
          amount: payload.amount,
          type,
          initiatedBy: role,
          wallet: isSenderWallet._id,
          fee,
          senderId: userId,
          receiverId: payload.receiverId,
          status: PayStatus.COMPLETED,
        },
      ],
      {
        session,
      }
    );
    await session.commitTransaction();
    session.endSession();
    return withdrawMoneyTransaction;
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    throw error;
  }
};

//get Transaction History by me
const getTransactionHistory = async (userId: string) => {
  // const isWallet = await Wallet.findOne({ user: userId });
  // if (!isWallet) {
  //   throw new AppError(httpStatus.NOT_FOUND, "User wallet not found");
  // }
  // const transactionHistory = await Transaction.find({ wallet: isWallet._id });

  const transactions = await Transaction.find({
    $or: [{ senderId: userId }, { receiverId: userId }],
  })
    .populate("senderId", "name email")
    .populate("receiverId", "name email")
    .sort({ createdAt: -1 });

  if (transactions.length === 0) {
    throw new AppError(httpStatus.NOT_FOUND, "No transaction history found");
  }
  return transactions;
};

//get Transaction History
const getAllTransactionHistory = async () => {
  const getAllTransaction = await Transaction.find();
  if (getAllTransaction.length === 0) {
    throw new AppError(httpStatus.NOT_FOUND, "No transaction history found");
  }
  return getAllTransaction;
};

//agent cash in
const cashIn = async (
  payload: ITransaction,
  type: string,
  role: string,
  agentId: string
) => {
  const session = await Wallet.startSession();
  session.startTransaction();
  try {
    const AGENT_COMMISSION_PERCENT = 1;
    const userWallet = await Wallet.findOne({ user: payload.receiverId });
    if (!userWallet) {
      throw new AppError(httpStatus.NOT_FOUND, "User wallet not found");
    }
    if (userWallet.isBlocked) {
      throw new AppError(httpStatus.FORBIDDEN, "User wallet is blocked");
    }

    const agentWallet = await Wallet.findOne({ user: agentId });
    if (!agentWallet) {
      throw new AppError(httpStatus.NOT_FOUND, "Agent wallet not found");
    }
    if (agentWallet.isBlocked) {
      throw new AppError(httpStatus.FORBIDDEN, "Agent wallet is blocked");
    }

    if (agentWallet.balance < payload.amount) {
      throw new AppError(
        httpStatus.BAD_REQUEST,
        `Insufficient balance. You have ${agentWallet.balance}, need ${payload.amount}`
      );
    }

    await Wallet.findByIdAndUpdate(
      agentWallet._id,
      {
        $inc: { balance: -payload.amount },
      },
      { new: true, session, runValidators: true }
    );

    await Wallet.findByIdAndUpdate(
      userWallet._id,
      {
        $inc: { balance: payload.amount },
      },
      { new: true, session, runValidators: true }
    );

    const commission = (AGENT_COMMISSION_PERCENT / 100) * payload.amount;

    const transaction = await Transaction.create(
      [
        {
          amount: payload.amount,
          type,
          senderId: agentId,
          receiverId: payload.receiverId,
          wallet: userWallet._id,
          initiatedBy: role,
          commission,
          status: PayStatus.COMPLETED,
        },
      ],
      { session }
    );

    await session.commitTransaction();
    session.endSession();
    return transaction;
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    throw error;
  }
};

//agent cash out
const cashOut = async (
  payload: ITransaction,
  type: string,
  role: string,
  agentId: string
) => {
  const session = await Wallet.startSession();
  session.startTransaction();
  try {
    const AGENT_COMMISSION_PERCENT = 1;
    if (payload.senderId?.toString() === agentId.toString()) {
      throw new AppError(
        httpStatus.BAD_REQUEST,
        "Agent cannot cash-out from self."
      );
    }
    const userWallet = await Wallet.findOne({
      user: payload.senderId,
    });
    if (!userWallet) {
      throw new AppError(httpStatus.NOT_FOUND, "User wallet not found");
    }
    if (userWallet.isBlocked === true) {
      throw new AppError(
        httpStatus.FORBIDDEN,
        "User wallet is blocked. No transaction is allowed."
      );
    }
    const { totalAmount, fee } = calculateTotalWithFee(payload?.amount);

    if (userWallet.balance < totalAmount) {
      throw new AppError(
        httpStatus.BAD_REQUEST,
        `Insufficient balance. Your balance is ${userWallet.balance}, but you need ${totalAmount} including transaction charges.`
      );
    }

    await Wallet.findByIdAndUpdate(
      userWallet._id,
      {
        $inc: {
          balance: -totalAmount,
        },
      },
      { new: true, runValidators: true, session }
    );

    const agentWallet = await Wallet.findOne({ user: agentId });
    if (!agentWallet) {
      throw new AppError(httpStatus.NOT_FOUND, "Agent wallet not found");
    }
    if (agentWallet.isBlocked === true) {
      throw new AppError(
        httpStatus.FORBIDDEN,
        "Agent wallet is blocked. No transaction is allowed."
      );
    }
    await Wallet.findByIdAndUpdate(
      agentWallet._id,
      {
        $set: {
          balance: agentWallet.balance + payload.amount,
        },
      },
      { new: true, runValidators: true, session }
    );
    const commission = (AGENT_COMMISSION_PERCENT / 100) * payload.amount;
    const cashOutTransaction = await Transaction.create(
      [
        {
          amount: payload.amount,
          type,
          senderId: payload.senderId,
          receiverId: agentId,
          wallet: userWallet._id,
          initiatedBy: role,
          commission,
          fee,
          status: PayStatus.COMPLETED,
        },
      ],
      {
        session,
      }
    );
    await session.commitTransaction();
    session.endSession();
    return cashOutTransaction;
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    throw error;
  }
};

export const TransactionService = {
  addMoney,
  withdrawMoney,
  sendMoney,
  getTransactionHistory,
  getAllTransactionHistory,
  cashIn,
  cashOut,
};
