import { z } from "zod";

const ChangeStatusValidationSchema = z.object({
  body: z.object({
    status: z.enum(["in-progress", "blocked"]),
  }),
});

export const UserValidations = {
  ChangeStatusValidationSchema,
};
