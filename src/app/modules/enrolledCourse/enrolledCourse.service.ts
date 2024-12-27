import status from "http-status";
import AppError from "../../errors/AppError";
import mongoose, { Document } from "mongoose";
import validateDoc from "../../utils/validateDoc";
import { Student } from "../student/student.model";
import { TStudent } from "../student/student.interface";
import { EnrolledCourse } from "./enrolledCourse.model";
import { OfferedCourse } from "../offeredCourses/offeredCourses.model";
import { TOfferedCourse } from "../offeredCourses/offeredCourses.interface";

const createEnrolledCourseIntoDB = async (
  offeredCourse: string,
  sid: string,
) => {
  /**
   * Step1: Check if the offered course is exists
   * Step2: Check if the student is already enrolled
   * Step3: Check if the max capacity exceed
   * Step4: Create an enrolled course
   */
  //   check if the offered course is exists
  const offerCourseData = (await validateDoc({
    model: OfferedCourse,
    query: { _id: offeredCourse },
    errMsg: "Offered course does not exists",
  })) as TOfferedCourse & Document;

  //   get student data
  const studentData = (await Student.findOne({
    id: sid,
  })) as Document<TStudent>;

  //   check if the student is already enrolled
  await validateDoc({
    model: EnrolledCourse,
    query: {
      offeredCourse,
      semesterRegistration: offerCourseData.semesterRegistration,
      student: studentData._id,
    },
    errMsg: "Student is already enrolled in this course",
    trueValidate: false,
  });

  //   check if the max capacity exceed
  if (offerCourseData.maxCapacity < 1)
    throw new AppError(status.BAD_REQUEST, "Max capacity exceed");

  const session = await mongoose.startSession();

  try {
    session.startTransaction();
    //   create an enrolled course
    const payload = {
      semesterRegistration: offerCourseData.semesterRegistration,
      academicSemester: offerCourseData.academicSemester,
      academicFaculty: offerCourseData.academicFaculty,
      academicDepartment: offerCourseData.academicDepartment,
      offeredCourse,
      course: offerCourseData.course,
      student: studentData._id,
      faculty: offerCourseData.faculty,
    };
    const enrolledCourse = await EnrolledCourse.create([payload], { session });

    //   update and save the max capacity
    offerCourseData.maxCapacity -= 1;
    await offerCourseData.save({ session });

    await session.commitTransaction();
    return enrolledCourse;
  } catch (error) {
    await session.abortTransaction();
    throw error;
  } finally {
    await session.endSession();
  }
};

export const EnrolledCourseServices = { createEnrolledCourseIntoDB };
