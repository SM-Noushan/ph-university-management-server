import { model, Schema } from "mongoose";
import { DaysEnum } from "./offeredCourses.constant";
import { TOfferedCourses } from "./offeredCourses.interface";

const offeredCoursesSchema = new Schema<TOfferedCourses>(
  {
    semesterRegistration: {
      type: Schema.Types.ObjectId,
      ref: "SemesterRegistration",
      required: true,
    },
    academicSemester: {
      type: Schema.Types.ObjectId,
      ref: "AcademicSemester",
      required: true,
    },
    academicFaculty: {
      type: Schema.Types.ObjectId,
      ref: "AcademicFaculty",
      required: true,
    },
    academicDepartment: {
      type: Schema.Types.ObjectId,
      ref: "AcademicDepartment",
      required: true,
    },
    course: {
      type: Schema.Types.ObjectId,
      ref: "Course",
      required: true,
    },
    faculty: {
      type: Schema.Types.ObjectId,
      ref: "Faculty",
      required: true,
    },
    maxCapacity: {
      type: Number,
      required: true,
    },
    section: {
      type: String,
      required: true,
    },
    days: {
      type: String,
      enum: DaysEnum,
      required: true,
    },
    startTime: {
      type: String,
      required: true,
    },
    endTime: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

export const OfferedCourses = model<TOfferedCourses>(
  "OfferedCourses",
  offeredCoursesSchema,
);
