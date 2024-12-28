import { TEnrolledCourseGrade } from "./enrolledCourse.interface";

export const calculateGradeAndPoints = (
  result: number,
): { grade: TEnrolledCourseGrade; gradePoints: number } => {
  let grade: TEnrolledCourseGrade;
  let gradePoints: number;

  if (result >= 90 && result <= 100) {
    grade = "A";
    gradePoints = 4.0;
  } else if (result >= 80) {
    grade = "B";
    gradePoints = 3.0;
  } else if (result >= 70) {
    grade = "C";
    gradePoints = 2.0;
  } else if (result >= 60) {
    grade = "D";
    gradePoints = 1.0;
  } else if (result >= 0) {
    grade = "F";
    gradePoints = 0.0;
  } else {
    grade = "NA";
    gradePoints = 0.0;
  }

  return { grade, gradePoints };
};
