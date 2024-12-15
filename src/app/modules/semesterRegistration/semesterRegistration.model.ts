import { model, Schema } from "mongoose";
import validateDoc from "../../utils/validateDoc";
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
      model: SemesterRegistration,
      query: { academicSemester: this.academicSemester },
      errMsg: "Academic semester is already registered",
      trueValidate: false,
    });

    await validateDoc({
      model: AcademicSemester,
      query: { _id: this.academicSemester },
      errMsg: "Invalid academicSemester ID",
    });
  } catch (error) {
    next(error as Error);
  }
});

semesterRegistrationSchema.pre("findOneAndUpdate", async function (next) {
  try {
    const update = this.getUpdate() as Record<string, unknown>;
    if (update?.academicSemester) {
      await validateDoc({
        model: AcademicSemester,
        query: { _id: update.academicSemester },
        errMsg: "Update Failed: Invalid academicSemester ID",
      });
      await validateDoc({
        model: SemesterRegistration,
        query: {
          academicSemester: update.academicSemester,
          _id: { $ne: this.getFilter()?._id },
        },
        errMsg: "Update Failed: Academic semester is already registered",
        trueValidate: false,
      });
    }
    next();
  } catch (error) {
    next(error as Error);
  }
});

export const SemesterRegistration = model<TSemesterRegistration>(
  "SemesterRegistration",
  semesterRegistrationSchema,
);
