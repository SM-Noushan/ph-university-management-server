import validateDoc from "../../utils/validateDoc";
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

const getSemesterRegistrationByIdFromDB = async (id: string) => {
  const result =
    await SemesterRegistration.findById(id).populate("academicSemester");
  return result;
};

const createSemesterRegistrationIntoDB = async (
  payload: TSemesterRegistration,
) => {
  const result = await SemesterRegistration.create(payload);
  return result;
};

const updateSemesterRegistrationIntoDB = async (
  id: string,
  payload: Partial<TSemesterRegistration>,
) => {
  await validateDoc({
    model: SemesterRegistration,
    query: { _id: id },
    errMsg: "Semester registration not found",
  });
  const result = await await SemesterRegistration.findByIdAndUpdate(
    id,
    payload,
    {
      new: true,
      runValidators: true,
    },
  );
  return result;
};

export const SemesterRegistrationServices = {
  getAllSemesterRegistrationsFromDB,
  getSemesterRegistrationByIdFromDB,
  createSemesterRegistrationIntoDB,
  updateSemesterRegistrationIntoDB,
};
