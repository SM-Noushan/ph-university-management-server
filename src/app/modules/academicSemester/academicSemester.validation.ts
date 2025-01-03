import { z } from "zod";
import status from "http-status";
import {
  AcademicSemesterCodeEnum,
  AcademicSemesterNameEnum,
  MonthEnum,
} from "./academicSemester.constant";
import AppError from "../../errors/AppError";

export const CreateAcademicSemesterValidationSchema = z.object({
  body: z.object({
    name: z.enum(AcademicSemesterNameEnum as [string]),
    code: z.enum(AcademicSemesterCodeEnum as [string]),
    year: z.string().transform(value => {
      const date = new Date(value);
      if (isNaN(date.getTime())) {
        throw new AppError(status.NOT_FOUND, "Invalid year format");
      }
      return date.getFullYear();
    }),
    startMonth: z.enum(MonthEnum as [string]),
    endMonth: z.enum(MonthEnum as [string]),
  }),
});

export const UpdateAcademicSemesterValidationSchema = z.object({
  body: CreateAcademicSemesterValidationSchema.shape.body.partial(),
});

export const AcademicSemesterValidations = {
  CreateAcademicSemesterValidationSchema,
  UpdateAcademicSemesterValidationSchema,
};
