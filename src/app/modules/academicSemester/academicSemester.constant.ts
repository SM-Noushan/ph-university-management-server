import {
  TAcademicSemesterCodes,
  TAcademicSemesterNameCodeMapper,
  TAcademicSemesterNames,
  TMonths,
} from "./academicSemester.interface";

export const MonthEnum: TMonths[] = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];
export const AcademicSemesterNameEnum: TAcademicSemesterNames[] = [
  "Autumn",
  "Summer",
  "Fall",
];
export const AcademicSemesterCodeEnum: TAcademicSemesterCodes[] = [
  "01",
  "02",
  "03",
];

export const academicSemesterNameCodeMapper: TAcademicSemesterNameCodeMapper = {
  Autumn: "01",
  Summer: "02",
  Fall: "03",
};
