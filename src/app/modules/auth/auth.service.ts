import jwt from "jsonwebtoken";
import config from "../../config";
import { Document } from "mongoose";
import { User } from "../user/user.model";
import { TUser } from "../user/user.interface";
import { TLoginUser, TPasswordChange } from "./auth.interface";

const loginUser = async (payload: TLoginUser) => {
  // validate user => check if user exists, is deleted, is blocked, and password is correct
  const userInfo = await User.validateUser({ payload });
  //   create toke and return to client
  const accessToken = jwt.sign(
    {
      userId: userInfo.id,
      role: userInfo.role,
    },
    config.JwtAccessSecret as string,
    {
      expiresIn: "10d",
    },
  );

  return { accessToken, needsPasswordChange: userInfo.needsPasswordChange };
};

const changeUserPassword = async (
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

export const AuthServices = { loginUser, changeUserPassword };
