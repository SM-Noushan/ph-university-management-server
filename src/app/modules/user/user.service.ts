import config from "../../config";
import { User } from "./user.model";
import { TUser } from "./user.interface";
import { generateStudentId } from "./user.utils";
import { Student } from "../student/student.model";
import { TStudent } from "../student/student.interface";

const createStudentIntoDB = async (password: string, payload: TStudent) => {
  // custom static method
  //   if (await Student.isStudentExist(payload.id))
  // throw new Error("Student already exists");
  // static method

  // academic semester info
  const userData: Pick<TUser, "id" | "password" | "role"> = {
    id: "",
    password: password || (config.defaultPassword as string),
    role: "student",
  };
  userData.id = await generateStudentId(payload.admissionSemester);

  // create user
  const newUser = await User.create(userData);
  // create student
  if (Object.keys(newUser).length) {
    payload.user = newUser._id;
    payload.id = newUser.id;
    const newStudent = await Student.create(payload);

    return { student: newStudent, user: newUser };
  }
  // instance method
  // const student = new Student(payload);
  // custom method
  // if (await student.isStudentExists(payload.id))
  //   throw new Error("Student already exists");

  // const result = await student.save();
};

export const UserServices = { createStudentIntoDB };
