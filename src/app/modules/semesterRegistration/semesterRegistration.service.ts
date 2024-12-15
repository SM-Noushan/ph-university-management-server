import { SemesterRegistration } from "./semesterRegistration.model";
import { TSemesterRegistration } from "./semesterRegistration.interface";

const createSemesterRegistrationIntoDB = async (
  payload: TSemesterRegistration,
) => {
  const result = await SemesterRegistration.create(payload);
  return result;
};

export const SemesterRegistrationServices = {
  createSemesterRegistrationIntoDB,
};
