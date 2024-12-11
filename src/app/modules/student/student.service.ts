import { Student } from "./student.model";

const getAllStudentsFromDB = async () => {
  const result = await Student.find();
  return result;
};
const getStudentByIdFromDB = async (id: string) => {
  const result = await Student.findOne({ id });
  return result;
};

export const StudentServices = {
  getAllStudentsFromDB,
  getStudentByIdFromDB,
};
