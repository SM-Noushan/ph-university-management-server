import { Request, Response } from "express";
import { UserServices } from "./user.service";

const createStudent = async (req: Request, res: Response) => {
  try {
    const { student, password } = req.body;
    // const { error } = StudentValidationSchema.(studentData);
    // if (error) throw error?.details;
    // const { success, data, error } =
    //   StudentValidationSchema.safeParse(studentData);
    // if (!success) throw error;

    const result = await UserServices.createStudentIntoDB(password, student);
    res.status(200).json({
      success: true,
      message: "Student created successfully",
      data: result,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: (error as Error).message || "Student creation failed",
      error: error,
    });
  }
};

export const userControllers = {
  createStudent,
};
