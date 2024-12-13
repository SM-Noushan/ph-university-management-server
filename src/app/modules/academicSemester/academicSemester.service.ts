import status from "http-status";
import AppError from "../../errors/AppError";
import { AcademicSemester } from "./academicSemester.model";
import { TAcademicSemester } from "./academicSemester.interface";
import { academicSemesterNameCodeMapper } from "./academicSemester.constant";

const getAllAcademicSemestersFromDB = async () => {
  const result = await AcademicSemester.find();
  return result;
};

const getAcademicSemesterByIdFromDB = async (id: string) => {
  const result = await AcademicSemester.findById(id);
  return result;
};

const createAcademicSemesterIntoDB = async (payload: TAcademicSemester) => {
  if (academicSemesterNameCodeMapper[payload.name] !== payload.code)
    throw new AppError(status.NOT_FOUND, "Invalid academic semester code");

  const result = await AcademicSemester.create(payload);
  return result;
};

const updateAcademicSemesterIntoDB = async (
  id: string,
  payload: Partial<TAcademicSemester>,
) => {
  if ((payload.name && !payload.code) || (!payload.name && payload.code))
    throw new AppError(
      status.NOT_FOUND,
      "Update Failed: Both name and code must be provided together or omitted",
    );

  if (
    payload.name &&
    payload.code &&
    academicSemesterNameCodeMapper[payload.name] !== payload.code
  )
    throw new AppError(
      status.NOT_FOUND,
      "Update Failed: Invalid academic semester code",
    );

  const result = await AcademicSemester.findByIdAndUpdate(id, payload, {
    new: true,
    runValidators: true,
  });

  if (!result)
    throw new AppError(status.NOT_FOUND, "Academic semester not found");
  return result;
};

export const AcademicSemesterServices = {
  getAllAcademicSemestersFromDB,
  getAcademicSemesterByIdFromDB,
  createAcademicSemesterIntoDB,
  updateAcademicSemesterIntoDB,
};
