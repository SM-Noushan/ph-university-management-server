import {
  TGenders,
  TGuardian,
  TUserName,
  TBloodGroups,
  TLocalGuardian,
} from "../../interface";
import { Model, Types } from "mongoose";

export type TStudent = {
  id: string;
  user: Types.ObjectId;
  name: TUserName;
  gender: TGenders;
  dateOfBirth?: Date;
  email: string;
  contactNo: string;
  emergencyContactNo: string;
  bloodGroup?: TBloodGroups;
  presentAddress: string;
  permanentAddress: string;
  guardian: TGuardian;
  localGuardian: TLocalGuardian;
  profileImg?: string;
  admissionSemester: Types.ObjectId;
  academicDepartment: Types.ObjectId;
  isDeleted: boolean;
};

// for creating instance

// export interface StudentMethods {
//   isStudentExists(id: string): Promise<TStudent | null>;
// }

// export type StudentModel = Model<
//   TStudent,
//   Record<string, never>,
//   StudentMethods
// >;

// for creating static
export interface StudentModel extends Model<TStudent> {
  // eslint-disable-next-line no-unused-vars
  isStudentExist(id: string): Promise<TStudent | null>;
}
