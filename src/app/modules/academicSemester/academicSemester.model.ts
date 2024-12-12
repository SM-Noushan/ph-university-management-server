import {
  AcademicSemesterCodeEnum,
  AcademicSemesterNameEnum,
  MonthEnum,
} from "./academicSemester.constant";
import { model, Schema } from "mongoose";
import { TAcademicSemester } from "./academicSemester.interface";

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
  if (isSemesterExists) throw new Error("Academic semester already exists");
  next();
});

export const AcademicSemester = model<TAcademicSemester>(
  "AcademicSemester",
  academicSemesterSchema,
);
