import mongoose from "mongoose";
import status from "http-status";
import { Student } from "./student.model";
import { User } from "../user/user.model";
import AppError from "../../errors/AppError";
import { TStudent } from "./student.interface";
import flattenNestedObjects from "./student.utility";

const studentSearchableFields = ["email", "name.firstName", "presentAddress"];

const getAllStudentsFromDB = async (query: Record<string, unknown>) => {
  const modifiedQueryObj = { ...query };
  console.log("base query", query);
  const searchTerm: string = (query?.searchTerm as string) || "";
  const searchQuery = Student.find({
    $or: studentSearchableFields.map((field: string) => ({
      [field]: { $regex: searchTerm, $options: "i" },
    })),
  });
  // filtering
  const excludeFields = ["searchTerm", "sort", "limit", "page", "fields"];
  excludeFields.forEach(field => delete modifiedQueryObj[field]);
  const sort: string = (query?.sort as string) || "-createdAt";
  const filterQuery = searchQuery
    .find(modifiedQueryObj)
    .populate("admissionSemester")
    .populate({
      path: "academicDepartment",
      populate: {
        path: "academicFaculty",
      },
    });
  const sortQuery = filterQuery.sort(sort);
  const page: number = parseInt(query?.page as string) || 1;
  const limit: number = parseInt(query?.limit as string) || 10;
  const skip: number = (page - 1) * limit;
  const paginateQuery = sortQuery.skip(skip).limit(limit);
  const fields = (query?.fields as string)?.split(",")?.join(" ") || "";
  const fieldQuery = await paginateQuery.select(fields);
  return fieldQuery;
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
