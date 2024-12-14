import express from "express";
import { FacultyControllers } from "./faculty.controller";
import validateRequest from "../../middlewares/validateRequest";
import { FacultyValidations } from "./faculty.validation";

const facultyRouter = express.Router();

facultyRouter.get("/", FacultyControllers.getAllFaculties);
facultyRouter.get("/:id", FacultyControllers.getFacultyById);
facultyRouter.patch(
  "/:id",
  validateRequest(FacultyValidations.UpdateFacultyValidationSchema),
  FacultyControllers.updateFaculty,
);

export const FacultyRoutes = facultyRouter;
