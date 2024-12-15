import { Schema, model } from "mongoose";
import { TCourse, TPreRequisiteCourses } from "./course.interface";

const preRequisiteCourseSchema = new Schema<TPreRequisiteCourses>({
  course: {
    type: Schema.Types.ObjectId,
    ref: "Course",
    required: [true, "Course is required"],
  },
  isDeleted: {
    type: Boolean,
    default: false,
  },
});

const courseSchema = new Schema<TCourse>(
  {
    title: {
      type: String,
      unique: true,
      required: [true, "Title is required"],
    },
    prefix: {
      type: String,
      required: [true, "Prefix is required"],
    },
    code: {
      type: Number,
      required: [true, "Code is required"],
    },
    credits: {
      type: Number,
      required: [true, "Credits is required"],
    },
    preRequisiteCourses: {
      type: [preRequisiteCourseSchema],
      default: [],
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  },
);

courseSchema.pre(["find", "findOne"], function (next) {
  this.find({ isDeleted: { $ne: true } });
  next();
});

courseSchema.pre("aggregate", function (next) {
  this.pipeline().unshift({ $match: { isDeleted: { $ne: true } } });
  next();
});

export const Course = model<TCourse>("Course", courseSchema);
