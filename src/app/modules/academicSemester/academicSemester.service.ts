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
    throw new Error("Invalid academic semester code");

  const result = await AcademicSemester.create(payload);
  return result;
};

export const AcademicSemesterServices = {
  getAllAcademicSemestersFromDB,
  getAcademicSemesterByIdFromDB,
  createAcademicSemesterIntoDB,
};
