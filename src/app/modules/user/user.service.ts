/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  generateStudentId,
  setImageUrlIntoPayload,
  generateFacultyOrAdminId,
} from "./user.utils";
import status from "http-status";
import config from "../../config";
import { User } from "./user.model";
import { USER_ROLE } from "./user.constant";
import AppError from "../../errors/AppError";
import { Admin } from "../admin/admin.model";
import validateDoc from "../../utils/validateDoc";
import { TAdmin } from "../admin/admin.interface";
import { Faculty } from "../faculty/faculty.model";
import { Student } from "../student/student.model";
import { TUser, TUserRole } from "./user.interface";
import mongoose, { Model, Document } from "mongoose";
import { TStudent } from "../student/student.interface";
import { TFaculty } from "../faculty/faculty.interface";
import { AcademicDepartment } from "../academicDepartment/academicDepartment.model";

const createStudentIntoDB = async (
  file: any,
  password: string,
  payload: TStudent,
) => {
  const userData: Pick<TUser, "id" | "password" | "role" | "email"> = {
    id: "",
    password: password || (config.defaultPassword as string),
    role: "student",
    email: payload.email,
  };
  userData.id = await generateStudentId(payload.admissionSemester);
  await setImageUrlIntoPayload(file, payload, userData.id);
  await validateDoc({
    model: AcademicDepartment,
    query: { _id: payload.academicDepartment },
    errMsg: "Academic department does not exists",
  });

  const session = await mongoose.startSession();
  session.startTransaction();
  try {
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
};

const createFacultyIntoDB = async (
  file: any,
  password: string,
  payload: TFaculty,
) => {
  const userData: Pick<TUser, "id" | "password" | "role" | "email"> = {
    id: "",
    password: password || (config.defaultPassword as string),
    role: "faculty",
    email: payload.email,
  };
  userData.id = await generateFacultyOrAdminId("faculty");
  await setImageUrlIntoPayload(file, payload, userData.id);
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
    return { faculty: newFaculty, user: newUser };
  } catch (error) {
    await session.abortTransaction();
    throw error;
  } finally {
    await session.endSession();
  }
};

const createAdminIntoDB = async (
  file: any,
  password: string,
  payload: TAdmin,
) => {
  const userData: Pick<TUser, "id" | "password" | "role" | "email"> = {
    id: "",
    password: password || (config.defaultPassword as string),
    role: "admin",
    email: payload.email,
  };
  userData.id = await generateFacultyOrAdminId("admin");
  await setImageUrlIntoPayload(file, payload, userData.id);

  const session = await mongoose.startSession();
  try {
    session.startTransaction();
    // create user
    const newUser = await User.create([userData], { session });
    // create admin
    if (!newUser.length)
      throw new AppError(status.BAD_REQUEST, "Failed to create user");

    payload.user = newUser[0]._id;
    payload.id = newUser[0].id;
    const newAdmin = await Admin.create([payload], { session });
    if (!newAdmin.length) {
      throw new AppError(status.BAD_REQUEST, "Failed to create admin");
    }

    await session.commitTransaction();
    return { admin: newAdmin, user: newUser };
  } catch (error) {
    await session.abortTransaction();
    throw error;
  } finally {
    await session.endSession();
  }
};

const getMe = async (id: string, role: TUserRole) => {
  const roleModelMap: Record<TUserRole, Model<any>> = {
    [USER_ROLE.admin]: Admin,
    [USER_ROLE.faculty]: Faculty,
    [USER_ROLE.student]: Student,
  };
  const Model = roleModelMap[role];
  const result = await Model.findOne({ id }).populate("user");
  return result;
};

const changeStatus = async (
  id: string,
  userStatus: "in-progress" | "blocked",
) => {
  const user = (await validateDoc({
    model: User,
    query: { _id: id },
    errMsg: "User does not exists",
  })) as TUser & Document;
  if (user.status === userStatus)
    throw new AppError(
      status.BAD_REQUEST,
      `User is already in this status - ${userStatus}`,
    );
  user.status = userStatus;
  await user.save();
  return user;
};

export const UserServices = {
  createStudentIntoDB,
  createFacultyIntoDB,
  createAdminIntoDB,
  getMe,
  changeStatus,
};
