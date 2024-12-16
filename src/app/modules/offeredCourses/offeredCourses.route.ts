import express from "express";
import validateRequest from "../../middlewares/validateRequest";
import { OfferedCourseValidations } from "./offeredCourses.validation";
import { OfferedCourseControllers } from "./offeredCourses.controller";

const offeredCourseRouter = express.Router();

offeredCourseRouter.post(
  "/create-offered-course",
  validateRequest(OfferedCourseValidations.CreateOfferedCourseValidationSchema),
  OfferedCourseControllers.createOfferedCourse,
);
offeredCourseRouter.patch(
  "/:id",
  validateRequest(OfferedCourseValidations.UpdateOfferedCourseValidationSchema),
  OfferedCourseControllers.updateOfferedCourse,
);
offeredCourseRouter.delete(
  "/:id",
  OfferedCourseControllers.deleteOfferedCourse,
);

export const OfferedCourseRoutes = offeredCourseRouter;
