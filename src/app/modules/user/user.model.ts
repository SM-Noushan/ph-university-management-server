import bcrypt from "bcrypt";
import status from "http-status";
import config from "../../config";
import { model, Schema } from "mongoose";
import AppError from "../../errors/AppError";
import validateDoc from "../../utils/validateDoc";
import { TUser, UserModel } from "./user.interface";
import { TLoginUser } from "../auth/auth.interface";

const userSchema = new Schema<TUser, UserModel>(
  {
    id: { type: String, required: true, unique: true },
    password: { type: String, required: true, select: false },
    needsPasswordChange: { type: Boolean, required: true, default: true },
    passwordChangedAt: { type: Date },
    role: {
      type: String,
      enum: {
        values: ["admin", "faculty", "student"],
        message: "{VALUE} is not a valid role",
      },
      required: true,
    },
    status: {
      type: String,
      enum: {
        values: ["in-progress", "blocked"],
        message: "{VALUE} is not a valid status",
      },
      required: true,
      default: "in-progress",
    },
    isDeleted: { type: Boolean, required: true, default: false },
  },
  {
    timestamps: true,
  },
);

// hashing password
userSchema.pre("save", async function (next) {
  this.password = await bcrypt.hash(
    this.password,
    Number(config.bcryptSaltRounds),
  );
  next();
});

userSchema.post("save", async function (doc, next) {
  doc.password = "";
  next();
});

// custom methods
// check if user exists
userSchema.statics.isUserExistsByCustomId = async function (id: string) {
  return await validateDoc({
    model: this,
    query: { id },
    errMsg: "!Invalid credentials.",
    select: "+password",
  });
};
//   check if user is deleted
userSchema.statics.isUserDeleted = async function (userInfo: TUser) {
  if (userInfo.isDeleted)
    throw new AppError(status.FORBIDDEN, "!Account deleted. !!Access denied");
};
//  check if user id blocked
userSchema.statics.isUserBlocked = async function (userInfo: TUser) {
  if (userInfo?.status === "blocked")
    throw new AppError(status.FORBIDDEN, "!Blocked. !!Access denied");
};
//  check if user password is correct
userSchema.statics.isPasswordMatched = async function (
  userInfo: TUser,
  password: string,
) {
  const isPasswordCorrect = await bcrypt.compare(password, userInfo.password);
  if (!isPasswordCorrect)
    throw new AppError(status.UNAUTHORIZED, "!Invalid credentials");
};
// validate user => check if user exists, is deleted, is blocked, and password is correct
userSchema.statics.validateUser = async function (payload: TLoginUser) {
  const userInfo = await this.isUserExistsByCustomId(payload.id);
  await this.isUserDeleted(userInfo);
  await this.isUserBlocked(userInfo);
  await this.isPasswordMatched(userInfo, payload.password);
  return userInfo;
};

export const User = model<TUser, UserModel>("User", userSchema);
