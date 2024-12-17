import bcrypt from "bcrypt";
import httpStatus from "http-status";
import { User } from "../user/user.model";
import AppError from "../../errors/AppError";
import { TLoginUser } from "./auth.interface";
import validateDoc from "../../utils/validateDoc";

const loginUser = async (payload: TLoginUser) => {
  // checking if user exists
  const userInfo = await validateDoc({
    model: User,
    query: { id: payload.id },
    errMsg: "!Invalid credentials",
  });

  //   check if user is deleted
  if (userInfo.isDeleted)
    throw new AppError(
      httpStatus.FORBIDDEN,
      "!Account deleted. !!Access denied",
    );
  //   check if user is blocked
  if (userInfo?.status === "blocked")
    throw new AppError(httpStatus.FORBIDDEN, "!Blocked. !!Access denied");

  //   check if password is correct
  const isPasswordCorrect = await bcrypt.compare(
    payload.password,
    userInfo.password,
  );
  if (!isPasswordCorrect)
    throw new AppError(httpStatus.UNAUTHORIZED, "!Invalid credentials");

  return { payload };
};

export const AuthServices = { loginUser };
