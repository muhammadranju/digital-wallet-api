import express from "express";
import { TransactionController } from "./transaction.controller";
import { checkAuth } from "../../middlewares/checkAuth";
import { Role } from "../user/user.interface";
import { zodValidateRequest } from "../../middlewares/zodValidateRequest";
import { createTransactionZodSchema } from "./transaction.zod.validation";
import { queryBuilders } from "../../middlewares/queryBuilders";
import { Transaction } from "./transaction.model";

const transactionRoute = express.Router();

transactionRoute.post(
  "/add-money",
  checkAuth(Role.USER),
  zodValidateRequest(createTransactionZodSchema),
  TransactionController.addMoney
);

transactionRoute.post(
  "/withdraw",
  checkAuth(Role.USER),
  zodValidateRequest(createTransactionZodSchema),
  TransactionController.withdrawMoney
);

transactionRoute.post(
  "/send-money",
  checkAuth(Role.USER),
  zodValidateRequest(createTransactionZodSchema),
  TransactionController.sendMoney
);

transactionRoute.get(
  "/me",
  checkAuth(Role.USER, Role.AGENT),
  TransactionController.getTransactionHistory
);

transactionRoute.get(
  "/",
  checkAuth(Role.ADMIN),
    queryBuilders(Transaction),
  TransactionController.getAllTransactionHistory
);

transactionRoute.post(
  "/cash-in",
  checkAuth(Role.AGENT),
  zodValidateRequest(createTransactionZodSchema),
  TransactionController.cashIn
);

transactionRoute.post(
  "/cash-out",
  checkAuth(Role.AGENT),
  zodValidateRequest(createTransactionZodSchema),
  TransactionController.cashOut
);

export default transactionRoute;
