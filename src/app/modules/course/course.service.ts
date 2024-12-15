import validateDoc from "../../utils/validateDoc";
import { TCourse } from "./course.interface";
import { Course } from "./course.model";

const getAllCoursesFromDB = async () => {
  const result = await Course.find();
  return result;
};

const getCourseByIdFromDB = async (id: string) => {
  const result = await Course.findById(id);
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
