import config from "../config";
import { IUser } from "../modules/user/user.interface";
import { generateToken } from "./jwt";

export const createUserTokens = (user: Partial<IUser>) => {
  const tokenPayload = {
    email: user.email,
    role: user.role,
    id: user._id,
  };

  const accessToken = generateToken(
    tokenPayload,
    config.JWT.JWT_ACCESS_SECRET,
    config.JWT.JWT_ACCESS_EXPIRATION
  );

  const refreshToken = generateToken(
    tokenPayload,
    config.JWT.JWT_REFRESH_SECRET,
    config.JWT.JWT_REFRESH_EXPIRATION
  );
  return {
    accessToken,
    refreshToken,
  };
};
