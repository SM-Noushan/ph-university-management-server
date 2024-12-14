import mongoose from "mongoose";
import status from "http-status";
import config from "../../config";
import { User } from "./user.model";
import { TUser } from "./user.interface";
import AppError from "../../errors/AppError";
import validateDoc from "../../utils/validateDoc";
import { Faculty } from "../faculty/faculty.model";
import { Student } from "../student/student.model";
import { TStudent } from "../student/student.interface";
import { generateFacultyOrAdminId, generateStudentId } from "./user.utils";
import { AcademicDepartment } from "../academicDepartment/academicDepartment.model";

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

const createFacultyIntoDB = async (password: string, payload: TStudent) => {
  const userData: Pick<TUser, "id" | "password" | "role"> = {
    id: "",
    password: password || (config.defaultPassword as string),
    role: "faculty",
  };
  userData.id = await generateFacultyOrAdminId("faculty");
  await validateDoc({
    model: AcademicDepartment,
    query: { _id: payload.academicDepartment },
    errMsg: "Academic department does not exists",
  });
  const session = await mongoose.startSession();
  try {
    session.startTransaction();
    // create user
    const newUser = await User.create([userData], { session });
    // create faculty
    if (!newUser.length)
      throw new AppError(status.BAD_REQUEST, "Failed to create user");

    payload.user = newUser[0]._id;
    payload.id = newUser[0].id;
    const newFaculty = await Faculty.create([payload], { session });
    if (!newFaculty.length) {
      throw new AppError(status.BAD_REQUEST, "Failed to create faculty");
    }

    await session.commitTransaction();
    return { student: newFaculty, user: newUser };
  } catch (error) {
    await session.abortTransaction();
    throw error;
  } finally {
    await session.endSession();
  }
};

export const UserServices = { createStudentIntoDB, createFacultyIntoDB };
