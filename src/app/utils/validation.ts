import { Types } from "mongoose";
import { z } from "zod";

// Utility schemas
export const trimmedString = z.string().trim();

export const alphaString = trimmedString.regex(
  /^[A-Za-z\s]+$/,
  "Must be valid text",
);

export const alphaStringWithDynamicError = (
  errorMessage: string,
  path: string[],
) =>
  z.preprocess(val => {
    if (typeof val !== "string") {
      throw new z.ZodError([
        {
          message: errorMessage,
          path,
          code: "invalid_type",
          expected: "string",
          received: typeof val,
        },
      ]);
    }
    return val;
  }, alphaString);

// Custom validation for MongoDB ObjectId as a string
export const ObjectIdValidationSchema = trimmedString
  .refine(value => Types.ObjectId.isValid(value), {
    message: "Invalid Id format",
  })
  .transform(value => new Types.ObjectId(value));

export const validObjectId = trimmedString.refine(
  value => Types.ObjectId.isValid(value),
  {
    message: "Invalid Id format",
  },
);

export const contactNo = trimmedString.regex(
  /^\d{10,15}$/,
  "Must be a valid contact number",
);

export const address = trimmedString.min(
  5,
  "Address must be at least 5 characters long",
);
