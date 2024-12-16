import express from "express";
import validateRequest from "../../middlewares/validateRequest";
import { SemesterRegistrationValidations } from "./semesterRegistration.validation";
import { SemesterRegistrationControllers } from "./semesterRegistration.controller";

const semesterRegistrationRouter = express.Router();

semesterRegistrationRouter.get(
  "/",
  SemesterRegistrationControllers.getAllSemesterRegistration,
);
semesterRegistrationRouter.get(
  "/:id",
  SemesterRegistrationControllers.getSemesterRegistrationById,
);
semesterRegistrationRouter.post(
  "/create-semester-registration",
  validateRequest(
    SemesterRegistrationValidations.CreateSemesterRegistrationValidationSchema,
  ),
  SemesterRegistrationControllers.createSemesterRegistration,
);
semesterRegistrationRouter.patch(
  "/:id",
  validateRequest(
    SemesterRegistrationValidations.UpdateSemesterRegistrationValidationSchema,
  ),
  SemesterRegistrationControllers.updateSemesterRegistration,
);
semesterRegistrationRouter.delete(
  "/:id",
  SemesterRegistrationControllers.deleteSemesterRegistration,
);

export const SemesterRegistrationRoutes = semesterRegistrationRouter;
