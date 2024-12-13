import express from "express";
import { StudentControllers } from "./student.controller";
import validateRequest from "../../middlewares/validateRequest";
import { StudentValidations } from "./student.validation";

const studentRouter = express.Router();

studentRouter.get("/", StudentControllers.getAllStudents);
studentRouter.get("/:id", StudentControllers.getStudentById);
studentRouter.patch(
  "/:id",
  validateRequest(StudentValidations.UpdateStudentValidationSchema),
  StudentControllers.updateStudent,
);
studentRouter.delete("/:id", StudentControllers.deleteStudent);

export const StudentRoutes = studentRouter;
