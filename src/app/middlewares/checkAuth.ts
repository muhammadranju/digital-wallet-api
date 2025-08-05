import { NextFunction, Request, Response } from "express";
import AppError from "../errorHelpers/AppError";
import httpStatus from "http-status-codes";
import { verifyToken } from "../utils/jwt";
import config from "../config";
import { JwtPayload } from "jsonwebtoken";
import { User } from "../modules/user/user.model";
import { IsActive } from "../modules/user/user.interface";

export const checkAuth =
  (...authRoles: string[]) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const accessToken =
        req.headers.authorization?.split(" ")[1] || req.headers.authorization;

      if (!accessToken) {
        throw new AppError(httpStatus.FORBIDDEN, "Access token is missing");
      }
      const verify_token = verifyToken(
        accessToken,
        config.JWT.JWT_ACCESS_SECRET
      ) as JwtPayload;

      if (!verify_token) {
        throw new AppError(httpStatus.UNAUTHORIZED, "Invalid access token");
      }

      const isExistUser = await User.findOne({ email: verify_token.email });
      if (!isExistUser) {
        throw new AppError(httpStatus.BAD_REQUEST, "Email does not exist");
      }

      if (isExistUser.isDeleted === true) {
        throw new AppError(httpStatus.FORBIDDEN, "Your account is deleted");
      }
      if (
        isExistUser.isActive === IsActive.BLOCKED ||
        isExistUser.isActive === IsActive.SUSPENDED
      ) {
        throw new AppError(
          httpStatus.FORBIDDEN,
          `Your account is ${isExistUser.isActive}`
        );
      }

      if (!authRoles.includes(verify_token.role)) {
        throw new AppError(
          httpStatus.FORBIDDEN,
          "You do not have permission to access this resource"
        );
      }
      req.user = verify_token;
      next();
    } catch (error) {
      next(error);
    }
  };
