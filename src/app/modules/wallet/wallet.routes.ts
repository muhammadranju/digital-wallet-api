import express from "express";
import { checkAuth } from "../../middlewares/checkAuth";
import { Role } from "../user/user.interface";
import { WalletController } from "./wallet.controller";

const walletRoute = express.Router();

walletRoute.get(
  "/",
  checkAuth(Role.ADMIN),
  WalletController.getAllWalletsUsingRoles
);

walletRoute.get(
  "/me",
  checkAuth(Role.AGENT, Role.USER),
  WalletController.getMyWallets
);

walletRoute.patch(
  "/block/:id",
  checkAuth(Role.ADMIN),
  WalletController.blockWallet
);

walletRoute.patch(
  "/unblock/:id",
  checkAuth(Role.ADMIN),
  WalletController.unblockWallet
);
export default walletRoute;
