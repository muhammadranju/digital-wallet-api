import express from "express";
import { zodValidateRequest } from "../../middlewares/zodValidateRequest";
import { createUserZodSchema } from "./user.zod.validation";
import { UserControllers } from "./user.controller";
import { checkAuth } from "../../middlewares/checkAuth";
import { Role } from "./user.interface";

const userRoute = express.Router();

userRoute.post(
  "/register",
  zodValidateRequest(createUserZodSchema),
  UserControllers.createUser
);

userRoute.get("/", checkAuth(Role.ADMIN), UserControllers.getAllUserOrAgent);

userRoute.patch(
  "/approve/:id",
  checkAuth(Role.ADMIN),
  UserControllers.approveAgent
);

userRoute.patch(
  "/suspend/:id",
  checkAuth(Role.ADMIN),
  UserControllers.suspendAgent
);

export default userRoute;
