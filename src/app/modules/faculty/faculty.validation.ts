import { z } from "zod";
import {
  address,
  contactNo,
  alphaString,
  trimmedString,
  validObjectId,
} from "../../utils/validation";
import { BloodGroupsEnum, GenderEnum } from "../../constants";
import { userNameValidationSchema } from "../student/student.validation";

// Define the main Faculty schema
const CreateFacultyValidationSchema = z.object({
  body: z.object({
    password: z
      .string({
        invalid_type_error: "Password must be a string",
      })
      .max(20, { message: "Max 20 characters" })
      .min(6, { message: "Min 6 characters" })
      .optional(),
    faculty: z.object({
      designation: alphaString,
      name: userNameValidationSchema,
      gender: z.enum(GenderEnum as [string]),
      dateOfBirth: z
        .string()
        .optional()
        .transform(value => (value ? new Date(value) : undefined))
        .refine(date => date === undefined || !isNaN(date.getTime()), {
          message: "Invalid date format",
        }),
      email: trimmedString.email(),
      contactNo: contactNo,
      emergencyContactNo: contactNo,
      bloodGroup: z.enum(BloodGroupsEnum as [string]).optional(),
      presentAddress: address,
      permanentAddress: address,
      profileImg: trimmedString.url().optional(),
      academicDepartment: validObjectId,
    }),
  }),
});

const UpdateFacultyValidationSchema = z.object({
  body: z.object({
    faculty:
      CreateFacultyValidationSchema.shape.body.shape.faculty.deepPartial(),
  }),
});

export const FacultyValidations = {
  CreateFacultyValidationSchema,
  UpdateFacultyValidationSchema,
};
