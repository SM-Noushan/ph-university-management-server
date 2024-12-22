import status from "http-status";
import config from "../../config";
import { AuthServices } from "./auth.service";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";

const loginUser = catchAsync(async (req, res) => {
  const result = await AuthServices.loginUser(req.body);

  const { refreshToken, ...data } = result;

  res.cookie("refreshToken", refreshToken, {
    secure: config.NODE_ENV === "production",
    httpOnly: true,
  });
  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: "User logged in successfully",
    data: data,
  });
});

const changePassword = catchAsync(async (req, res) => {
  const user = { userId: req.user.userId, role: req.user.role };

  const result = await AuthServices.changePassword(user, req.body);

  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: "Password changed successfully",
    data: result,
  });
});

const refreshToken = catchAsync(async (req, res) => {
  const result = await AuthServices.refreshToken(req.cookies.refreshToken);

  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: "Token refreshed successfully",
    data: result,
  });
});

const forgetPassword = catchAsync(async (req, res) => {
  const result = await AuthServices.forgetPassword(req.body.id);

  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: "Check your email to reset password",
    data: result,
  });
});

export const AuthController = {
  loginUser,
  changePassword,
  refreshToken,
  forgetPassword,
};
