import status from "http-status";
import catchAsync from "../../utils/catchAsync";
import { CourseServices } from "./course.service";
import sendResponse from "../../utils/sendResponse";

const getAllCourses = catchAsync(async (req, res) => {
  const result = await CourseServices.getAllCoursesFromDB(req?.query);
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

const createCourse = catchAsync(async (req, res) => {
  const result = await CourseServices.createCourseIntoDB(req.body.course);
  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: "Course created successfully",
    data: result,
  });
});

const updateCourse = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await CourseServices.updateCourseIntoDB(id, req.body.course);
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

const getCourseFaculties = catchAsync(async (req, res) => {
  const result = await CourseServices.getCourseFacultiesFromDB(
    req.params.courseId,
  );
  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: "Faculties assigned to course successfully",
    data: result,
  });
});

const assignCourseFaculties = catchAsync(async (req, res) => {
  const { courseId } = req.params;
  const result = await CourseServices.assignCourseFacultiesIntoDB(
    courseId,
    req.body.faculties,
  );
  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: "Faculties assigned to course successfully",
    data: result,
  });
});

const deleteCourseFaculties = catchAsync(async (req, res) => {
  const { courseId } = req.params;
  const result = await CourseServices.deleteCourseFacultiesFromDB(
    courseId,
    req.body.faculties,
  );
  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: "Faculties remove from course successfully",
    data: result,
  });
});

export const CourseControllers = {
  getAllCourses,
  getCourseById,
  createCourse,
  updateCourse,
  deleteCourse,
  getCourseFaculties,
  assignCourseFaculties,
  deleteCourseFaculties,
};
