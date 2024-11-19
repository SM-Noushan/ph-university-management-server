import { Schema, model } from "mongoose";
import {
  Guardian,
  LocalGuardian,
  Student,
  UserName,
} from "./student.interface";
import validator from "validator";

const userNameSchema = new Schema<UserName>({
  firstName: {
    type: String,
    required: [true, "First name is required"],
  },
  middleName: {
    type: String,
  },
  lastName: {
    type: String,
    required: [true, "Last name is required"],
    validate: {
      validator: function (value: string) {
        return validator.isAlpha(value);
      },
      message: "{VALUE} is not a valid last name",
    },
  },
});

const guardianSchema = new Schema<Guardian>({
  fatherName: {
    type: String,
    required: [true, "Father's name is required"],
  },
  fatherOccupation: {
    type: String,
    required: [true, "Father's occupation is required"],
  },
  fatherContactNo: {
    type: String,
    required: [true, "Father's contact number is required"],
  },
  motherName: {
    type: String,
    required: [true, "Mother's name is required"],
  },
  motherOccupation: {
    type: String,
    required: [true, "Mother's occupation is required"],
  },
  motherContactNo: {
    type: String,
    required: [true, "Mother's contact number is required"],
  },
});

const localGuardianSchema = new Schema<LocalGuardian>({
  name: {
    type: String,
    required: [true, "Local guardian's name is required"],
  },
  occupation: {
    type: String,
    required: [true, "Local guardian's occupation is required"],
  },
  contactNo: {
    type: String,
    required: [true, "Local guardian's contact number is required"],
  },
  address: {
    type: String,
    required: [true, "Local guardian's address is required"],
  },
});

const studentsSchema = new Schema<Student>({
  id: {
    type: String,
    required: [true, "Student ID is required"],
    unique: true,
    validate: {
      validator: async function (value: string) {
        const count: number = await model("Student").countDocuments({
          id: value,
        });
        return count === 0;
      },
      message: "ID - {VALUE} already exists",
    },
  },
  name: {
    type: userNameSchema,
    required: [true, "Student name is required"],
  },
  gender: {
    type: String,
    enum: {
      values: ["male", "female"],
      message: "{VALUE} is not supported as a gender",
    },
    required: [true, "Gender is required"],
  },
  dateOfBirth: {
    type: Date,
  },
  email: {
    type: String,
    required: [true, "Email is required"],
    unique: true,
    validate: [
      {
        validator: async function (value: string) {
          return validator.isEmail(value);
        },
        message: "{VALUE} is not a valid email",
      },
      {
        validator: async function (email: string) {
          const count: number = await model("Student").countDocuments({
            email,
          });
          return count === 0;
        },
        message: "Email - {VALUE} already exists",
      },
    ],
  },
  contactNo: {
    type: String,
    required: [true, "Contact number is required"],
  },
  emergencyContactNo: {
    type: String,
    required: [true, "Emergency contact number is required"],
  },
  bloodGroup: {
    type: String,
    enum: {
      values: ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"],
      message: "{VALUE} is not supported as a blood group",
    },
  },
  presentAddress: {
    type: String,
    required: [true, "Present address is required"],
  },
  permanentAddress: {
    type: String,
    required: [true, "Permanent address is required"],
  },
  guardian: {
    type: guardianSchema,
    required: [true, "Guardian information is required"],
  },
  localGuardian: {
    type: localGuardianSchema,
    required: [true, "Local guardian information is required"],
  },
  profileImg: {
    type: String,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
});

export const StudentModel = model<Student>("Student", studentsSchema);
