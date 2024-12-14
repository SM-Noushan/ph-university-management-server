import { Faculty } from "./faculty.model";
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
  const result = await Faculty.findOne({ id }).populate({
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
    query: { id },
    errMsg: "Faculty not found",
  });

  if (payload.academicDepartment)
    await validateDoc({
      model: AcademicDepartment,
      query: { _id: payload.academicDepartment },
      errMsg: "Academic department does not exists",
    });

  const updatedFaculty = await Faculty.findOneAndUpdate(
    { id },
    flattenNestedObjects(payload),
    {
      new: true,
      runValidators: true,
    },
  );

  return { updatedFaculty };
};

export const FacultyServices = {
  getAllFacultiesFromDB,
  getFacultyByIdFromDB,
  updateFacultyIntoDB,
};
