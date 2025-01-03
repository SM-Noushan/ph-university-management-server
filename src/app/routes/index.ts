import express from "express";
import { AuthRoutes } from "../modules/auth/auth.route";
import { UserRoutes } from "../modules/user/user.route";
import { AdminRoutes } from "../modules/admin/admin.route";
import { CourseRoutes } from "../modules/course/course.route";
import { StudentRoutes } from "../modules/student/student.route";
import { FacultyRoutes } from "../modules/faculty/faculty.route";
import { OfferedCourseRoutes } from "../modules/offeredCourses/offeredCourses.route";
import { EnrolledCourseRoutes } from "../modules/enrolledCourse/enrolledCourse.route";
import { AcademicFacultyRoutes } from "../modules/academicFaculty/academicFaculty.route";
import { AcademicSemesterRoutes } from "../modules/academicSemester/academicSemester.route";
import { AcademicDepartmentRoutes } from "../modules/academicDepartment/academicDepartment.route";
import { SemesterRegistrationRoutes } from "../modules/semesterRegistration/semesterRegistration.route";

const router = express.Router();

const moduleRoutes = [
  {
    path: "/auth",
    route: AuthRoutes,
  },
  {
    path: "/students",
    route: StudentRoutes,
  },
  {
    path: "/faculties",
    route: FacultyRoutes,
  },
  {
    path: "/admins",
    route: AdminRoutes,
  },
  {
    path: "/users",
    route: UserRoutes,
  },
  {
    path: "/academic-semesters",
    route: AcademicSemesterRoutes,
  },
  {
    path: "/academic-faculties",
    route: AcademicFacultyRoutes,
  },
  {
    path: "/academic-departments",
    route: AcademicDepartmentRoutes,
  },
  {
    path: "/courses",
    route: CourseRoutes,
  },
  {
    path: "/enrolled-courses",
    route: EnrolledCourseRoutes,
  },
  {
    path: "/semester-registration",
    route: SemesterRegistrationRoutes,
  },
  {
    path: "/offered-course",
    route: OfferedCourseRoutes,
  },
];

moduleRoutes.forEach(route => router.use(route.path, route.route));

export default router;
