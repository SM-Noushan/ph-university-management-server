import status from "http-status";
import config from "../../config";
import { Document } from "mongoose";
import createToken from "./auth.utils";
import { User } from "../user/user.model";
import AppError from "../../errors/AppError";
import jwt, { JwtPayload } from "jsonwebtoken";
import { TUser } from "../user/user.interface";
import { sendEmail } from "../../utils/sendEmail";
import { TLoginUser, TPasswordChange } from "./auth.interface";

const loginUser = async (payload: TLoginUser) => {
  // validate user => check if user exists, is deleted, is blocked, and password is correct
  const userInfo = await User.validateUser({ payload });
  //   create toke and return to client
  const accessToken = createToken(
    userInfo,
    config.JwtAccessSecret as string,
    config.JwtAccessExpiration as string,
  );

  const refreshToken = createToken(
    userInfo,
    config.JwtRefreshSecret as string,
    config.JwtRefreshExpiration as string,
  );

  return {
    accessToken,
    refreshToken,
    needsPasswordChange: userInfo.needsPasswordChange,
  };
};

const changePassword = async (
  userData: { userId: string; role: string },
  payload: TPasswordChange,
) => {
  // validate user => check if user exists, is deleted, is blocked, and password is correct
  const userInfo = (await User.validateUser({
    payload: { id: userData.userId, password: payload.oldPassword },
  })) as unknown as Document & TUser;
  // update password
  userInfo.password = payload.newPassword;
  userInfo.needsPasswordChange = false;
  userInfo.passwordChangedAt = new Date();
  await userInfo.save();

  return null;
};

const refreshToken = async (token: string) => {
  const decoded = jwt.verify(
    token,
    config.JwtRefreshSecret as string,
  ) as JwtPayload;
  const { role, userId, iat } = decoded;
  // validate user => check if user exists, is authorized, is deleted, is blocked and is token issued before last password change
  await User.validateUser({
    payload: { id: userId, password: "", iat: iat },
    checkIsJWTIssuedBeforePasswordChanged: true,
    checkIsPasswordMatched: false,
  });

  const accessToken = createToken(
    { id: userId, role },
    config.JwtAccessSecret as string,
    config.JwtAccessExpiration as string,
  );

  return { accessToken };
};

const forgetPassword = async (id: string) => {
  // validate user => check if user exists, is deleted, and is blocked
  const userInfo = await User.validateUser({
    payload: { id, password: "" },
    checkIsPasswordMatched: false,
  });

  const resetToken = createToken(
    userInfo,
    config.JwtAccessSecret as string,
    "10m",
  );

  const resetUILink = `${config.resetPasswordUrl}?id=${userInfo.id}&token=${resetToken}`;

  sendEmail(userInfo.email, resetUILink);
  return null;
};

const resetPassword = async (
  token: string,
  userData: { id: string; password: string },
) => {
  const decoded = jwt.verify(
    token,
    config.JwtAccessSecret as string,
  ) as JwtPayload;
  const { userId, iat } = decoded;

  // validate user => check if user exists, is authorized, is deleted, is blocked and is token issued before last password change
  const userInfo = (await User.validateUser({
    payload: { id: userId, password: "", iat: iat },
    checkIsJWTIssuedBeforePasswordChanged: true,
    checkIsPasswordMatched: false,
  })) as unknown as Document & TUser;

  if (userInfo.id !== userData.id)
    throw new AppError(status.FORBIDDEN, "Invalid id");

  // reset password
  userInfo.password = userData.password;
  if (!userInfo.needsPasswordChange) userInfo.needsPasswordChange = false;
  userInfo.passwordChangedAt = new Date();
  await userInfo.save();

  return null;
};

export const AuthServices = {
  loginUser,
  changePassword,
  refreshToken,
  forgetPassword,
  resetPassword,
};
