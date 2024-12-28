import { TUserRole } from "./user.interface";

export const USER_ROLE = {
  student: "student",
  faculty: "faculty",
  admin: "admin",
  superAdmin: "superAdmin",
} as const;

export const UserRoleEnum: TUserRole[] = Object.values(USER_ROLE);
