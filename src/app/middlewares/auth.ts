import config from "../config";
import status from "http-status";
import AppError from "../errors/AppError";
import catchAsync from "../utils/catchAsync";
import jwt, { JwtPayload } from "jsonwebtoken";
import { NextFunction, Request, Response } from "express";
import { TUserRole } from "../modules/user/user.interface";

const auth = (...requiredRoles: TUserRole[]) =>
  catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const token = req.headers.authorization;

    // if token is present
    if (!token) throw new AppError(status.UNAUTHORIZED, "Unauthorized access");

    // if token is valid
    jwt.verify(token, config.JwtAccessSecret as string, (err, decoded) => {
      if (err) throw new AppError(status.UNAUTHORIZED, "Unauthorized access");
      //   check if user has required role
      if (
        requiredRoles.length > 0 &&
        !requiredRoles.includes((decoded as JwtPayload)?.role)
      )
        throw new AppError(status.FORBIDDEN, "Forbidden access");

      req.user = decoded as JwtPayload;
      next();
    });
  });

export default auth;
