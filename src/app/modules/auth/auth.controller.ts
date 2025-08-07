import { NextFunction, Request, Response } from "express";
import { sendResponse } from "../../utils/sendResponse";
import httpStatus from "http-status-codes";
import { AuthService } from "./auth.service";
import { catchAsync } from "../../utils/catchAsync";
import { setAuthCookie } from "../../utils/setCookie";
import config from "../../config";

// user login
const userLogin = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const userInfo = await AuthService.userLogin(req.body);

    setAuthCookie(res, userInfo);
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "User logged in successfully",
      data: userInfo,
    });
  }
);

// user logout
const logOutUser = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    res.clearCookie("accessToken", {
      httpOnly: true,
      secure: config.NODE_ENV !== "development",
      sameSite: "lax",
    });
    res.clearCookie("refreshToken", {
      httpOnly: true,
      secure: config.NODE_ENV !== "development",
      sameSite: "lax",
    });
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "User logged out successfully",
      data: null,
    });
  }
);

export const AuthController = {
  userLogin,
  logOutUser,
};
