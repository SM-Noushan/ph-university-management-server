import jwt from "jsonwebtoken";
import config from "../../config";
import { User } from "../user/user.model";
import { TLoginUser } from "./auth.interface";

const loginUser = async (payload: TLoginUser) => {
  // validate user => check if user exists, is deleted, is blocked, and password is correct
  const userInfo = await User.validateUser(payload);
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

export const AuthServices = { loginUser };
