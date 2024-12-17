import { TLoginUser } from "./auth.interface";

const loginUser = async (payload: TLoginUser) => {
  return { payload };
};

export const AuthServices = { loginUser };
