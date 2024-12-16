import status from "http-status";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { OfferedCourseServices } from "./offeredCourses.service";

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

export const OfferedCourseControllers = {
  createOfferedCourse,
};
