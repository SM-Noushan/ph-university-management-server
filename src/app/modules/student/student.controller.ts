import { Request, Response } from "express";
import { StudentServices } from "./student.service";
import StudentValidationSchema from "./student.validation";

const getAllStudents = async (req: Request, res: Response) => {
  try {
    const result = await StudentServices.getAllStudentsFromDB();
    res.status(200).json({
      success: true,
      message: "Students fetched successfully",
      data: result,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Students fetch failed",
      error,
    });
  }
};

const getStudentById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const result = await StudentServices.getStudentByIdFromDB(id);
    res.status(200).json({
      success: true,
      message: "Student fetched successfully",
      data: result,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Student fetch failed",
      error,
    });
  }
};

const createStudent = async (req: Request, res: Response) => {
  try {
    const { student: studentData } = req.body;
    // const { error } = StudentValidationSchema.(studentData);
    // if (error) throw error?.details;
    const { success, data, error } =
      StudentValidationSchema.safeParse(studentData);
    if (!success) throw error;

    const result = await StudentServices.createStudentIntoDB(data);
    res.status(200).json({
      success: true,
      message: "Student created successfully",
      data: result,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Student creation failed",
      error: error,
    });
  }
};

export const StudentControllers = {
  getAllStudents,
  getStudentById,
  createStudent,
};
