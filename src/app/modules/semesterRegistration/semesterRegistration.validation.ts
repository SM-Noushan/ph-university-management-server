import { z } from "zod";
import { trimmedString, validObjectId } from "../../utils/validation";
import { SemesterRegistrationStatusEnum } from "./semesterRegistration.constant";

// Define the main SemesterRegistration schema
const CreateSemesterRegistrationValidationSchema = z.object({
  body: z.object({
    semesterRegistration: z.object({
      academicSemester: validObjectId,
      status: z.enum(SemesterRegistrationStatusEnum as [string]).optional(),
      minCredit: z.number().optional(),
      maxCredit: z.number().optional(),
      start: trimmedString.datetime(),
      end: trimmedString.datetime(),
    }),
  }),
});

const UpdateSemesterRegistrationValidationSchema = z.object({
  body: z.object({
    semesterRegistration:
      CreateSemesterRegistrationValidationSchema.shape.body.shape.semesterRegistration.deepPartial(),
  }),
});

export const SemesterRegistrationValidations = {
  CreateSemesterRegistrationValidationSchema,
  UpdateSemesterRegistrationValidationSchema,
};
