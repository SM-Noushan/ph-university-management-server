import { Student } from "./student.interface";
import { StudentModel } from "./student.model";

const getAllStudentsFromDB = async () => {
  const result = await StudentModel.find();
  return result;
};
const getStudentByIdFromDB = async (id: string) => {
  const result = await StudentModel.findOne({ id });
  return result;
};

const createStudentIntoDB = async (student: Student) => {
  const result = await StudentModel.create(student);
  return result;
};

export const StudentServices = {
  getAllStudentsFromDB,
  getStudentByIdFromDB,
  createStudentIntoDB,
};
