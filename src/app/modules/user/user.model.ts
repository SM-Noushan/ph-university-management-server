import { model, Schema } from "mongoose";
import { TUser } from "./user.interface";

const userSchema = new Schema<TUser>(
  {
    id: { type: String, required: true },
    password: { type: String, required: true },
    needsPasswordChange: { type: Boolean, required: true, default: true },
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

export const User = model<TUser>("User", userSchema);
