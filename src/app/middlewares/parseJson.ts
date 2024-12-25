import catchAsync from "../utils/catchAsync";
import { NextFunction, Request, Response } from "express";

const parseJson = () =>
  catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    req.body = JSON.parse(req?.body?.data);
    next();
  });

export default parseJson;
