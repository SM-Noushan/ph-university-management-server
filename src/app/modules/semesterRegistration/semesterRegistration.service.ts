import { Document } from "mongoose";
import {
  TSemesterRegistration,
  TSemesterRegistrationStatus,
} from "./semesterRegistration.interface";
import AppError from "../../errors/AppError";
import QueryBuilder from "../../builder/QueryBuilder";
import { SemesterRegistration } from "./semesterRegistration.model";

// utility
const validateSemesterUpdate = (
  currentStatus: TSemesterRegistrationStatus,
  payload: Partial<TSemesterRegistration>,
) => {
  // Ensure `ENDED` semesters cannot be updated
  if (currentStatus === "ENDED") {
    throw new AppError(
      400,
      "Cannot update an already ended semester registration",
    );
  }

  // Validation for `UPCOMING` semesters
  if (currentStatus === "UPCOMING") {
    if (payload.status && payload.status === "ENDED") {
      throw new AppError(
        400,
        "For UPCOMING semester, status can only be updated to ONGOING",
      );
    }
  }

  // Validation for `ONGOING` semesters
  if (currentStatus === "ONGOING") {
    if (!payload.status || payload.status !== "ENDED") {
      throw new AppError(
        400,
        "For ONGOING semester, only the status can be updated to ENDED",
      );
    }

    // Ensure no other fields besides `status` are updated
    const nonStatusKeys = Object.keys(payload).filter(key => key !== "status");
    if (nonStatusKeys.length > 0) {
      throw new AppError(
        400,
        "For ONGOING semester, only the status can be updated",
      );
    }
  }
};

const getAllSemesterRegistrationsFromDB = async (
  query: Record<string, unknown>,
) => {
  const semesterRegistrationQuery = new QueryBuilder(
    SemesterRegistration.find(),
    query,
  )
    .filter()
    .sort()
    .paginate()
    .fields();

  const result =
    await semesterRegistrationQuery.modelQuery.populate("academicSemester");
  return result;
};

const getSemesterRegistrationByIdFromDB = async (id: string) => {
  const result =
    await SemesterRegistration.findById(id).populate("academicSemester");
  return result;
};

const createSemesterRegistrationIntoDB = async (
  payload: TSemesterRegistration,
) => {
  if (payload?.status && payload?.status !== "UPCOMING")
    throw new AppError(400, "Semester registration status must be UPCOMING");
  const result = await SemesterRegistration.create(payload);
  return result;
};

const updateSemesterRegistrationIntoDB = async (
  id: string,
  payload: Partial<TSemesterRegistration>,
): Promise<(Document & TSemesterRegistration) | null> => {
  // Find the requested semester registration
  const requestedSemesterRegistration = await SemesterRegistration.findById(id);

  if (!requestedSemesterRegistration) {
    throw new AppError(404, "Semester registration not found");
  }

  // Validate update rules
  validateSemesterUpdate(
    requestedSemesterRegistration.status as TSemesterRegistrationStatus,
    payload,
  );

  // Perform the update
  const updatedSemesterRegistration =
    await SemesterRegistration.findByIdAndUpdate(id, payload, {
      new: true,
      runValidators: true,
    });

  return updatedSemesterRegistration;
};

export const SemesterRegistrationServices = {
  getAllSemesterRegistrationsFromDB,
  getSemesterRegistrationByIdFromDB,
  createSemesterRegistrationIntoDB,
  updateSemesterRegistrationIntoDB,
};
