import config from "../config";
import status from "http-status";
import AppError from "../errors/AppError";
import catchAsync from "../utils/catchAsync";
import jwt, { JwtPayload } from "jsonwebtoken";
import { User } from "../modules/user/user.model";
import { NextFunction, Request, Response } from "express";
import { TUserRole } from "../modules/user/user.interface";

const auth = (...requiredRoles: TUserRole[]) =>
  catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const token = req.headers.authorization;

    // if token is present
    if (!token) throw new AppError(status.UNAUTHORIZED, "Unauthorized access");

    const decoded = jwt.verify(
      token,
      config.JwtAccessSecret as string,
    ) as JwtPayload;
    const { userId, role, iat } = decoded;
    // validate user => check if user exists, is authorized, is deleted, is blocked
    await User.validateUser({
      payload: { id: userId, password: "", iat: iat },
      checkIsJWTIssuedBeforePasswordChanged: true,
      checkIsPasswordMatched: false,
    });
    //   check if user has required role
    if (requiredRoles.length > 0 && !requiredRoles.includes(role))
      throw new AppError(status.FORBIDDEN, "Forbidden access");

    req.user = decoded;
    next();
  });

export default auth;
