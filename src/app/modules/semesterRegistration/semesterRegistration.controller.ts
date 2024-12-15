import status from "http-status";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { SemesterRegistrationServices } from "./semesterRegistration.service";

const getAllSemesterRegistration = catchAsync(async (req, res) => {
  const result =
    await SemesterRegistrationServices.getAllSemesterRegistrationsFromDB(
      req?.query,
    );
  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: "SemesterRegistration retrieved successfully",
    data: result,
  });
});

const createSemesterRegistration = catchAsync(async (req, res) => {
  const result =
    await SemesterRegistrationServices.createSemesterRegistrationIntoDB(
      req.body.semesterRegistration,
    );
  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: "SemesterRegistration created successfully",
    data: result,
  });
});

export const SemesterRegistrationControllers = {
  getAllSemesterRegistration,
  createSemesterRegistration,
};
