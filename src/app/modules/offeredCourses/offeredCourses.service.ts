import {
  TOfferedCourse,
  TPaginationPipeline,
} from "./offeredCourses.interface";
import AppError from "../../errors/AppError";
import validateDoc from "../../utils/validateDoc";
import { Student } from "../student/student.model";
import { Faculty } from "../faculty/faculty.model";
import mongoose, { Document, Types } from "mongoose";
import QueryBuilder from "../../builder/QueryBuilder";
import { OfferedCourse } from "./offeredCourses.model";
import { Course, CourseFaculty } from "../course/course.model";
import { hasTimeConflict, TSchedule } from "./offeredCourses.utils";
import { EnrolledCourse } from "../enrolledCourse/enrolledCourse.model";
import { AcademicFaculty } from "../academicFaculty/academicFaculty.model";
import { AcademicDepartment } from "../academicDepartment/academicDepartment.model";
import { TAcademicDepartment } from "../academicDepartment/academicDepartment.interface";
import { SemesterRegistration } from "./../semesterRegistration/semesterRegistration.model";
import { TSemesterRegistration } from "../semesterRegistration/semesterRegistration.interface";

const getAllOfferedCoursesFromDB = async (query: Record<string, unknown>) => {
  const offeredCoursesQuery = new QueryBuilder(OfferedCourse.find(), query)
    .filter()
    .sort()
    .paginate()
    .fields();
  const result = await offeredCoursesQuery.modelQuery;
  const meta = await offeredCoursesQuery.countTotal();
  return { meta, result };
};

const getMyOfferedCoursesFromDB = async (
  studentId: string,
  query: Record<string, unknown>,
) => {
  // find the student
  const student = await Student.findOne({ id: studentId });

  // find the ongoing semester registration
  const currentOngoingSemesterRegistration = (await validateDoc({
    model: SemesterRegistration,
    query: { status: "ONGOING" },
    errMsg: "No ongoing semester registration found",
  })) as TSemesterRegistration & Document;

  // pagination
  const page: number = parseInt(query?.page as string) || 1;
  const limit: number = parseInt(query?.limit as string) || 0;
  const skip: number = (page - 1) * limit;

  // find the offered courses
  const aggregationQuery = [
    // match the courses that are offered in the current ongoing semester for logged in student
    {
      $match: {
        semesterRegistration: currentOngoingSemesterRegistration?._id,
        academicFaculty: student?.academicFaculty,
        academicDepartment: student?.academicDepartment,
      },
    },
    // lookup the course details
    {
      $lookup: {
        from: "courses",
        localField: "course",
        foreignField: "_id",
        as: "course",
      },
    },
    {
      $unwind: "$course",
    },
    // lookup the enrolled courses
    {
      $lookup: {
        from: "enrolledcourses",
        let: {
          currentOngoingSemesterRegistration:
            currentOngoingSemesterRegistration?._id,
          currentStudent: student?._id,
        },
        pipeline: [
          {
            $match: {
              $expr: {
                $and: [
                  {
                    $eq: [
                      "$semesterRegistration",
                      "$$currentOngoingSemesterRegistration",
                    ],
                  },
                  {
                    $eq: ["$student", "$$currentStudent"],
                  },
                  {
                    $eq: ["$isEnrolled", true],
                  },
                ],
              },
            },
          },
        ],
        as: "enrolledCourses",
      },
    },
    // lookup the completed courses
    {
      $lookup: {
        from: "enrolledcourses",
        let: {
          currentStudent: student?._id,
        },
        pipeline: [
          {
            $match: {
              $expr: {
                $and: [
                  {
                    $eq: ["$student", "$$currentStudent"],
                  },
                  {
                    $eq: ["$isCompleted", true],
                  },
                ],
              },
            },
          },
        ],
        as: "completedCourses",
      },
    },
    // add the completed course ids
    {
      $addFields: {
        completedCourseIds: {
          $map: {
            input: "$completedCourses",
            as: "cc",
            in: "$$cc.course",
          },
        },
      },
    },
    // check if the course is already enrolled and is prerequisite completed
    {
      $addFields: {
        isPrerequisiteCompleted: {
          $or: [
            {
              $eq: ["$course.preRequisiteCourses", []],
            },
            {
              $setIsSubset: [
                "$course.preRequisiteCourses.course",
                "$completedCourseIds",
              ],
            },
          ],
        },
        isAlreadyEnrolled: {
          $in: [
            "$course._id",
            {
              $map: {
                input: "$enrolledCourses",
                as: "ec",
                in: "$$ec.course",
              },
            },
          ],
        },
      },
    },
    {
      $match: {
        isPrerequisiteCompleted: true,
        isAlreadyEnrolled: false,
      },
    },
    {
      $project: {
        enrolledCourses: 0,
        completedCourses: 0,
        isPrerequisiteCompleted: 0,
        isAlreadyEnrolled: 0,
        completedCourseIds: 0,
        preRequisiteCourses: 0,
      },
    },
  ];
  const paginationQuery: TPaginationPipeline[] = [
    {
      $skip: skip,
    },
  ];
  if (limit !== 0) {
    paginationQuery.push({
      $limit: limit,
    });
  }

  const result = await OfferedCourse.aggregate([
    ...aggregationQuery,
    ...paginationQuery,
  ]);

  // pagination
  const total = (await OfferedCourse.aggregate(aggregationQuery)).length;
  const totalPages = limit === 0 ? 1 : Math.ceil(total / limit);

  return {
    meta: {
      page,
      limit,
      total,
      totalPages,
    },
    result,
  };
};

const getOfferedCourseByIdFromDB = async (id: string) => {
  const result = await OfferedCourse.findById(id).populate(
    "semesterRegistration academicSemester academicFaculty academicDepartment course faculty",
  );
  return result;
};

const createOfferedCourseIntoDB = async (payload: TOfferedCourse) => {
  const {
    semesterRegistration,
    academicFaculty,
    academicDepartment,
    course,
    section,
    faculty,
    days,
    startTime,
    endTime,
  } = payload;
  /**
   * Step 1: check if the semester registration id is exists!
   * Step 2: check if the semester has ended!
   * Step 3: check if the academic faculty id is exists!
   * Step 4: check if the academic department id is exists!
   * Step 5: check if the department is belong to the  faculty!
   * Step 6: check if the course id is exists!
   * Step 7: check if the faculty id is exists!
   * Step 8: check if the faculty is eligible for the offer the course
   * Step 9: check if the same offered course same section in same registered semester exists
   * Step 10: get the schedules of the faculties
   * Step 11: create the offered course
   */

  //   check if the semester registration id is exists!
  const semesterRegistrationDoc = await validateDoc<TSemesterRegistration>({
    model: SemesterRegistration,
    query: { _id: semesterRegistration },
    errMsg: "Semester registration not found",
  });

  //   check if semester has ended
  if (semesterRegistrationDoc?.status === "ENDED")
    throw new AppError(400, "Courses can not be offered for ENDED semester");

  //  check if the academic faculty id is exists!
  await validateDoc({
    model: AcademicFaculty,
    query: { _id: academicFaculty },
    errMsg: "Academic faculty not found",
  });

  //   check if the academic department id is exists!
  const academicDepartmentDoc = await validateDoc<TAcademicDepartment>({
    model: AcademicDepartment,
    query: { _id: academicDepartment },
    errMsg: "Academic department not found",
  });

  //   check if department is belong to the faculty
  if (
    !(academicDepartmentDoc?.academicFaculty as Types.ObjectId)?.equals(
      academicFaculty,
    )
  )
    throw new AppError(
      400,
      "Academic department does not belong to the faculty",
    );

  // check if course id is exists
  await validateDoc({
    model: Course,
    query: { _id: course },
    errMsg: "Course not found",
  });

  //   check if faculty id is exists
  await validateDoc({
    model: Faculty,
    query: { _id: faculty },
    errMsg: "Faculty not found",
  });

  //check if the faculty is eligible for the offer the course
  await validateDoc({
    model: CourseFaculty,
    query: {
      course,
      faculties: faculty,
    },
    errMsg: "Faculty is not eligible to take the course",
  });

  //   check if the same offered course same section in same registered semester exists
  await validateDoc({
    model: OfferedCourse,
    query: {
      semesterRegistration,
      course,
      section,
    },
    trueValidate: false,
    errMsg: "Offered course already exists",
  });

  //   get the schedules of the faculties
  const assignedSchedules = (await OfferedCourse.find({
    semesterRegistration,
    faculty,
    days: { $in: days },
  }).select("-_id days startTime endTime")) as TSchedule[];
  const newSchedule = { days, startTime, endTime };
  const hasTimeConflictResult = hasTimeConflict(assignedSchedules, newSchedule);
  if (hasTimeConflictResult)
    throw new AppError(400, "Faculty is not available at that time");

  const result = await OfferedCourse.create({
    ...payload,
    academicSemester: semesterRegistrationDoc?.academicSemester,
  });
  return result;
};

const updateOfferedCourseIntoDB = async (
  id: string,
  payload: Partial<TOfferedCourse>,
) => {
  const { faculty, days, startTime, endTime } = payload;
  /**
   * Step 1: check if offered course exist!
   * Step 2: check if the semester is ongoing!
   * Step 3: check if the faculty id is exists!
   * Step 4: check if the faculty is eligible for the offer the course
   * Step 5: get the schedules of the faculties and check if there is a time conflict
   * Step 6: update the offered course
   */

  //   check if the offered course exists!
  const offeredCOurseDoc = await validateDoc<TOfferedCourse>({
    model: OfferedCourse,
    query: { _id: id },
    errMsg: "Offered course not found",
  });

  //   check if the semester is upcoming
  const semesterRegistration = await SemesterRegistration.findById(
    offeredCOurseDoc?.semesterRegistration,
  );
  if (semesterRegistration?.status !== "UPCOMING")
    throw new AppError(
      400,
      "Offered course can only be updated for UPCOMING semester",
    );

  //   check if faculty id is exists
  await validateDoc({
    model: Faculty,
    query: { _id: faculty },
    errMsg: "Faculty not found",
  });

  //check if the faculty is eligible for the offer the course
  await validateDoc({
    model: CourseFaculty,
    query: {
      course: offeredCOurseDoc?.course,
      faculties: faculty,
    },
    errMsg: "Faculty is not eligible to take the course",
  });

  //   get the schedules of the faculties
  if (
    !offeredCOurseDoc?.faculty?.equals(faculty) ||
    JSON.stringify(days) !== JSON.stringify(offeredCOurseDoc?.days) ||
    startTime !== offeredCOurseDoc?.startTime ||
    endTime !== offeredCOurseDoc?.endTime
  ) {
    const assignedSchedules = (await OfferedCourse.find({
      _id: { $ne: id },
      semesterRegistration: offeredCOurseDoc?.semesterRegistration,
      faculty,
      days: { $in: days },
    }).select("-_id days startTime endTime")) as TSchedule[];

    const newSchedule = { days, startTime, endTime } as TSchedule;

    const hasTimeConflictResult = hasTimeConflict(
      assignedSchedules,
      newSchedule,
    );
    if (hasTimeConflictResult)
      throw new AppError(400, "Faculty is not available at that time");
  }

  const result = await OfferedCourse.findByIdAndUpdate(id, payload, {
    new: true,
  });
  return result;
};

const deleteOfferedCourseFromDB = async (id: string) => {
  /**
   * Step 1: check if the offered course exists
   * Step 2: check if the semester registration status is upcoming
   * Step 3: delete the offered course
   * Step 4: delete the associated enrolled courses
   */
  //   check if the offered course exists!
  const offeredCOurseDoc = await validateDoc<TOfferedCourse>({
    model: OfferedCourse,
    query: { _id: id },
    errMsg: "Offered course not found",
  });

  //   check if the semester is upcoming
  const semesterRegistration = await SemesterRegistration.findById(
    offeredCOurseDoc?.semesterRegistration,
  );
  if (semesterRegistration?.status !== "UPCOMING")
    throw new AppError(
      400,
      "Offered course can only be deleted for UPCOMING semester",
    );

  const session = await mongoose.startSession();
  try {
    session.startTransaction();

    // Delete the offered course
    const result = await OfferedCourse.findByIdAndDelete(id, { session });

    // Delete the enrolled students
    await EnrolledCourse.deleteMany({ offeredCourse: id }, { session });

    await session.commitTransaction();
    return result;
  } catch (error) {
    await session.abortTransaction();
    throw error;
  } finally {
    session.endSession();
  }
};

export const OfferedCourseServices = {
  getAllOfferedCoursesFromDB,
  getOfferedCourseByIdFromDB,
  createOfferedCourseIntoDB,
  updateOfferedCourseIntoDB,
  deleteOfferedCourseFromDB,
  getMyOfferedCoursesFromDB,
};
