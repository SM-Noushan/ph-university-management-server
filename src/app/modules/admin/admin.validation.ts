import { z } from "zod";
import {
  address,
  contactNo,
  alphaString,
  trimmedString,
} from "../../utils/validation";
import { BloodGroupEnum, GenderEnum } from "../../constants";
import { userNameValidationSchema } from "../student/student.validation";

// Define the main Admin schema
const CreateAdminValidationSchema = z.object({
  body: z.object({
    password: z
      .string({
        invalid_type_error: "Password must be a string",
      })
      .max(20, { message: "Max 20 characters" })
      .min(6, { message: "Min 6 characters" })
      .optional(),
    admin: z.object({
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
      bloodGroup: z.enum(BloodGroupEnum as [string]).optional(),
      presentAddress: address,
      permanentAddress: address,
      profileImg: trimmedString.url().optional(),
    }),
  }),
});

const UpdateAdminValidationSchema = z.object({
  body: z.object({
    admin: CreateAdminValidationSchema.shape.body.shape.admin.deepPartial(),
  }),
});

export const AdminValidations = {
  CreateAdminValidationSchema,
  UpdateAdminValidationSchema,
};
