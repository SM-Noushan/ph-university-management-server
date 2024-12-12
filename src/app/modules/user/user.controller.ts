import status from "http-status";
import { UserServices } from "./user.service";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";

const createStudent = catchAsync(async (req, res) => {
  const { student, password } = req.body;
  // const { error } = StudentValidationSchema.(studentData);
  // if (error) throw error?.details;
  // const { success, data, error } =
  //   StudentValidationSchema.safeParse(studentData);
  // if (!success) throw error;

  const result = await UserServices.createStudentIntoDB(password, student);
  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: "Student created successfully",
    data: result,
  });
});

export const userControllers = {
  createStudent,
};
