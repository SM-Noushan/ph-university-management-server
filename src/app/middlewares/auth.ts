import config from "../config";
import status from "http-status";
import AppError from "../errors/AppError";
import catchAsync from "../utils/catchAsync";
import jwt, { JwtPayload } from "jsonwebtoken";
import { NextFunction, Request, Response } from "express";

const auth = () =>
  catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const token = req.headers.authorization;

    // if token is present
    if (!token) throw new AppError(status.UNAUTHORIZED, "Unauthorized access");

    // if token is valid
    jwt.verify(token, config.JwtAccessSecret as string, (err, decoded) => {
      if (err) throw new AppError(status.UNAUTHORIZED, "Unauthorized access");
      req.user = decoded as JwtPayload;
      next();
    });
  });

export default auth;
