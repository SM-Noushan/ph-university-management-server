import { Types } from "mongoose";
import status from "http-status";
import AppError from "../../errors/AppError";
import { Student } from "../student/student.model";
import { AcademicSemester } from "../academicSemester/academicSemester.model";

const findSemesterInfo = async (id: Types.ObjectId) => {
  const academicSemester = await AcademicSemester.findById(id);
  return academicSemester;
};
const findLastStudentId = async (semesterId: Types.ObjectId) => {
  const lastUser = await Student.find({ admissionSemester: semesterId })
    .sort({ createdAt: -1 })
    .select("id")
    .lean()
    .limit(1);

  return parseInt(lastUser?.[0]?.id?.substring(6)) || 0;
};

export const generateStudentId = async (semesterId: Types.ObjectId) => {
  const academicSemester = await findSemesterInfo(semesterId);
  if (!academicSemester)
    throw new AppError(status.NOT_FOUND, "Academic semester not found");
  const lastStudentId = await findLastStudentId(semesterId);
  return `${academicSemester.year}${academicSemester.code}${(lastStudentId + 1).toString().padStart(4, "0")}`;
};
