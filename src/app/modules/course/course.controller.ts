import status from "http-status";
import catchAsync from "../../utils/catchAsync";
import { CourseServices } from "./course.service";
import sendResponse from "../../utils/sendResponse";

const getAllCourses = catchAsync(async (req, res) => {
  const result = await CourseServices.getAllCoursesFromDB();
  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: "Courses retrieved successfully",
    data: result,
  });
});

const getCourseById = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await CourseServices.getCourseByIdFromDB(id);
  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: "Course retrieved successfully",
    data: result,
  });
});

const updateCourse = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await CourseServices.updateCourseIntoDB(id, req.body.faculty);
  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: "Course updated successfully",
    data: result,
  });
});

const deleteCourse = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await CourseServices.deleteCourseFromDB(id);
  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: "Course deleted successfully",
    data: result,
  });
});

export const CourseControllers = {
  getAllCourses,
  getCourseById,
  updateCourse,
  deleteCourse,
};
