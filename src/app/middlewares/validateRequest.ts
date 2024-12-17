import { AnyZodObject } from "zod";
import catchAsync from "../utils/catchAsync";
import { NextFunction, Request, Response } from "express";

const validateRequest = (schema: AnyZodObject) =>
  catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const parsedPayload = await schema.parseAsync({ body: req.body });
    req.body = parsedPayload.body;
    return next();
  });

export default validateRequest;
