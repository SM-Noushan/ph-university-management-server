import express from "express";
import { userControllers } from "./user.controller";
import validateRequest from "../../middlewares/validateRequest";
import { StudentValidations } from "../student/student.validation";

const router = express.Router();

router.post(
  "/create-student",
  validateRequest(StudentValidations.CreateStudentValidationSchema),
  userControllers.createStudent,
);

export const UserRoutes = router;
