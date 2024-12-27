import { z } from "zod";
import { validObjectId } from "../../utils/validation";

const createEnrolledCourseValidationSchema = z.object({
  body: z.object({
    offeredCourse: validObjectId,
  }),
});
const updateEnrolledCourseValidationSchema = {};

export const EnrolledCourseValidations = {
  createEnrolledCourseValidationSchema,
  updateEnrolledCourseValidationSchema,
};
