import express from "express";
import auth from "../../middlewares/auth";
import { USER_ROLE } from "../user/user.constant";
import validateRequest from "../../middlewares/validateRequest";
import { AcademicFacultyControllers } from "./academicFaculty.controller";
import AcademicFacultyValidationSchema from "./academicFaculty.validation";

const router = express.Router();

router.get("/", AcademicFacultyControllers.getAllAcademicFaculties);
router.get("/:id", AcademicFacultyControllers.getAcademicFacultyById);
router.post(
  "/create-academic-faculty",
  auth(USER_ROLE.superAdmin, USER_ROLE.admin),
  validateRequest(AcademicFacultyValidationSchema),
  AcademicFacultyControllers.createAcademicFaculty,
);
router.patch(
  "/:id",
  auth(USER_ROLE.superAdmin, USER_ROLE.admin),
  validateRequest(AcademicFacultyValidationSchema),
  AcademicFacultyControllers.updateAcademicFaculty,
);

export const AcademicFacultyRoutes = router;
