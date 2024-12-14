import mongoose from "mongoose";
import status from "http-status";
import { Student } from "./student.model";
import { User } from "../user/user.model";
import AppError from "../../errors/AppError";
import { TStudent } from "./student.interface";
import flattenNestedObjects from "./student.utility";
import QueryBuilder from "../../builder/QueryBuilder";
import { studentSearchableFields } from "./student.constant";

const getAllStudentsFromDB = async (query: Record<string, unknown>) => {
  const studentQuery = new QueryBuilder(Student.find(), query)
    .search(studentSearchableFields)
    .filter()
    .sort()
    .paginate()
    .fields();
  const result = await studentQuery.modelQuery
    .populate("admissionSemester")
    .populate({
      path: "academicDepartment",
      populate: {
        path: "academicFaculty",
      },
    });
  return result;
};

const getStudentByIdFromDB = async (id: string) => {
  const result = await Student.findOne({ id })
    .populate("admissionSemester")
    .populate({
      path: "academicDepartment",
      populate: {
        path: "academicFaculty",
      },
    });
  return result;
};

const updateStudentIntoDB = async (id: string, payload: Partial<TStudent>) => {
  const updatedStudent = await Student.findOneAndUpdate(
    { id },
    flattenNestedObjects(payload),
    {
      new: true,
      runValidators: true,
    },
  );

  return { updatedStudent };
};

const deleteStudentFromDB = async (id: string) => {
  const session = await mongoose.startSession();
  try {
    session.startTransaction();
    const deletedUser = await User.findOneAndUpdate(
      { id },
      { isDeleted: true },
      { new: true, session },
    );
    if (!deletedUser) throw new AppError(status.NOT_FOUND, "User not found");

    const deletedStudent = await Student.findOneAndUpdate(
      { id },
      { isDeleted: true },
      { new: true, session },
    );
    if (!deletedStudent)
      throw new AppError(status.NOT_FOUND, "Student not found");

    await session.commitTransaction();
    return { deletedUser, deletedStudent };
  } catch (error) {
    await session.abortTransaction();
    throw error;
  } finally {
    await session.endSession();
  }
};

export const StudentServices = {
  getAllStudentsFromDB,
  getStudentByIdFromDB,
  updateStudentIntoDB,
  deleteStudentFromDB,
};
