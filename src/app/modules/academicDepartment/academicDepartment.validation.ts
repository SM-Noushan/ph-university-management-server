import { z } from "zod";
import {
  alphaStringWithDynamicError,
  validObjectId,
} from "../../utils/validation";

const CreateAcademicDepartmentValidationSchema = z.object({
  body: z.object({
    name: alphaStringWithDynamicError(
      "Academic department name must be a text",
      ["body", "name"],
    ),
    academicFaculty: validObjectId,
  }),
});

const UpdateAcademicDepartmentValidationSchema = z.object({
  body: CreateAcademicDepartmentValidationSchema.shape.body.partial(),
});

export const AcademicDepartmentValidations = {
  CreateAcademicDepartmentValidationSchema,
  UpdateAcademicDepartmentValidationSchema,
};
