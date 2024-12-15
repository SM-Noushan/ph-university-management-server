import { z } from "zod";
import { alphaString, validObjectId } from "../../utils/validation";

const preRequisiteCourseValidationSchema = z.object({
  course: validObjectId,
  isDeleted: z.boolean().optional(),
});

// Define the main Course schema
const CreateCourseValidationSchema = z.object({
  body: z.object({
    course: z.object({
      title: alphaString,
      prefix: alphaString,
      code: z.number(),
      credits: z.number(),
      preRequisiteCourses: z
        .array(preRequisiteCourseValidationSchema)
        .optional(),
    }),
  }),
});

const UpdateCourseValidationSchema = z.object({
  body: z.object({
    course: CreateCourseValidationSchema.shape.body.shape.course.deepPartial(),
  }),
});

const AssignFacultiesToCourseValidationSchema = z.object({
  body: z.object({
    faculties: z.array(validObjectId),
  }),
});

export const CourseValidations = {
  CreateCourseValidationSchema,
  UpdateCourseValidationSchema,
  AssignFacultiesToCourseValidationSchema,
};
