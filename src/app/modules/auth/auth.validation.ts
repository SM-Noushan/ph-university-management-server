import { z } from "zod";
import { trimmedString } from "../../utils/validation";

const loginValidationSchema = z.object({
  body: z.object({
    id: trimmedString,
    password: z.string(),
  }),
});

export const AuthValidation = {
  loginValidationSchema,
};
