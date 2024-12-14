import { ZodError } from "zod";
import { TErrorSource, TGenericErrorResponse } from "../interface/error";

const handleZodError = (error: ZodError): TGenericErrorResponse => {
  const statusCode = 400;
  const errorSources: TErrorSource = error.issues.map(issue => {
    return {
      path: issue?.path[issue?.path?.length - 1],
      message: issue?.message,
    };
  });
  return {
    statusCode,
    message: "Validation Error",
    errorSources,
  };
};

export default handleZodError;
