import express from "express";
import auth from "../../middlewares/auth";
import { USER_ROLE } from "../user/user.constant";
import { CourseControllers } from "./course.controller";
import { CourseValidations } from "./course.validation";
import validateRequest from "../../middlewares/validateRequest";

const courseRouter = express.Router();

courseRouter.get("/", CourseControllers.getAllCourses);
courseRouter.get("/:id", CourseControllers.getCourseById);
courseRouter.post(
  "/create-course",
  auth(USER_ROLE.superAdmin, USER_ROLE.admin),
  validateRequest(CourseValidations.CreateCourseValidationSchema),
  CourseControllers.createCourse,
);
courseRouter.patch(
  "/:id",
  auth(USER_ROLE.superAdmin, USER_ROLE.admin),
  validateRequest(CourseValidations.UpdateCourseValidationSchema),
  CourseControllers.updateCourse,
);
courseRouter.delete(
  "/:id",
  auth(USER_ROLE.superAdmin, USER_ROLE.admin),
  CourseControllers.deleteCourse,
);
courseRouter.put(
  "/assign-faculties/:courseId",
  auth(USER_ROLE.superAdmin, USER_ROLE.admin),
  validateRequest(CourseValidations.AssignFacultiesToCourseValidationSchema),
  CourseControllers.assignCourseFaculties,
);
courseRouter.delete(
  "/remove-faculties/:courseId",
  auth(USER_ROLE.superAdmin, USER_ROLE.admin),
  validateRequest(CourseValidations.AssignFacultiesToCourseValidationSchema),
  CourseControllers.deleteCourseFaculties,
);

export const CourseRoutes = courseRouter;
