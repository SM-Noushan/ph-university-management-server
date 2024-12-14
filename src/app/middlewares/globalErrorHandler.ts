/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { ZodError } from "zod";
import mongoose from "mongoose";
import { ErrorRequestHandler } from "express";
import { TErrorSource } from "../interface/error";
import handleZodError from "../errors/handleZodError";
import { handleMongooseError } from "../errors/handleMongooseError";

const globalErrorHandler: ErrorRequestHandler = (error, req, res, next) => {
  let statusCode = error.statusCode || 500;
  let message = error.message || "Something went wrong!";
  let errorSources: TErrorSource = [
    {
      path: "",
      message,
    },
  ];
  let simplifiedError;
  if (error instanceof ZodError) simplifiedError = handleZodError(error);
  if (error instanceof mongoose.Error.ValidationError)
    simplifiedError = handleMongooseError.handleMongooseValidationError(error);
  if (error instanceof mongoose.Error.CastError)
    simplifiedError = handleMongooseError.handleMongooseCastError(error);
  // duplicate value error
  if (error.code === 11000) {
    message = message.match(/"([^"]*)"/)[1] + " already exists";
    errorSources[0].path = Object.keys(error.keyValue)[0];
    errorSources[0].message = message;
  }

  if (simplifiedError) {
    statusCode = simplifiedError.statusCode;
    message = simplifiedError.message;
    errorSources = simplifiedError.errorSources;
  }
  res.status(statusCode).json({
    success: false,
    message,
    errorSources,
    stack: process.env.NODE_ENV === "development" ? error.stack : "🥞",
    // myError: error,
  });
};

export default globalErrorHandler;
