import {
  EnrolledCourseGrade,
  EnrolledCourseGradeEnum,
} from "./enrolledCourse.constant";
import {
  TEnrolledCourse,
  TEnrolledCourseMarks,
} from "./enrolledCourse.interface";
import { model, Schema } from "mongoose";

const courseMarksSchema = new Schema<TEnrolledCourseMarks>(
  {
    classTest1: {
      type: Number,
      min: 0,
      max: 15,
      default: 0,
    },
    midTerm: {
      type: Number,
      min: 0,
      max: 70,
      default: 0,
    },
    classTest2: {
      type: Number,
      min: 0,
      max: 15,
      default: 0,
    },
    finalTerm: {
      type: Number,
      min: 0,
      max: 100,
      default: 0,
    },
  },
  {
    _id: false,
    versionKey: false,
  },
);

const enrolledCourseSchema = new Schema<TEnrolledCourse>({
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
    ref: "Department",
    required: true,
  },
  offeredCourse: {
    type: Schema.Types.ObjectId,
    ref: "OfferedCourse",
    required: true,
  },
  course: {
    type: Schema.Types.ObjectId,
    ref: "Course",
    required: true,
  },
  student: {
    type: Schema.Types.ObjectId,
    ref: "Student",
    required: true,
  },
  faculty: {
    type: Schema.Types.ObjectId,
    ref: "Faculty",
    required: true,
  },
  courseMarks: {
    type: courseMarksSchema,
    default: {},
  },
  grade: {
    type: String,
    enum: EnrolledCourseGradeEnum,
    default: EnrolledCourseGrade.NA,
  },
  gradePoint: {
    type: Number,
    min: 0,
    max: 4,
    default: 0,
  },
  isEnrolled: {
    type: Boolean,
    default: true,
  },
  isCompleted: {
    type: Boolean,
    default: false,
  },
});

export const EnrolledCourse = model<TEnrolledCourse>(
  "EnrolledCourse",
  enrolledCourseSchema,
);
