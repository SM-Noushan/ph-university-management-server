import { z } from "zod";
import {
  timeStringSchema,
  trimmedString,
  validObjectId,
} from "../../utils/validation";
import { DaysEnum } from "./offeredCourses.constant";

const CreateOfferedCourseValidationSchema = z.object({
  body: z.object({
    offeredCourse: z
      .object({
        semesterRegistration: validObjectId,
        academicFaculty: validObjectId,
        academicDepartment: validObjectId,
        course: validObjectId,
        faculty: validObjectId,
        section: trimmedString,
        maxCapacity: z.number(),
        days: z.array(z.enum(DaysEnum as [string])),
        startTime: timeStringSchema,
        endTime: timeStringSchema,
      })
      .refine(
        body => {
          const start = new Date(`1970-01-01T${body.startTime}:00`);
          const end = new Date(`1970-01-01T${body.endTime}:00`);
          return end > start;
        },
        {
          message: "Start time should be before End time!",
        },
      ),
  }),
});

const UpdateOfferedCourseValidationSchema = z.object({
  body: z.object({
    offeredCourse: z
      .object({
        faculty: validObjectId.optional(),
        maxCapacity: z.number().optional(),
        days: z.array(z.enum(DaysEnum as [string])).optional(),
        startTime: timeStringSchema.optional(),
        endTime: timeStringSchema.optional(),
      })
      .refine(
        body => {
          // Ensure both startTime and endTime are either present or missing
          const hasStartTime = !!body.startTime;
          const hasEndTime = !!body.endTime;

          // If one is present but the other is missing, it's invalid
          if (hasStartTime !== hasEndTime) return false;

          // If both are present, validate that startTime is before endTime
          if (hasStartTime && hasEndTime) {
            const start = new Date(`1970-01-01T${body.startTime}:00`);
            const end = new Date(`1970-01-01T${body.endTime}:00`);
            return end > start;
          }

          // If both are missing, it's valid
          return true;
        },
        {
          message:
            "Either both startTime and endTime must be provided or neither.",
        },
      ),
  }),
});

export const OfferedCourseValidations = {
  CreateOfferedCourseValidationSchema,
  UpdateOfferedCourseValidationSchema,
};
