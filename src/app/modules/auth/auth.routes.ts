import express from "express";
import { AuthController } from "./auth.controller";

const authRoute = express.Router();

authRoute.post("/login", AuthController.createLogin);
authRoute.post("/logout", AuthController.logOutUser);

export default authRoute;
