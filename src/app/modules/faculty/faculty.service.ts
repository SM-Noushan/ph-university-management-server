import mongoose from "mongoose";
import status from "http-status";
import { Faculty } from "./faculty.model";
import { User } from "../user/user.model";
import AppError from "../../errors/AppError";
import { TFaculty } from "./faculty.interface";
import validateDoc from "../../utils/validateDoc";
import QueryBuilder from "../../builder/QueryBuilder";
import { FacultySearchableFields } from "./faculty.constant";
import flattenNestedObjects from "../../utils/flattenNestedObjects";
import { AcademicDepartment } from "../academicDepartment/academicDepartment.model";

const getAllFacultiesFromDB = async (query: Record<string, unknown>) => {
  const facultyQuery = new QueryBuilder(Faculty.find(), query)
    .search(FacultySearchableFields)
    .filter()
    .sort()
    .paginate()
    .fields();
  const result = await facultyQuery.modelQuery.populate({
    path: "academicDepartment",
    populate: {
      path: "academicFaculty",
    },
  });
  return result;
};

const getFacultyByIdFromDB = async (id: string) => {
  const result = await Faculty.findById(id).populate({
    path: "academicDepartment",
    populate: {
      path: "academicFaculty",
    },
  });
  return result;
};

const updateFacultyIntoDB = async (id: string, payload: Partial<TFaculty>) => {
  await validateDoc({
    model: Faculty,
    query: { _id: id },
    errMsg: "Faculty not found",
  });

  if (payload.academicDepartment) {
    const academicDepartmentInfo = await validateDoc({
      model: AcademicDepartment,
      query: { _id: payload.academicDepartment },
      errMsg: "Academic department does not exists",
    });
    payload.academicFaculty =
      academicDepartmentInfo.academicFaculty as mongoose.Types.ObjectId;
  }

  const updatedFaculty = await Faculty.findByIdAndUpdate(
    id,
    flattenNestedObjects(payload),
    {
      new: true,
      runValidators: true,
    },
  );

  return { updatedFaculty };
};

const deleteFacultyFromDB = async (id: string) => {
  const session = await mongoose.startSession();
  try {
    session.startTransaction();
    const deletedFaculty = await Faculty.findByIdAndUpdate(
      id,
      { isDeleted: true },
      { new: true, session },
    );
    if (!deletedFaculty)
      throw new AppError(status.NOT_FOUND, "Faculty not found");
    const deletedUser = await User.findByIdAndUpdate(
      deletedFaculty.user,
      { isDeleted: true },
      { new: true, session },
    );
    if (!deletedUser) throw new AppError(status.NOT_FOUND, "User not found");

    await session.commitTransaction();
    return { deletedFaculty, deletedUser };
  } catch (error) {
    await session.abortTransaction();
    throw error;
  } finally {
    await session.endSession();
  }
};

export const FacultyServices = {
  getAllFacultiesFromDB,
  getFacultyByIdFromDB,
  updateFacultyIntoDB,
  deleteFacultyFromDB,
};
