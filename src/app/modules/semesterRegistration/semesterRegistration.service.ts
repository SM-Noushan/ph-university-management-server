import QueryBuilder from "../../builder/QueryBuilder";
import { SemesterRegistration } from "./semesterRegistration.model";
import { TSemesterRegistration } from "./semesterRegistration.interface";

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

const createSemesterRegistrationIntoDB = async (
  payload: TSemesterRegistration,
) => {
  const result = await SemesterRegistration.create(payload);
  return result;
};

export const SemesterRegistrationServices = {
  getAllSemesterRegistrationsFromDB,
  createSemesterRegistrationIntoDB,
};
