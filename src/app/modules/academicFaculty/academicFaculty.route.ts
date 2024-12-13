import express from "express";
import validateRequest from "../../middlewares/validateRequest";
import { AcademicFacultyControllers } from "./academicFaculty.controller";
import AcademicFacultyValidationSchema from "./academicFaculty.validation";

const router = express.Router();

router.get("/", AcademicFacultyControllers.getAllAcademicFaculties);
router.get("/:id", AcademicFacultyControllers.getAcademicFacultyById);
router.post(
  "/create-academic-faculty",
  validateRequest(AcademicFacultyValidationSchema),
  AcademicFacultyControllers.createAcademicFaculty,
);
router.patch(
  "/:id",
  validateRequest(AcademicFacultyValidationSchema),
  AcademicFacultyControllers.updateAcademicFaculty,
);

export const AcademicFacultyRoutes = router;
