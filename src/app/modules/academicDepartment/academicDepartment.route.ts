import express from "express";
import validateRequest from "../../middlewares/validateRequest";
import { AcademicDepartmentValidations } from "./academicDepartment.validation";
import { AcademicDepartmentControllers } from "./academicDepartment.controller";

const router = express.Router();

router.get("/", AcademicDepartmentControllers.getAllAcademicDepartments);
router.get("/:id", AcademicDepartmentControllers.getAcademicDepartmentById);
router.post(
  "/create-academic-department",
  validateRequest(
    AcademicDepartmentValidations.CreateAcademicDepartmentValidationSchema,
  ),
  AcademicDepartmentControllers.createAcademicDepartment,
);
router.patch(
  "/:id",
  validateRequest(
    AcademicDepartmentValidations.UpdateAcademicDepartmentValidationSchema,
  ),
  AcademicDepartmentControllers.updateAcademicDepartment,
);

export const AcademicDepartmentRoutes = router;
