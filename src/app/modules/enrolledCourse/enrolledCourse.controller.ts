import status from "http-status";
import catchAsync from "../../utils/catchAsync";
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

export const EnrolledCourseControllers = {
  createEnrolledCourse,
};
