import { z } from "zod";
import { validObjectId } from "../../utils/validation";

const createEnrolledCourseValidationSchema = z.object({
  body: z.object({
    offeredCourse: validObjectId,
  }),
});

const updateEnrolledCourseMarksValidationSchema = z.object({
  body: z.object({
    student: validObjectId,
    offeredCourse: validObjectId,
    semesterRegistration: validObjectId,
    courseMarks: z
      .object({
        classTest1: z.number().int().min(0).max(15).optional(),
        midTerm: z.number().int().min(0).max(70).optional(),
        classTest2: z.number().int().min(0).max(15).optional(),
        finalTerm: z.number().int().min(0).max(100).optional(),
      })
      .refine(
        marks => Object.values(marks).some(value => value !== undefined),
        {
          message: "At least one field in courseMarks must be provided.",
        },
      ),
  }),
});

export const EnrolledCourseValidations = {
  createEnrolledCourseValidationSchema,
  updateEnrolledCourseMarksValidationSchema,
};
