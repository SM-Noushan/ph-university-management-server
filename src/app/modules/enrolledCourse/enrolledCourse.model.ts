import {
  EnrolledCourseGrade,
  EnrolledCourseGradeEnum,
} from "./enrolledCourse.constant";
import { model, Schema } from "mongoose";
import { TCourseMarks, TEnrolledCourse } from "./enrolledCourse.interface";

const courseMarksSchema = new Schema<TCourseMarks>(
  {
    classTest1: {
      type: Number,
      default: 0,
    },
    midTerm: {
      type: Number,
      default: 0,
    },
    classTest2: {
      type: Number,
      default: 0,
    },
    finalTerm: {
      type: Number,
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
    default: false,
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
