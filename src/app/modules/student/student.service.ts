import { TStudent } from "./student.interface";
import { Student } from "./student.model";

const getAllStudentsFromDB = async () => {
  const result = await Student.find();
  return result;
};
const getStudentByIdFromDB = async (id: string) => {
  const result = await Student.findOne({ id });
  return result;
};

const createStudentIntoDB = async (studentData: TStudent) => {
  // custom static method
  if (await Student.isStudentExist(studentData.id))
    throw new Error("Student already exists");
  // static method
  const result = await Student.create(studentData);
  // instance method
  // const student = new Student(studentData);
  // // custom method
  // if (await student.isStudentExists(studentData.id))
  //   throw new Error("Student already exists");

  // const result = await student.save();

  return result;
};

export const StudentServices = {
  getAllStudentsFromDB,
  getStudentByIdFromDB,
  createStudentIntoDB,
};
