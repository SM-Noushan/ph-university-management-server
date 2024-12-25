import express from "express";
import auth from "../../middlewares/auth";
import { USER_ROLE } from "./user.constant";
import { userControllers } from "./user.controller";
import { UserValidations } from "./user.validation";
import { AdminValidations } from "../admin/admin.validation";
import validateRequest from "../../middlewares/validateRequest";
import { StudentValidations } from "../student/student.validation";
import { FacultyValidations } from "../faculty/faculty.validation";
import { upload } from "../../utils/sendImageToCloudinary";

const router = express.Router();

router.post(
  "/create-student",
  auth(USER_ROLE.admin),
  upload.single("file"),
  (req, res, next) => {
    req.body = JSON.parse(req.body.data);
    next();
  },
  validateRequest(StudentValidations.CreateStudentValidationSchema),
  userControllers.createStudent,
);
router.post(
  "/create-faculty",
  auth(USER_ROLE.admin),
  validateRequest(FacultyValidations.CreateFacultyValidationSchema),
  userControllers.createFaculty,
);
router.post(
  "/create-admin",
  auth(USER_ROLE.admin),
  validateRequest(AdminValidations.CreateAdminValidationSchema),
  userControllers.createAdmin,
);
router.get(
  "/me",
  auth(USER_ROLE.admin, USER_ROLE.faculty, USER_ROLE.student),
  userControllers.getMe,
);
router.patch(
  "/change-status/:id",
  auth(USER_ROLE.admin),
  validateRequest(UserValidations.ChangeStatusValidationSchema),
  userControllers.changeStatus,
);

export const UserRoutes = router;
