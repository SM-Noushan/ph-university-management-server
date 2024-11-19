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
    console.log(error);
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
    console.log(error);
  }
};

const createStudent = async (req: Request, res: Response) => {
  try {
    const { student: studentData } = req.body;
    const { error } = StudentValidationSchema.validate(studentData);
    if (error) throw error?.details;

    const result = await StudentServices.createStudentIntoDB(studentData);
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
