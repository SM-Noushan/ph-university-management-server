import { User } from "../user/user.model";
import { TLoginUser } from "./auth.interface";

const loginUser = async (payload: TLoginUser) => {
  // validate user => check if user exists, is deleted, is blocked, and password is correct
  await User.validateUser(payload);

  return { payload };
};

export const AuthServices = { loginUser };
