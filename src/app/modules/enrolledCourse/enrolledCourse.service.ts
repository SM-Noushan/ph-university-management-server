import { Document } from "mongoose";
import validateDoc from "../../utils/validateDoc";
import { Student } from "../student/student.model";
import { TStudent } from "../student/student.interface";
import { EnrolledCourse } from "./enrolledCourse.model";
import { OfferedCourse } from "../offeredCourses/offeredCourses.model";

const createEnrolledCourseIntoDB = async (
  offeredCourse: string,
  sid: string,
) => {
  const offerCourseData = await validateDoc({
    model: OfferedCourse,
    query: { _id: offeredCourse },
  });

  const studentData = (await validateDoc({
    model: Student,
    query: { id: sid },
  })) as TStudent & Document;

  const enrolledCourse = await EnrolledCourse.create({
    semesterRegistration: offerCourseData.semesterRegistration,
    academicSemester: offerCourseData.academicSemester,
    academicFaculty: offerCourseData.academicFaculty,
    academicDepartment: offerCourseData.academicDepartment,
    offeredCourse,
    course: offerCourseData.course,
    student: studentData._id,
    faculty: offerCourseData.faculty,
  });
  return enrolledCourse;
};

export const EnrolledCourseServices = { createEnrolledCourseIntoDB };
