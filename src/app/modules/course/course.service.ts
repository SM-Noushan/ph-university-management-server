import {
  Course,
  CourseFaculty,
  validatePreRequisiteCourses,
} from "./course.model";
import mongoose from "mongoose";
import { TCourse } from "./course.interface";
import validateDoc from "../../utils/validateDoc";
import { Faculty } from "../faculty/faculty.model";
import QueryBuilder from "../../builder/QueryBuilder";
import { CourseSearchableFields } from "./course.constant";

const getAllCoursesFromDB = async (query: Record<string, unknown>) => {
  const courseQuery = new QueryBuilder(Course.find(), query)
    .search(CourseSearchableFields)
    .filter()
    .sort()
    .paginate()
    .fields();
  const result = await courseQuery.modelQuery.populate({
    path: "preRequisiteCourses.course",
    model: "Course",
  });
  return result;
};

const getCourseByIdFromDB = async (id: string) => {
  const result = await Course.findById(id).populate(
    "preRequisiteCourses.course",
  );
  return result;
};

const createCourseIntoDB = async (payload: TCourse) => {
  const result = await Course.create(payload);
  return result;
};

const updateCourseIntoDB = async (id: string, payload: Partial<TCourse>) => {
  await validateDoc({
    model: Course,
    query: { _id: id },
    errMsg: "Course not found",
  });
  const { preRequisiteCourses = [], ...basicCourseData } = payload;
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    if (preRequisiteCourses && preRequisiteCourses?.length) {
      await validatePreRequisiteCourses(preRequisiteCourses);
      // filter out deleted preRequisiteCourses
      const deletedPreRequisiteCourses = preRequisiteCourses
        .filter(el => el.course && el.isDeleted)
        .map(el => el.course);
      await Course.findByIdAndUpdate(
        id,
        {
          $pull: {
            preRequisiteCourses: {
              course: { $in: deletedPreRequisiteCourses },
            },
          },
        },
        { session },
      );
      // filter out new preRequisiteCourses
      const newPreRequisiteCourses = preRequisiteCourses.filter(
        el => el.course && !el.isDeleted,
      );
      //   check if new preRequisiteCourses already exists
      await validateDoc({
        model: Course,
        query: {
          "preRequisiteCourses.course": {
            $in: newPreRequisiteCourses.map(el => el.course),
          },
        },
        errMsg: "One or more pre requisite course already exists",
        trueValidate: false,
      });
      await Course.findByIdAndUpdate(
        id,
        {
          $addToSet: {
            preRequisiteCourses: { $each: newPreRequisiteCourses },
          },
        },
        { session },
      );
    }
    //   update basic course data
    await Course.findByIdAndUpdate(id, basicCourseData, {
      new: true,
      runValidators: true,
      session,
    });
    await session.commitTransaction();
  } catch (error) {
    await session.abortTransaction();
    throw error;
  } finally {
    await session.endSession();
  }

  const result = await Course.findById(id);
  return result;
};

const deleteCourseFromDB = async (id: string) => {
  await validateDoc({
    model: Course,
    query: { _id: id },
    errMsg: "Course not found",
  });
  const result = await Course.findByIdAndUpdate(
    id,
    { isDeleted: true },
    {
      new: true,
    },
  );
  return result;
};

const getCourseFacultiesFromDB = async (course: string) => {
  const result = await validateDoc({
    model: CourseFaculty,
    query: { course },
    errMsg: "No Course Faculty found",
    populate: ["faculties"],
  });

  return result;
};

const assignCourseFacultiesIntoDB = async (
  course: string,
  faculties: string[],
) => {
  await validateDoc({
    model: Course,
    query: { _id: course },
    errMsg: "Course does not exist",
  });
  await Promise.all(
    [...new Set(faculties)].map(async faculty => {
      await validateDoc({
        model: Faculty,
        query: {
          _id: faculty,
        },
        errMsg: "One or more faculty does not exist",
      });
    }),
  );

  const result = await CourseFaculty.findOneAndUpdate(
    { course },
    {
      $setOnInsert: { course },
      $addToSet: { faculties: { $each: faculties } },
    },
    {
      upsert: true,
      new: true,
      runValidators: true,
    },
  );
  return result;
};

const deleteCourseFacultiesFromDB = async (id: string, faculties: string[]) => {
  await validateDoc({
    model: CourseFaculty,
    query: { _id: id },
    errMsg: "CourseFaculty does not exist",
  });

  const result = await CourseFaculty.findByIdAndUpdate(
    id,
    {
      $pull: { faculties: { $in: faculties } },
    },
    {
      new: true,
    },
  );
  return result;
};

export const CourseServices = {
  getAllCoursesFromDB,
  getCourseByIdFromDB,
  createCourseIntoDB,
  updateCourseIntoDB,
  deleteCourseFromDB,
  getCourseFacultiesFromDB,
  assignCourseFacultiesIntoDB,
  deleteCourseFacultiesFromDB,
};
