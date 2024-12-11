import { NextFunction, Request, Response } from "express";
import { StudentServices } from "./student.service";
import sendResponse from "../../utils/sendResponse";
import status from "http-status";

const getAllStudents = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const result = await StudentServices.getAllStudentsFromDB();
    sendResponse(res, {
      statusCode: status.OK,
      success: true,
      message: "Students retrieved successfully",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

const getStudentById = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { id } = req.params;
    const result = await StudentServices.getStudentByIdFromDB(id);
    sendResponse(res, {
      statusCode: status.OK,
      success: true,
      message: "Student retrieved successfully",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

export const StudentControllers = {
  getAllStudents,
  getStudentById,
};
