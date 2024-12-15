import express from "express";
import { CourseControllers } from "./course.controller";
import { CourseValidations } from "./course.validation";
import validateRequest from "../../middlewares/validateRequest";

const courseRouter = express.Router();

courseRouter.get("/", CourseControllers.getAllCourses);
courseRouter.get("/:id", CourseControllers.getCourseById);
courseRouter.post(
  "/create-course",
  validateRequest(CourseValidations.CreateCourseValidationSchema),
  CourseControllers.createCourse,
);
courseRouter.patch(
  "/:id",
  validateRequest(CourseValidations.UpdateCourseValidationSchema),
  CourseControllers.updateCourse,
);
courseRouter.delete("/:id", CourseControllers.deleteCourse);
courseRouter.put(
  "/assign-faculties/:courseId",
  validateRequest(CourseValidations.AssignFacultiesToCourseValidationSchema),
  CourseControllers.assignCourseFaculties,
);
courseRouter.delete(
  "/remove-faculties/:courseId",
  validateRequest(CourseValidations.AssignFacultiesToCourseValidationSchema),
  CourseControllers.deleteCourseFaculties,
);

export const CourseRoutes = courseRouter;
