import { Schema, model } from "mongoose";
import { TUserName } from "../../interface";
import { TFaculty } from "./faculty.interface";
import { BloodGroupsEnum, GenderEnum } from "../../constants";

const userNameSchema = new Schema<TUserName>({
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
  },
});

const facultySchema = new Schema<TFaculty>(
  {
    id: {
      type: String,
      required: [true, "Faculty ID is required"],
      unique: true,
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      unique: true,
      required: [true, "User ID is required"],
    },
    designation: {
      type: String,
      required: [true, "Designation is required"],
    },
    name: {
      type: userNameSchema,
      required: [true, "Faculty name is required"],
    },
    gender: {
      type: String,
      enum: {
        values: GenderEnum,
        message: "{VALUE} is not supported as a gender",
      },
      required: [true, "Gender is required"],
    },
    dateOfBirth: {
      type: Date,
    },
    email: {
      type: String,
      unique: true,
      required: [true, "Email is required"],
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
        values: BloodGroupsEnum,
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
    profileImg: {
      type: String,
    },
    academicDepartment: {
      type: Schema.Types.ObjectId,
      ref: "AcademicDepartment",
      required: [true, "Admission department is required"],
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  },
);

facultySchema.pre(["find", "findOne"], function (next) {
  this.find({ isDeleted: { $ne: true } });
  next();
});

facultySchema.pre("aggregate", function (next) {
  this.pipeline().unshift({ $match: { isDeleted: { $ne: true } } });
  next();
});

export const Faculty = model<TFaculty>("Faculty", facultySchema);
