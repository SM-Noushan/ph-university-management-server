import status from "http-status";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { AcademicFacultyServices } from "./academicFaculty.service";

const getAllAcademicFaculties = catchAsync(async (req, res) => {
  const result = await AcademicFacultyServices.getAllAcademicFacultiesFromDB();
  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: "Academic faculties retrieved successfully",
    data: result,
  });
});

const getAcademicFacultyById = catchAsync(async (req, res) => {
  const result = await AcademicFacultyServices.getAcademicFacultyByIdFromDB(
    req.params.id,
  );
  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: "Academic faculty retrieved successfully",
    data: result,
  });
});

const createAcademicFaculty = catchAsync(async (req, res) => {
  const result = await AcademicFacultyServices.createAcademicFacultyIntoDB(
    req.body,
  );
  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: "Academic faculty created successfully",
    data: result,
  });
});

const updateAcademicFaculty = catchAsync(async (req, res) => {
  const result = await AcademicFacultyServices.updateAcademicFacultyIntoDB(
    req.params.id,
    req.body,
  );
  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: "Academic faculty is updated successfully",
    data: result,
  });
});

export const AcademicFacultyControllers = {
  getAllAcademicFaculties,
  getAcademicFacultyById,
  createAcademicFaculty,
  updateAcademicFaculty,
};
