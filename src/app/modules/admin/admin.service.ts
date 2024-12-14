import mongoose from "mongoose";
import status from "http-status";
import { Admin } from "./admin.model";
import { User } from "../user/user.model";
import { TAdmin } from "./admin.interface";
import AppError from "../../errors/AppError";
import validateDoc from "../../utils/validateDoc";
import QueryBuilder from "../../builder/QueryBuilder";
import { AdminSearchableFields } from "./admin.constants";
import flattenNestedObjects from "../../utils/flattenNestedObjects";

const getAllAdminsFromDB = async (query: Record<string, unknown>) => {
  const adminQuery = new QueryBuilder(Admin.find(), query)
    .search(AdminSearchableFields)
    .filter()
    .sort()
    .paginate()
    .fields();
  const result = await adminQuery.modelQuery;
  return result;
};

const getAdminByIdFromDB = async (id: string) => {
  const result = await Admin.findOne({ id });
  return result;
};

const updateAdminIntoDB = async (id: string, payload: Partial<TAdmin>) => {
  await validateDoc({
    model: Admin,
    query: { id },
    errMsg: "Admin not found",
  });

  const updatedAdmin = await Admin.findOneAndUpdate(
    { id },
    flattenNestedObjects(payload),
    {
      new: true,
      runValidators: true,
    },
  );

  return { updatedAdmin };
};

const deleteAdminFromDB = async (id: string) => {
  const session = await mongoose.startSession();
  try {
    session.startTransaction();
    const deletedUser = await User.findOneAndUpdate(
      { id },
      { isDeleted: true },
      { new: true, session },
    );
    if (!deletedUser) throw new AppError(status.NOT_FOUND, "User not found");
    const deletedAdmin = await Admin.findOneAndUpdate(
      { id },
      { isDeleted: true },
      { new: true, session },
    );
    if (!deletedAdmin) throw new AppError(status.NOT_FOUND, "Admin not found");

    await session.commitTransaction();
    return { deletedUser, deletedAdmin };
  } catch (error) {
    await session.abortTransaction();
    throw error;
  } finally {
    await session.endSession();
  }
};

export const AdminServices = {
  getAllAdminsFromDB,
  getAdminByIdFromDB,
  updateAdminIntoDB,
  deleteAdminFromDB,
};
