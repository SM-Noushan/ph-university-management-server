import { Types } from "mongoose";
import { EnrolledCourseGrade } from "./enrolledCourse.constant";

export type TEnrolledCourseGrade = keyof typeof EnrolledCourseGrade;

export type TEnrolledCourseMarks = {
  classTest1: number;
  midTerm: number;
  classTest2: number;
  finalTerm: number;
};

export type TUpdateEnrolledCourseMarks = {
  student: Types.ObjectId;
  offeredCourse: Types.ObjectId;
  semesterRegistration: Types.ObjectId;
  courseMarks: Partial<TEnrolledCourseMarks>;
};

export type TEnrolledCourse = {
  semesterRegistration: Types.ObjectId;
  academicSemester: Types.ObjectId;
  academicFaculty: Types.ObjectId;
  academicDepartment: Types.ObjectId;
  offeredCourse: Types.ObjectId;
  course: Types.ObjectId;
  student: Types.ObjectId;
  faculty: Types.ObjectId;
  courseMarks?: TEnrolledCourseMarks;
  grade?: TEnrolledCourseGrade;
  gradePoint?: number;
  isEnrolled?: boolean;
  isCompleted?: boolean;
};
