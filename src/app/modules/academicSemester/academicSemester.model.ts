import status from "http-status";
import {
  AcademicSemesterCodeEnum,
  AcademicSemesterNameEnum,
  MonthEnum,
} from "./academicSemester.constant";
import { model, Schema } from "mongoose";
import { TAcademicSemester } from "./academicSemester.interface";
import AppError from "../../errors/AppError";

const academicSemesterSchema = new Schema<TAcademicSemester>(
  {
    name: {
      type: String,
      enum: AcademicSemesterNameEnum,
      required: true,
    },
    code: {
      type: String,
      enum: AcademicSemesterCodeEnum,
      required: true,
    },
    year: {
      type: Number,
      required: true,
    },
    startMonth: {
      type: String,
      enum: MonthEnum,
      required: true,
    },
    endMonth: {
      type: String,
      enum: MonthEnum,
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

academicSemesterSchema.pre("save", async function (next) {
  const isSemesterExists = await AcademicSemester.findOne({
    year: this.year,
    name: this.name,
  });
  if (isSemesterExists)
    throw new AppError(status.NOT_FOUND, "Academic semester already exists");
  next();
});

academicSemesterSchema.pre("findOneAndUpdate", async function (next) {
  const update = this.getUpdate();

  if (update && typeof update === "object" && !Array.isArray(update)) {
    const { name, year } = update;

    if (name && year) {
      const isSemesterExists = await AcademicSemester.findOne({
        year,
        name,
        _id: { $ne: this.getQuery()._id },
      });

      if (isSemesterExists) {
        throw new AppError(
          status.NOT_FOUND,
          "Update Failed: Academic semester already exists",
        );
      }
    }
  }
  next();
});

export const AcademicSemester = model<TAcademicSemester>(
  "AcademicSemester",
  academicSemesterSchema,
);
