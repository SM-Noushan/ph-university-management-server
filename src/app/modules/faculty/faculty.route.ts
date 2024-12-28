import express from "express";
import auth from "../../middlewares/auth";
import { USER_ROLE } from "../user/user.constant";
import { FacultyControllers } from "./faculty.controller";
import { FacultyValidations } from "./faculty.validation";
import validateRequest from "../../middlewares/validateRequest";

const facultyRouter = express.Router();

facultyRouter.get(
  "/",
  auth(USER_ROLE.superAdmin, USER_ROLE.admin),
  FacultyControllers.getAllFaculties,
);
facultyRouter.get(
  "/:id",
  auth(USER_ROLE.superAdmin, USER_ROLE.admin, USER_ROLE.faculty),
  FacultyControllers.getFacultyById,
);
facultyRouter.patch(
  "/:id",
  auth(USER_ROLE.superAdmin, USER_ROLE.admin),
  validateRequest(FacultyValidations.UpdateFacultyValidationSchema),
  FacultyControllers.updateFaculty,
);
facultyRouter.delete(
  "/:id",
  auth(USER_ROLE.superAdmin, USER_ROLE.admin),
  FacultyControllers.deleteFaculty,
);

export const FacultyRoutes = facultyRouter;
