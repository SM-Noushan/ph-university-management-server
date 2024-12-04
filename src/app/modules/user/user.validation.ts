import { z } from "zod";

export const UserValidationSchema = z.object({
  id: z.string(),
  password: z
    .string()
    .max(20, { message: "Max 20 characters" })
    .min(6, { message: "Min 6 characters" }),
  needsPasswordChange: z.boolean().optional().default(true),
  role: z.enum(["admin", "faculty", "student"]),
  status: z.enum(["in-progress", "blocked"]).default("in-progress"),
  isDeleted: z.boolean().optional().default(false),
});

export default UserValidationSchema;
