import express from "express";
import auth from "../../middlewares/auth";
import { USER_ROLE } from "../user/user.constant";
import { StudentControllers } from "./student.controller";
import { StudentValidations } from "./student.validation";
import validateRequest from "../../middlewares/validateRequest";

const studentRouter = express.Router();

studentRouter.get(
  "/",
  auth(USER_ROLE.superAdmin, USER_ROLE.admin, USER_ROLE.faculty),
  StudentControllers.getAllStudents,
);
studentRouter.get(
  "/:id",
  auth(USER_ROLE.superAdmin, USER_ROLE.admin, USER_ROLE.faculty),
  StudentControllers.getStudentById,
);
studentRouter.patch(
  "/:id",
  auth(USER_ROLE.superAdmin, USER_ROLE.admin),
  validateRequest(StudentValidations.UpdateStudentValidationSchema),
  StudentControllers.updateStudent,
);
studentRouter.delete(
  "/:id",
  auth(USER_ROLE.superAdmin, USER_ROLE.admin),
  StudentControllers.deleteStudent,
);

export const StudentRoutes = studentRouter;
