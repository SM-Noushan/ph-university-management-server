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
          const start = new Date(`1970-01-01T${body.startTime}:00Z`);
          const end = new Date(`1970-01-01T${body.endTime}:00Z`);
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
        faculty: validObjectId,
        maxCapacity: z.number(),
        days: z.array(z.enum(DaysEnum as [string])),
        startTime: timeStringSchema,
        endTime: timeStringSchema,
      })
      .refine(
        body => {
          const start = new Date(`1970-01-01T${body.startTime}:00Z`);
          const end = new Date(`1970-01-01T${body.endTime}:00Z`);
          return end > start;
        },
        {
          message: "Start time should be before End time!",
        },
      ),
  }),
});

export const OfferedCourseValidations = {
  CreateOfferedCourseValidationSchema,
  UpdateOfferedCourseValidationSchema,
};
