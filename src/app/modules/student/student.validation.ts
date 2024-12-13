// import Joi from "joi";

// const StudentValidationSchema = Joi.object({
//   id: Joi.string().required().messages({
//     "string.base": "Student ID must be a string",
//     "any.required": "Student ID is required",
//   }),
//   name: Joi.object({
//     firstName: Joi.string()
//       .pattern(/^[A-Za-z]+$/)
//       .required()
//       .messages({
//         "string.base": "First name must be a string",
//         "string.pattern.base":
//           "First name must contain only alphabetic characters",
//         "any.required": "First name is required",
//       }),
//     middleName: Joi.string().optional().messages({
//       "string.base": "Middle name must be a string",
//     }),
//     lastName: Joi.string()
//       .pattern(/^[A-Za-z]+$/)
//       .required()
//       .messages({
//         "string.base": "Last name must be a string",
//         "string.pattern.base":
//           "Last name must contain only alphabetic characters",
//         "any.required": "Last name is required",
//       }),
//   }).required(),
//   gender: Joi.string().required().valid("male", "female").messages({
//     "string.base": "Gender must be a string",
//     "any.required": "Gender is required",
//     "any.only": "{#value} is not a valid gender",
//   }),
//   dateOfBirth: Joi.date().optional().messages({
//     "date.base": "Date of birth must be a valid date",
//   }),
//   email: Joi.string().email().required().messages({
//     "string.base": "Email must be a string",
//     "string.email": "Email must be a valid email address",
//     "any.required": "Email is required",
//   }),
//   contactNo: Joi.string().required().messages({
//     "string.base": "Contact number must be a string",
//     "any.required": "Contact number is required",
//   }),
//   emergencyContactNo: Joi.string().required().messages({
//     "string.base": "Emergency contact number must be a string",
//     "any.required": "Emergency contact number is required",
//   }),
//   bloodGroup: Joi.string()
//     .valid("A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-")
//     .optional()
//     .messages({
//       "string.base": "Blood group must be a string",
//       "any.only": "{#value} is not a valid blood group",
//     }),
//   presentAddress: Joi.string().required().messages({
//     "string.base": "Present address must be a string",
//     "any.required": "Present address is required",
//   }),
//   permanentAddress: Joi.string().required().messages({
//     "string.base": "Permanent address must be a string",
//     "any.required": "Permanent address is required",
//   }),
//   guardian: Joi.object({
//     fatherName: Joi.string().required().messages({
//       "string.base": "Father's name must be a string",
//       "any.required": "Father's name is required",
//     }),
//     fatherOccupation: Joi.string().required().messages({
//       "string.base": "Father's occupation must be a string",
//       "any.required": "Father's occupation is required",
//     }),
//     fatherContactNo: Joi.string().required().messages({
//       "string.base": "Father's contact number must be a string",
//       "any.required": "Father's contact number is required",
//     }),
//     motherName: Joi.string().required().messages({
//       "string.base": "Mother's name must be a string",
//       "any.required": "Mother's name is required",
//     }),
//     motherOccupation: Joi.string().required().messages({
//       "string.base": "Mother's occupation must be a string",
//       "any.required": "Mother's occupation is required",
//     }),
//     motherContactNo: Joi.string().required().messages({
//       "string.base": "Mother's contact number must be a string",
//       "any.required": "Mother's contact number is required",
//     }),
//   }).required(),
//   localGuardian: Joi.object({
//     name: Joi.string().required().messages({
//       "string.base": "Local guardian's name must be a string",
//       "any.required": "Local guardian's name is required",
//     }),
//     occupation: Joi.string().required().messages({
//       "string.base": "Local guardian's occupation must be a string",
//       "any.required": "Local guardian's occupation is required",
//     }),
//     contactNo: Joi.string().required().messages({
//       "string.base": "Local guardian's contact number must be a string",
//       "any.required": "Local guardian's contact number is required",
//     }),
//     address: Joi.string().required().messages({
//       "string.base": "Local guardian's address must be a string",
//       "any.required": "Local guardian's address is required",
//     }),
//   }).required(),
//   profileImg: Joi.string().uri().optional().messages({
//     "string.uri": "Profile image must be a valid URI",
//   }),
//   isActive: Joi.boolean().optional().default(true).messages({
//     "boolean.base": "isActive must be a boolean",
//   }),
// });

// export default StudentValidationSchema;

import { z } from "zod";
import {
  address,
  alphaString,
  contactNo,
  ObjectIdValidationSchema,
  trimmedString,
} from "../../utils/validation";

// Define reusable components for sub-schemas
export const userNameValidationSchema = z.object({
  firstName: alphaString,
  middleName: trimmedString.optional(),
  lastName: alphaString,
});

export const guardianValidationSchema = z.object({
  fatherName: alphaString,
  fatherOccupation: alphaString,
  fatherContactNo: contactNo,
  motherName: alphaString,
  motherOccupation: alphaString,
  motherContactNo: contactNo,
});

export const localGuardianValidationSchema = z.object({
  name: alphaString,
  occupation: alphaString,
  contactNo: contactNo,
  address: address,
});

// Define the main Student schema
export const CreateStudentValidationSchema = z.object({
  body: z.object({
    password: z
      .string({
        invalid_type_error: "Password must be a string",
      })
      .max(20, { message: "Max 20 characters" })
      .min(6, { message: "Min 6 characters" })
      .optional(),
    student: z.object({
      name: userNameValidationSchema,
      gender: z.enum(["male", "female"]),
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
      // bloodGroup: z
      //   .enum(["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"])
      //   .optional(),
      presentAddress: address,
      permanentAddress: address,
      guardian: guardianValidationSchema,
      localGuardian: localGuardianValidationSchema,
      admissionSemester: ObjectIdValidationSchema,
      academicDepartment: ObjectIdValidationSchema,
      profileImg: trimmedString.url().optional(),
    }),
  }),
});

export const UpdateStudentValidationSchema = z.object({
  body: z.object({
    student:
      CreateStudentValidationSchema.shape.body.shape.student.deepPartial(),
  }),
});

export const StudentValidations = {
  CreateStudentValidationSchema,
  UpdateStudentValidationSchema,
};
