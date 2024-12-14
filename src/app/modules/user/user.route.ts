import express from "express";
import { userControllers } from "./user.controller";
import { AdminValidations } from "../admin/admin.validation";
import validateRequest from "../../middlewares/validateRequest";
import { StudentValidations } from "../student/student.validation";
import { FacultyValidations } from "../faculty/faculty.validation";

const router = express.Router();

router.post(
  "/create-student",
  validateRequest(StudentValidations.CreateStudentValidationSchema),
  userControllers.createStudent,
);
router.post(
  "/create-faculty",
  validateRequest(FacultyValidations.CreateFacultyValidationSchema),
  userControllers.createFaculty,
);
router.post(
  "/create-admin",
  validateRequest(AdminValidations.CreateAdminValidationSchema),
  userControllers.createAdmin,
);

export const UserRoutes = router;
