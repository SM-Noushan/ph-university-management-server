import status from "http-status";
import catchAsync from "../../utils/catchAsync";
import { USER_ROLE } from "./../user/user.constant";
import sendResponse from "../../utils/sendResponse";
import { EnrolledCourseServices } from "./enrolledCourse.service";

const createEnrolledCourse = catchAsync(async (req, res) => {
  const result = await EnrolledCourseServices.createEnrolledCourseIntoDB(
    req.body.offeredCourse,
    req.user.userId,
  );
  sendResponse(res, {
    statusCode: status.CREATED,
    success: true,
    message: "Enrolled Course created successfully",
    data: result,
  });
});

const updateEnrolledCourseMarks = catchAsync(async (req, res) => {
  const result = await EnrolledCourseServices.updateEnrolledCOurseMarksIntoDB(
    req.user.role === USER_ROLE.superAdmin
      ? USER_ROLE.superAdmin
      : req.user.userId,
    req.body,
  );
  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: "Enrolled Course marks updated successfully",
    data: result,
  });
});

export const EnrolledCourseControllers = {
  createEnrolledCourse,
  updateEnrolledCourseMarks,
};
