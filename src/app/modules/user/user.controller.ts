import status from "http-status";
import { UserServices } from "./user.service";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";

const createStudent = catchAsync(async (req, res) => {
  const { student, password } = req.body;

  const result = await UserServices.createStudentIntoDB(password, student);
  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: "Student created successfully",
    data: result,
  });
});

const createFaculty = catchAsync(async (req, res) => {
  const { faculty, password } = req.body;

  const result = await UserServices.createFacultyIntoDB(password, faculty);
  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: "Faculty created successfully",
    data: result,
  });
});

const createAdmin = catchAsync(async (req, res) => {
  const { admin, password } = req.body;

  const result = await UserServices.createAdminIntoDB(password, admin);
  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: "Admin created successfully",
    data: result,
  });
});

const getMe = catchAsync(async (req, res) => {
  const { userId, role } = req.user;
  const result = await UserServices.getMe(userId, role);
  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: "User data retrieved successfully",
    data: result,
  });
});

const changeStatus = catchAsync(async (req, res) => {
  const result = await UserServices.changeStatus(
    req.params.id,
    req.body.status,
  );
  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: "User status changed successfully",
    data: result,
  });
});

export const userControllers = {
  createStudent,
  createFaculty,
  createAdmin,
  getMe,
  changeStatus,
};
