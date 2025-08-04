import { Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import httpStatus from "http-status-codes";
import { WalletServices } from "./wallet.service";
import { JwtPayload } from "jsonwebtoken";
import AppError from "../../errorHelpers/AppError";

//get all wallets
const getAllWalletsByRole = catchAsync(async (req: Request, res: Response) => {
  const role = req.query.role as string;
  if (!role) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "Role query parameter is required"
    );
  }
  const wallets = await WalletServices.getAllWalletsByRole(role.toUpperCase());
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: `All Wallets for role ${role} Retrieved Successfully`,
    data: wallets,
  });
});

const getMeWallet = catchAsync(async (req: Request, res: Response) => {
  const decoded = req.user as JwtPayload;
  const wallets = await WalletServices.getMeWallet(decoded.id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Your Wallet Retrieved Successfully",
    data: wallets,
  });
});

const blockWallet = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const wallet = await WalletServices.blockWallet(id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Wallet Blocked Successfully",
    data: wallet,
  });
});

const unblockWallet = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const wallet = await WalletServices.unblockWallet(id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Wallet UnBlocked Successfully",
    data: wallet,
  });
});

export const WalletController = {
  getAllWalletsByRole,
  getMeWallet,
  blockWallet,
  unblockWallet,
};
