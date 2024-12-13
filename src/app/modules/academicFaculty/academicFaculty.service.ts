import { TAcademicFaculty } from "./academicFaculty.interface";
import { AcademicFaculty } from "./academicFaculty.model";

const getAllAcademicFacultiesFromDB = async () => {
  const result = await AcademicFaculty.find();
  return result;
};

const getAcademicFacultyByIdFromDB = async (id: string) => {
  const result = await AcademicFaculty.findById(id);
  return result;
};

const createAcademicFacultyIntoDB = async (payload: TAcademicFaculty) => {
  const result = await AcademicFaculty.create(payload);
  return result;
};

const updateAcademicFacultyIntoDB = async (
  id: string,
  payload: TAcademicFaculty,
) => {
  const result = await AcademicFaculty.findByIdAndUpdate(id, payload, {
    new: true,
    runValidators: true,
  });
  if (!result) throw new Error("Academic faculty not found");
  return result;
};

export const AcademicFacultyServices = {
  getAllAcademicFacultiesFromDB,
  getAcademicFacultyByIdFromDB,
  createAcademicFacultyIntoDB,
  updateAcademicFacultyIntoDB,
};
