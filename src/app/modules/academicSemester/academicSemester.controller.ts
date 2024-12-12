import status from "http-status";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { AcademicSemesterServices } from "./academicSemester.service";

const getAllAcademicSemesters = catchAsync(async (req, res) => {
  const result = await AcademicSemesterServices.getAllAcademicSemestersFromDB();
  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: "Academic semesters retrieved successfully",
    data: result,
  });
});

const getAcademicSemesterById = catchAsync(async (req, res) => {
  const result = await AcademicSemesterServices.getAcademicSemesterByIdFromDB(
    req.params.id,
  );
  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: "Academic semester retrieved successfully",
    data: result,
  });
});

const createAcademicSemester = catchAsync(async (req, res) => {
  const result = await AcademicSemesterServices.createAcademicSemesterIntoDB(
    req.body,
  );
  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: "Academic semester is created successfully",
    data: result,
  });
});

export const AcademicSemesterControllers = {
  getAllAcademicSemesters,
  getAcademicSemesterById,
  createAcademicSemester,
};
