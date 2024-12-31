import status from "http-status";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { OfferedCourseServices } from "./offeredCourses.service";

const getAllOfferedCourses = catchAsync(async (req, res) => {
  const result = await OfferedCourseServices.getAllOfferedCoursesFromDB(
    req.query,
  );
  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: "OfferedCourses retrieved successfully",
    data: result,
  });
});

const getMyOfferedCourses = catchAsync(async (req, res) => {
  const result = await OfferedCourseServices.getMyOfferedCoursesFromDB(
    req.user.userId,
    req.query,
  );
  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: "OfferedCourses retrieved successfully",
    data: result,
  });
});

const getSingleOfferedCourseById = catchAsync(async (req, res) => {
  const result = await OfferedCourseServices.getOfferedCourseByIdFromDB(
    req.params.id,
  );
  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: "OfferedCourse retrieved successfully",
    data: result,
  });
});

const createOfferedCourse = catchAsync(async (req, res) => {
  const result = await OfferedCourseServices.createOfferedCourseIntoDB(
    req.body.offeredCourse,
  );
  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: "OfferedCourse created successfully",
    data: result,
  });
});

const updateOfferedCourse = catchAsync(async (req, res) => {
  const result = await OfferedCourseServices.updateOfferedCourseIntoDB(
    req.params.id,
    req.body.offeredCourse,
  );
  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: "OfferedCourse updated successfully",
    data: result,
  });
});

const deleteOfferedCourse = catchAsync(async (req, res) => {
  const result = await OfferedCourseServices.deleteOfferedCourseFromDB(
    req.params.id,
  );
  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: "OfferedCourse delete successfully",
    data: result,
  });
});

export const OfferedCourseControllers = {
  getAllOfferedCourses,
  getMyOfferedCourses,
  getSingleOfferedCourseById,
  createOfferedCourse,
  updateOfferedCourse,
  deleteOfferedCourse,
};
