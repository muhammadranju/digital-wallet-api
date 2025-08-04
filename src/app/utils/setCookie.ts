import { Response } from "express";
import config from "../config";

export interface AuthTokens {
  accessToken?: string;
  refreshToken?: string;
}
export const setAuthCookie = (res: Response, tokenInfo: AuthTokens) => {
  if (tokenInfo.accessToken) {
    res.cookie("accessToken", tokenInfo.accessToken, {
      httpOnly: true,
      secure: config.NODE_ENV !== "development",
      sameSite: "none",
    });
  }
  if (tokenInfo.refreshToken) {
    res.cookie("refreshToken", tokenInfo.refreshToken, {
      httpOnly: true,
      secure: config.NODE_ENV !== "development",
      sameSite: "none",
    });
  }
};
