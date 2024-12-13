import status from "http-status";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { AcademicDepartmentServices } from "./academicDepartment.service";

const getAllAcademicDepartments = catchAsync(async (req, res) => {
  const result =
    await AcademicDepartmentServices.getAllAcademicDepartmentsFromDB();
  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: "Academic departments retrieved successfully",
    data: result,
  });
});

const getAcademicDepartmentById = catchAsync(async (req, res) => {
  const result =
    await AcademicDepartmentServices.getAcademicDepartmentByIdFromDB(
      req.params.id,
    );
  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: "Academic department retrieved successfully",
    data: result,
  });
});

const createAcademicDepartment = catchAsync(async (req, res) => {
  const result =
    await AcademicDepartmentServices.createAcademicDepartmentIntoDB(req.body);
  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: "Academic department created successfully",
    data: result,
  });
});

const updateAcademicDepartment = catchAsync(async (req, res) => {
  const result =
    await AcademicDepartmentServices.updateAcademicDepartmentIntoDB(
      req.params.id,
      req.body,
    );
  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: "Academic department is updated successfully",
    data: result,
  });
});

export const AcademicDepartmentControllers = {
  getAllAcademicDepartments,
  getAcademicDepartmentById,
  createAcademicDepartment,
  updateAcademicDepartment,
};
