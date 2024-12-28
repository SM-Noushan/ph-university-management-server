import mongoose from "mongoose";
import status from "http-status";
import { Student } from "./student.model";
import { User } from "../user/user.model";
import AppError from "../../errors/AppError";
import { TStudent } from "./student.interface";
import validateDoc from "../../utils/validateDoc";
import QueryBuilder from "../../builder/QueryBuilder";
import { studentSearchableFields } from "./student.constant";
import flattenNestedObjects from "../../utils/flattenNestedObjects";
import { AcademicDepartment } from "../academicDepartment/academicDepartment.model";

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
  const result = await Student.findById(id)
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
  if (payload.academicDepartment) {
    const academicDepartmentInfo = await validateDoc({
      model: AcademicDepartment,
      query: { _id: payload.academicDepartment },
      errMsg: "Academic department does not exists",
    });
    payload.academicFaculty =
      academicDepartmentInfo.academicFaculty as mongoose.Types.ObjectId;
  }
  const updatedStudent = await Student.findByIdAndUpdate(
    id,
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
    const deletedStudent = await Student.findByIdAndUpdate(
      id,
      { isDeleted: true },
      { new: true, session },
    );
    if (!deletedStudent)
      throw new AppError(status.NOT_FOUND, "Student not found");
    const deletedUser = await User.findByIdAndUpdate(
      deletedStudent.user,
      { isDeleted: true },
      { new: true, session },
    );
    if (!deletedUser) throw new AppError(status.NOT_FOUND, "User not found");

    await session.commitTransaction();
    return { deletedStudent, deletedUser };
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
