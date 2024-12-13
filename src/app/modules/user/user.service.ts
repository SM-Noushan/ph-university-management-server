import config from "../../config";
import { User } from "./user.model";
import { TUser } from "./user.interface";
import { generateStudentId } from "./user.utils";
import { Student } from "../student/student.model";
import { TStudent } from "../student/student.interface";
import { AcademicDepartment } from "../academicDepartment/academicDepartment.model";
import validateDoc from "../../utils/validateDoc";
import mongoose from "mongoose";
import AppError from "../../errors/AppError";
import status from "http-status";

const createStudentIntoDB = async (password: string, payload: TStudent) => {
  // custom static method
  //   if (await Student.isStudentExist(payload.id))
  // throw new Error("Student already exists");
  // static method

  const userData: Pick<TUser, "id" | "password" | "role"> = {
    id: "",
    password: password || (config.defaultPassword as string),
    role: "student",
  };
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    userData.id = await generateStudentId(payload.admissionSemester);
    await validateDoc({
      model: AcademicDepartment,
      query: { _id: payload.academicDepartment },
      errMsg: "Academic department does not exists",
    });

    // create user
    const newUser = await User.create([userData], { session });
    // create student
    if (!newUser.length)
      throw new AppError(status.BAD_REQUEST, "Failed to create user");

    payload.user = newUser[0]._id;
    payload.id = newUser[0].id;
    const newStudent = await Student.create([payload], { session });
    if (!newStudent.length) {
      throw new AppError(status.BAD_REQUEST, "Failed to create student");
    }

    await session.commitTransaction();

    return { student: newStudent, user: newUser };
  } catch (error) {
    await session.abortTransaction();
    throw error;
  } finally {
    await session.endSession();
  }
  // instance method
  // const student = new Student(payload);
  // custom method
  // if (await student.isStudentExists(payload.id))
  //   throw new Error("Student already exists");

  // const result = await student.save();
};

export const UserServices = { createStudentIntoDB };
