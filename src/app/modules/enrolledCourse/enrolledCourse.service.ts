import status from "http-status";
import {
  TEnrolledCourse,
  TEnrolledCourseMarks,
  TUpdateEnrolledCourseMarks,
} from "./enrolledCourse.interface";
import AppError from "../../errors/AppError";
import mongoose, { Document } from "mongoose";
import validateDoc from "../../utils/validateDoc";
import { USER_ROLE } from "../user/user.constant";
import { Faculty } from "../faculty/faculty.model";
import { Student } from "../student/student.model";
import { TCourse } from "../course/course.interface";
import { TStudent } from "../student/student.interface";
import { EnrolledCourse } from "./enrolledCourse.model";
import { calculateGradeAndPoints } from "./enrolledCourse.utils";
import { OfferedCourse } from "../offeredCourses/offeredCourses.model";
import { TOfferedCourse } from "../offeredCourses/offeredCourses.interface";
import { SemesterRegistration } from "../semesterRegistration/semesterRegistration.model";
import { TSemesterRegistration } from "../semesterRegistration/semesterRegistration.interface";
import QueryBuilder from "../../builder/QueryBuilder";

const getMyEnrolledCoursesFromDB = async (
  sid: string,
  query: Record<string, unknown>,
) => {
  // get student data
  const studentData = await Student.findOne({ id: sid }, { _id: 1 });
  const enrolledCourseQuery = new QueryBuilder(
    EnrolledCourse.find({ student: studentData?._id }).populate(
      "semesterRegistration academicSemester academicFaculty academicDepartment offeredCourse course student faculty",
    ),
    query,
  ).paginate();
  const result = await enrolledCourseQuery.modelQuery;
  const meta = await enrolledCourseQuery.countTotal();
  return { meta, result };
};

const createEnrolledCourseIntoDB = async (
  offeredCourse: string,
  sid: string,
) => {
  /**
   * Step1: Check if the offered course is exists
   * Step2: Check if the student is already enrolled
   * Step3: Check if the max capacity exceed
   * Step4: Check if the max credits exceed
   * Step5: Create an enrolled course
   */
  //   check if the offered course is exists
  const offerCourseData = (await validateDoc({
    model: OfferedCourse,
    query: { _id: offeredCourse },
    errMsg: "Offered course does not exists",
    populate: ["course"],
  })) as TOfferedCourse & Document;

  //   get student data
  const studentData = (await Student.findOne(
    {
      id: sid,
    },
    { _id: 1 },
  )) as Document<TStudent>;

  //   check if the student is already enrolled
  await validateDoc({
    model: EnrolledCourse,
    query: {
      // offeredCourse,
      semesterRegistration: offerCourseData.semesterRegistration,
      student: studentData._id,
      course: offerCourseData.course._id,
    },
    errMsg: "Student is already enrolled in this course",
    trueValidate: false,
  });

  //   check if the max capacity exceed
  if (offerCourseData.maxCapacity < 1)
    throw new AppError(status.BAD_REQUEST, "Max capacity exceed");

  //  check if the max credits exceed
  const currentCourseCredit = (offerCourseData.course as object as TCourse)
    .credits;

  const semesterRegistrationInfo = (await SemesterRegistration.findById(
    offerCourseData.semesterRegistration,
    { maxCredit: 1 },
  )) as Required<TSemesterRegistration> & Document;
  const maxCredit = semesterRegistrationInfo.maxCredit;

  const enrolledCourses = await EnrolledCourse.aggregate([
    {
      $match: {
        student: studentData._id,
        semesterRegistration: offerCourseData.semesterRegistration,
      },
    },
    {
      $lookup: {
        from: "courses",
        localField: "course",
        foreignField: "_id",
        as: "enrolledCourseData",
      },
    },
    {
      $unwind: "$enrolledCourseData",
    },
    {
      $group: {
        _id: null,
        totalEnrolledCredits: { $sum: "$enrolledCourseData.credits" },
      },
    },
  ]);
  const totalCredit = enrolledCourses[0]?.totalEnrolledCredits || 0;

  if (totalCredit + currentCourseCredit > maxCredit)
    throw new AppError(status.BAD_REQUEST, "Max credits exceed");

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
      course: offerCourseData.course._id,
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

const updateEnrolledCOurseMarksIntoDB = async (
  facultyId: string,
  payload: TUpdateEnrolledCourseMarks,
) => {
  const { student, offeredCourse, semesterRegistration, courseMarks } = payload;

  const enrolledCourseData = (await validateDoc({
    model: EnrolledCourse,
    query: {
      student,
      offeredCourse,
      semesterRegistration,
    },
    errMsg: "Enrolled course does not exists",
  })) as TEnrolledCourse & Document;

  if (facultyId !== USER_ROLE.superAdmin) {
    const loggedInFaculty = await Faculty.findOne(
      { id: facultyId },
      { _id: 1 },
    );

    if (!loggedInFaculty?._id.equals(enrolledCourseData.faculty))
      throw new AppError(
        status.FORBIDDEN,
        "You are not allowed to update this course marks",
      );
  }

  const enrolledCourseMarks = (
    enrolledCourseData.courseMarks as TEnrolledCourseMarks & Document
  ).toObject();

  // calculate the final grade and grade points
  if (courseMarks.finalTerm || enrolledCourseMarks.finalTerm) {
    const totalMarks: number = Object.values({
      ...enrolledCourseMarks,
      ...courseMarks,
    } as Record<string, number>).reduce((acc, curr) => acc + curr, 0);

    const { grade, gradePoints } = calculateGradeAndPoints(totalMarks / 2);

    enrolledCourseData.grade = grade;
    enrolledCourseData.gradePoint = gradePoints;
    enrolledCourseData.isCompleted = true;
  }

  // update the course marks
  enrolledCourseData.courseMarks = {
    ...enrolledCourseMarks,
    ...courseMarks,
  };

  await enrolledCourseData.save();
  return enrolledCourseData;
};

export const EnrolledCourseServices = {
  getMyEnrolledCoursesFromDB,
  createEnrolledCourseIntoDB,
  updateEnrolledCOurseMarksIntoDB,
};
