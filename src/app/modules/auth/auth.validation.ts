import { z } from "zod";
import { trimmedString } from "../../utils/validation";

const loginValidationSchema = z.object({
  body: z.object({
    id: trimmedString,
    password: z.string(),
  }),
});

const passwordValidationSchema = z.object({
  body: z.object({
    oldPassword: z.string(),
    newPassword: z.string(),
  }),
});

export const AuthValidation = {
  loginValidationSchema,
  passwordValidationSchema,
};
