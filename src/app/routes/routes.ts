import { Router } from "express";
import userRoute from "../modules/user/user.routes";
import authRoute from "../modules/auth/auth.routes";
import transactionRoute from "../modules/transaction/transaction.routes";
import walletRoute from "../modules/wallet/wallet.routes";

const routes = Router();

routes.use("/users", userRoute);
routes.use("/auth", authRoute);
routes.use("/transactions", transactionRoute);
routes.use("/wallets", walletRoute);

export default routes;
