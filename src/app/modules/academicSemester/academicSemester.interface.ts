export type TMonths =
  | "January"
  | "February"
  | "March"
  | "April"
  | "May"
  | "June"
  | "July"
  | "August"
  | "September"
  | "October"
  | "November"
  | "December";

export type TAcademicSemesterNames = "Autumn" | "Summer" | "Fall";
export type TAcademicSemesterCodes = "01" | "02" | "03";

export type TAcademicSemester = {
  name: TAcademicSemesterNames;
  code: TAcademicSemesterCodes;
  year: number;
  startMonth: TMonths;
  endMonth: TMonths;
};