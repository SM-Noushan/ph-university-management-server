import { AnyZodObject } from "zod";
import { NextFunction, Request, Response } from "express";

const validateRequest =
  (schema: AnyZodObject) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const parsedPayload = await schema.parseAsync({ body: req.body });
      req.body = parsedPayload.body;
      return next();
    } catch (error) {
      next(error);
    }
  };

export default validateRequest;
