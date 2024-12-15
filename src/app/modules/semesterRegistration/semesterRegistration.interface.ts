import { Types } from "mongoose";

export type TSemesterRegistrationStatus = "UPCOMING" | "ONGOING" | "ENDED";

export type TSemesterRegistration = {
  academicSemester: Types.ObjectId;
  status?: TSemesterRegistrationStatus;
  minCredit?: number;
  maxCredit?: number;
  start: Date;
  end: Date;
};
