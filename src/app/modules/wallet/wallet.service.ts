import AppError from "../../errorHelpers/AppError";
import { Role } from "../user/user.interface";
import { Wallet } from "./wallet.model";
import httpStatus from "http-status-codes";

//get all wallets
const getAllWalletsUsingRoles = async (role: string) => {
  if (role !== Role.USER && role !== Role.AGENT) {
    throw new AppError(httpStatus.BAD_REQUEST, `Invalid role: ${role}`);
  }
  const wallets = await Wallet.find().populate({
    path: "user",
    match: { role: role },
    select: "name email role",
  });
  const filterWallets = wallets.filter((wallet) => wallet.user);
  return filterWallets;
};

const getMyWallets = async (id: string) => {
  const wallet = await Wallet.findOne({ user: id }).populate({
    path: "user",
    select: "name email role",
  });

  if (wallet?.isBlocked === true) {
    throw new AppError(
      httpStatus.FORBIDDEN,
      "This wallet is blocked. You can not see Wallet."
    );
  }
  return wallet;
};

const blockWallet = async (id: string) => {
  const wallet = await Wallet.findById(id);

  if (!wallet) {
    throw new AppError(httpStatus.NOT_FOUND, "Wallet not found");
  }

  if (wallet.isBlocked) {
    throw new AppError(httpStatus.BAD_REQUEST, "Wallet is already blocked");
  }
  wallet.isBlocked = true;
  await wallet.save();
  return wallet;
};

const unblockWallet = async (id: string) => {
  const wallet = await Wallet.findById(id);

  if (!wallet) {
    throw new AppError(httpStatus.NOT_FOUND, "Wallet not found");
  }

  if (!wallet.isBlocked) {
    throw new AppError(httpStatus.BAD_REQUEST, "Wallet is already unblocked");
  }
  wallet.isBlocked = false;
  await wallet.save();
  return wallet;
};

export const WalletServices = {
  getAllWalletsUsingRoles,
  getMyWallets,
  blockWallet,
  unblockWallet,
};
