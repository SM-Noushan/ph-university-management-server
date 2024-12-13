import status from "http-status";
import { StudentServices } from "./student.service";
import sendResponse from "../../utils/sendResponse";
import catchAsync from "../../utils/catchAsync";

const getAllStudents = catchAsync(async (req, res) => {
  const result = await StudentServices.getAllStudentsFromDB();
  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: "Students retrieved successfully",
    data: result,
  });
});

const getStudentById = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await StudentServices.getStudentByIdFromDB(id);
  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: "Student retrieved successfully",
    data: result,
  });
});

const deleteStudent = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await StudentServices.deleteStudentFromDB(id);
  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: "Student deleted successfully",
    data: result,
  });
});

export const StudentControllers = {
  getAllStudents,
  getStudentById,
  deleteStudent,
};
