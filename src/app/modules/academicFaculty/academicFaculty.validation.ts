import { z } from "zod";

export const AcademicFacultyValidationSchema = z.object({
  body: z.object({
    name: z
      .string({
        invalid_type_error: "Academic faculty must be a text",
      })
      .trim()
      .min(1),
  }),
});

export default AcademicFacultyValidationSchema;
