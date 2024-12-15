import QueryBuilder from "../../builder/QueryBuilder";
import validateDoc from "../../utils/validateDoc";
import { CourseSearchableFields } from "./course.constant";
import { TCourse } from "./course.interface";
import { Course } from "./course.model";

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
  const result = await Course.findById(id).populate({
    path: "preRequisiteCourses.course",
    model: "Course",
  });
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
  const result = await Course.findByIdAndUpdate(id, payload, {
    new: true,
    runValidators: true,
  });
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

export const CourseServices = {
  getAllCoursesFromDB,
  getCourseByIdFromDB,
  createCourseIntoDB,
  updateCourseIntoDB,
  deleteCourseFromDB,
};
