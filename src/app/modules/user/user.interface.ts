/* eslint-disable no-unused-vars */
import { Model } from "mongoose";
import { TLoginUser } from "../auth/auth.interface";

export interface TUser {
  id: string;
  password: string;
  needsPasswordChange: boolean;
  role: "admin" | "faculty" | "student";
  status: "in-progress" | "blocked";
  isDeleted: boolean;
}

// custom methods here
export interface UserModel extends Model<TUser> {
  isUserExistsByCustomId(id: string): Promise<TUser>;
  isUserDeleted: (user: TUser) => Promise<void>;
  isUserBlocked: (user: TUser) => Promise<void>;
  isPasswordMatched: (user: TUser, password: string) => Promise<void>;
  validateUser: (payload: TLoginUser) => Promise<void>;
}
