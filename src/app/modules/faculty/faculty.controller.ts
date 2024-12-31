import status from "http-status";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { FacultyServices } from "./faculty.service";

const getAllFaculties = catchAsync(async (req, res) => {
  const result = await FacultyServices.getAllFacultiesFromDB(req?.query);
  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: "Faculties retrieved successfully",
    meta: result.meta,
    data: result.result,
  });
});

const getFacultyById = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await FacultyServices.getFacultyByIdFromDB(id);
  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: "Faculty retrieved successfully",
    data: result,
  });
});

const updateFaculty = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await FacultyServices.updateFacultyIntoDB(
    id,
    req.body.faculty,
  );
  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: "Faculty updated successfully",
    data: result,
  });
});

const deleteFaculty = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await FacultyServices.deleteFacultyFromDB(id);
  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: "Faculty deleted successfully",
    data: result,
  });
});

export const FacultyControllers = {
  getAllFaculties,
  getFacultyById,
  updateFaculty,
  deleteFaculty,
};
