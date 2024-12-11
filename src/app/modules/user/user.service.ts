import config from "../../config";
import { User } from "./user.model";
import { TUser } from "./user.interface";
import { Student } from "../student/student.model";
import { TStudent } from "../student/student.interface";

const createStudentIntoDB = async (password: string, studentData: TStudent) => {
  // custom static method
  //   if (await Student.isStudentExist(studentData.id))
  // throw new Error("Student already exists");
  // static method
  const userData: Pick<TUser, "id" | "password" | "role"> = {
    id: "202410001",
    password: password || (config.defaultPassword as string),
    role: "student",
  };

  // create user
  const newUser = await User.create(userData);
  // create student
  if (Object.keys(newUser).length) {
    studentData.user = newUser._id;
    studentData.id = newUser.id;
    const newStudent = await Student.create(studentData);

    return { student: newStudent, user: newUser };
  }
  // instance method
  // const student = new Student(studentData);
  // custom method
  // if (await student.isStudentExists(studentData.id))
  //   throw new Error("Student already exists");

  // const result = await student.save();
};

export const UserServices = { createStudentIntoDB };
