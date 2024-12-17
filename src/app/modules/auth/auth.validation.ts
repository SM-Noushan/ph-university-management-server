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

const refreshTokenValidationSchema = z.object({
  cookies: z.object({
    refreshToken: z.string({
      required_error: "Refresh token is required",
    }),
  }),
});

export const AuthValidation = {
  loginValidationSchema,
  passwordValidationSchema,
  refreshTokenValidationSchema,
};
