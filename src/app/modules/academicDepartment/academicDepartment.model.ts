import { model, Schema } from "mongoose";
import { TAcademicDepartment } from "./academicDepartment.interface";
import { AcademicFaculty } from "../academicFaculty/academicFaculty.model";
import AppError from "../../errors/AppError";
import status from "http-status";

const academicDepartmentSchema = new Schema<TAcademicDepartment>(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
    academicFaculty: {
      type: Schema.Types.ObjectId,
      ref: "AcademicFaculty",
      required: [true, "Academic faculty is required"],
    },
  },
  {
    timestamps: true,
  },
);

const validateAcademicFaculty = async (facultyId: string) => {
  const facultyExists = await AcademicFaculty.exists({ _id: facultyId });
  if (!facultyExists) {
    throw new AppError(status.NOT_FOUND, "Academic Faculty does not exist");
  }
};

const validateDepartment = async (name: string, id: string = "") => {
  const query = id ? { name, _id: { $ne: id } } : { name };
  const departmentExists = await AcademicDepartment.exists(query);
  if (departmentExists) {
    throw new AppError(status.BAD_REQUEST, "Department already exists");
  }
};

academicDepartmentSchema.pre("save", async function (next) {
  await validateAcademicFaculty(this.academicFaculty as string);
  await validateDepartment(this.name);
  next();
});

academicDepartmentSchema.pre("findOneAndUpdate", async function (next) {
  const { _id } = this.getFilter();
  const docExists = await AcademicDepartment.exists({ _id });
  if (!docExists)
    throw new AppError(status.NOT_FOUND, "Department does not exist");
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const update = this.getUpdate() as Record<string, any>;
  if (update.academicFaculty)
    await validateAcademicFaculty(update.academicFaculty);
  if (update.name) await validateDepartment(update.name, _id);
  next();
});

export const AcademicDepartment = model<TAcademicDepartment>(
  "AcademicDepartment",
  academicDepartmentSchema,
);
