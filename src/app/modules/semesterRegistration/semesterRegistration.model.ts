import validateDoc from "../../utils/validateDoc";
import { Document, model, Query, Schema } from "mongoose";
import catchAsyncRefined from "../../utils/catchAsyncRefined";
import { TSemesterRegistration } from "./semesterRegistration.interface";
import { AcademicSemester } from "../academicSemester/academicSemester.model";
import { SemesterRegistrationStatusEnum } from "./semesterRegistration.constant";

const semesterRegistrationSchema = new Schema<TSemesterRegistration>(
  {
    academicSemester: {
      type: Schema.Types.ObjectId,
      ref: "AcademicSemester",
      unique: true,
      required: true,
    },
    status: {
      type: String,
      enum: SemesterRegistrationStatusEnum,
      default: "UPCOMING",
    },
    minCredit: {
      type: Number,
      default: 3,
    },
    maxCredit: {
      type: Number,
      default: 15,
    },
    start: {
      type: Date,
      required: true,
    },
    end: {
      type: Date,
      required: true,
    },
  },
  { timestamps: true },
);

semesterRegistrationSchema.pre("save", async function (next) {
  try {
    await validateDoc({
      model: AcademicSemester,
      query: { _id: this.academicSemester },
      errMsg: "Invalid academicSemester ID",
    });
    next();
  } catch (error) {
    next(error as Error);
  }
});

semesterRegistrationSchema.pre(
  "save",
  catchAsyncRefined(async function (
    this: Document & TSemesterRegistration,
    next,
  ) {
    await validateDoc({
      model: AcademicSemester,
      query: { _id: this.academicSemester },
      errMsg: "Invalid academicSemester ID",
    });
    next();
  }),
);

semesterRegistrationSchema.pre(
  "findOneAndUpdate",
  catchAsyncRefined(async function (this: Query<unknown, Document>, next) {
    const update = this.getUpdate() as Record<string, unknown>;
    if (update?.academicSemester) {
      await validateDoc({
        model: AcademicSemester,
        query: { _id: update.academicSemester },
        errMsg: "Update Failed: Invalid academicSemester ID",
      });
    }
    next();
  }),
);

export const SemesterRegistration = model<TSemesterRegistration>(
  "SemesterRegistration",
  semesterRegistrationSchema,
);
