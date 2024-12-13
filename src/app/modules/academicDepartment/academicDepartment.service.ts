import { TAcademicDepartment } from "./academicDepartment.interface";
import { AcademicDepartment } from "./academicDepartment.model";

const getAllAcademicDepartmentsFromDB = async () => {
  const result = await AcademicDepartment.find();
  return result;
};

const getAcademicDepartmentByIdFromDB = async (id: string) => {
  const result = await AcademicDepartment.findById(id);
  return result;
};

const createAcademicDepartmentIntoDB = async (payload: TAcademicDepartment) => {
  const result = await AcademicDepartment.create(payload);
  return result;
};

const updateAcademicDepartmentIntoDB = async (
  id: string,
  payload: Partial<TAcademicDepartment>,
) => {
  const result = await AcademicDepartment.findByIdAndUpdate(id, payload, {
    new: true,
    runValidators: true,
  });
  return result;
};

export const AcademicDepartmentServices = {
  getAllAcademicDepartmentsFromDB,
  getAcademicDepartmentByIdFromDB,
  createAcademicDepartmentIntoDB,
  updateAcademicDepartmentIntoDB,
};
