import bcrypt from "bcrypt";
import status from "http-status";
import config from "../../config";
import { model, Schema } from "mongoose";
import AppError from "../../errors/AppError";
import { UserRoleEnum } from "./user.constant";
import validateDoc from "../../utils/validateDoc";
import { TUser, UserModel } from "./user.interface";

const userSchema = new Schema<TUser, UserModel>(
  {
    id: { type: String, required: true, unique: true },
    password: { type: String, required: true, select: false },
    email: {
      type: String,
      unique: true,
      required: true,
    },
    needsPasswordChange: { type: Boolean, required: true, default: true },
    passwordChangedAt: { type: Date },
    role: {
      type: String,
      enum: {
        values: UserRoleEnum,
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
  if (this.password)
    this.password = await bcrypt.hash(
      this.password,
      Number(config.bcryptSaltRounds),
    );
  next();
});

userSchema.post("save", async function (doc, next) {
  if (this.password) doc.password = "";
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
//   check if jwt is issued before password changed
userSchema.statics.isJWTIssuedBeforePasswordChanged = function (
  passwordChangeTimestamp,
  jwtIssuedTimestamp,
) {
  if (
    parseInt((new Date(passwordChangeTimestamp).getTime() / 1000).toString()) >
    jwtIssuedTimestamp
  )
    throw new AppError(status.UNAUTHORIZED, "Unauthorized access");
};
//   check if user is deleted
userSchema.statics.isUserDeleted = function (userInfo: TUser) {
  if (userInfo.isDeleted)
    throw new AppError(status.FORBIDDEN, "!Account deleted. !!Access denied");
};
//  check if user id blocked
userSchema.statics.isUserBlocked = function (userInfo: TUser) {
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
userSchema.statics.validateUser = async function ({
  payload,
  checkIsDeleted = true,
  checkIsBlocked = true,
  checkIsPasswordMatched = true,
  checkIsJWTIssuedBeforePasswordChanged = false,
}) {
  const userInfo = await this.isUserExistsByCustomId(payload.id);
  if (checkIsJWTIssuedBeforePasswordChanged && userInfo?.passwordChangedAt)
    this.isJWTIssuedBeforePasswordChanged(
      userInfo?.passwordChangedAt,
      payload.iat,
    );
  if (checkIsDeleted) this.isUserDeleted(userInfo);
  if (checkIsBlocked) this.isUserBlocked(userInfo);
  if (checkIsPasswordMatched)
    await this.isPasswordMatched(userInfo, payload.password);
  return userInfo;
};

export const User = model<TUser, UserModel>("User", userSchema);
