import { Types } from "mongoose";
import { EnrolledCourseGrade } from "./enrolledCourse.constant";

export type TGrade = keyof typeof EnrolledCourseGrade;

export type TCourseMarks = {
  classTest1: number;
  midTerm: number;
  classTest2: number;
  finalTerm: number;
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
  courseMarks?: TCourseMarks;
  grade?: TGrade;
  gradePoint?: number;
  isEnrolled?: boolean;
  isCompleted?: boolean;
};
