import status from "http-status";
import { UserServices } from "./user.service";
import sendResponse from "../../utils/sendResponse";
import { NextFunction, Request, Response } from "express";

const createStudent = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
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
  } catch (error) {
    next(error);
  }
};

export const userControllers = {
  createStudent,
};
