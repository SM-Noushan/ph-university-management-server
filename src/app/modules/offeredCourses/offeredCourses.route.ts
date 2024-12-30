import express from "express";
import auth from "../../middlewares/auth";
import { USER_ROLE } from "../user/user.constant";
import validateRequest from "../../middlewares/validateRequest";
import { OfferedCourseValidations } from "./offeredCourses.validation";
import { OfferedCourseControllers } from "./offeredCourses.controller";

const offeredCourseRouter = express.Router();

offeredCourseRouter.get(
  "/",
  auth(USER_ROLE.superAdmin, USER_ROLE.admin, USER_ROLE.faculty),
  OfferedCourseControllers.getAllOfferedCourses,
);

offeredCourseRouter.get(
  "/my-offered-courses",
  auth(USER_ROLE.student),
  OfferedCourseControllers.getMyOfferedCourses,
);
offeredCourseRouter.get(
  "/:id",
  auth(
    USER_ROLE.superAdmin,
    USER_ROLE.admin,
    USER_ROLE.faculty,
    USER_ROLE.student,
  ),
  OfferedCourseControllers.getSingleOfferedCourseById,
);
offeredCourseRouter.post(
  "/create-offered-course",
  auth(USER_ROLE.superAdmin, USER_ROLE.admin),
  validateRequest(OfferedCourseValidations.CreateOfferedCourseValidationSchema),
  OfferedCourseControllers.createOfferedCourse,
);
offeredCourseRouter.patch(
  "/:id",
  auth(USER_ROLE.superAdmin, USER_ROLE.admin),
  validateRequest(OfferedCourseValidations.UpdateOfferedCourseValidationSchema),
  OfferedCourseControllers.updateOfferedCourse,
);
offeredCourseRouter.delete(
  "/:id",
  auth(USER_ROLE.superAdmin, USER_ROLE.admin),
  OfferedCourseControllers.deleteOfferedCourse,
);

export const OfferedCourseRoutes = offeredCourseRouter;
