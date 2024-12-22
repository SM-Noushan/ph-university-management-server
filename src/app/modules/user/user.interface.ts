/* eslint-disable no-unused-vars */
import { Model } from "mongoose";
import { USER_ROLE } from "./user.constant";
import { TLoginUser } from "../auth/auth.interface";

export interface TUser {
  id: string;
  password: string;
  email: string;
  needsPasswordChange: boolean;
  passwordChangedAt?: Date;
  role: "admin" | "faculty" | "student";
  status: "in-progress" | "blocked";
  isDeleted: boolean;
}

interface iValidateUserOptions {
  payload: TLoginUser & { iat?: number };
  checkIsDeleted?: boolean;
  checkIsBlocked?: boolean;
  checkIsPasswordMatched?: boolean;
  checkIsJWTIssuedBeforePasswordChanged?: boolean;
}

// custom methods here
export interface UserModel extends Model<TUser> {
  isUserExistsByCustomId(id: string): Promise<TUser>;
  isUserDeleted: (user: TUser) => Promise<void>;
  isUserBlocked: (user: TUser) => Promise<void>;
  isPasswordMatched: (user: TUser, password: string) => Promise<void>;
  isJWTIssuedBeforePasswordChanged: (
    passwordChangeTimestamp: Date,
    jwtIssuedTimestamp: number,
  ) => Promise<void>;
  validateUser: ({
    payload,
    checkIsDeleted,
    checkIsBlocked,
    checkIsPasswordMatched,
    checkIsJWTIssuedBeforePasswordChanged,
  }: iValidateUserOptions) => Promise<TUser>;
}

export type TUserRole = keyof typeof USER_ROLE;
