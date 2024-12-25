import { Types } from "mongoose";
import status from "http-status";
import { User } from "./user.model";
import AppError from "../../errors/AppError";
import { TAdmin } from "../admin/admin.interface";
import { Student } from "../student/student.model";
import { TStudent } from "../student/student.interface";
import { TFaculty } from "../faculty/faculty.interface";
import { sendImageToCloudinary } from "../../utils/sendImageToCloudinary";
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

const findLastFacultyOrAdminId = async (role: string) => {
  const lastUser = await User.findOne({
    role,
  })
    .select("-_id id")
    .sort({ createdAt: -1 })
    .lean();

  return parseInt(lastUser?.id ? lastUser?.id?.substring(2) : "0");
};

export const generateStudentId = async (semesterId: Types.ObjectId) => {
  const academicSemester = await findSemesterInfo(semesterId);
  if (!academicSemester)
    throw new AppError(status.NOT_FOUND, "Academic semester not found");
  const lastStudentId = await findLastStudentId(semesterId);
  return `${academicSemester.year}${academicSemester.code}${(lastStudentId + 1).toString().padStart(4, "0")}`;
};

export const generateFacultyOrAdminId = async (role: "faculty" | "admin") => {
  const lastFacultyOrAdminId = await findLastFacultyOrAdminId(role);
  return `${role === "faculty" ? "F" : "A"}-${(lastFacultyOrAdminId + 1).toString().padStart(4, "0")}`;
};

export const setImageUrlIntoPayload = async (
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  file: any,
  payload: TStudent | TFaculty | TAdmin,
  id: string,
) => {
  if (file) {
    const imageName = `${id}-${payload.name.firstName}`;
    const path = file?.path;
    payload.profileImg = await sendImageToCloudinary(imageName, path);
  }
};
