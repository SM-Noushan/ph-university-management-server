import express from "express";
import validateRequest from "../../middlewares/validateRequest";
import { SemesterRegistrationValidations } from "./semesterRegistration.validation";
import { SemesterRegistrationControllers } from "./semesterRegistration.controller";

const semesterRegistrationRouter = express.Router();

semesterRegistrationRouter.get(
  "/",
  SemesterRegistrationControllers.getAllSemesterRegistration,
);
semesterRegistrationRouter.post(
  "/create-semester-registration",
  validateRequest(
    SemesterRegistrationValidations.CreateSemesterRegistrationValidationSchema,
  ),
  SemesterRegistrationControllers.createSemesterRegistration,
);

export const SemesterRegistrationRoutes = semesterRegistrationRouter;
