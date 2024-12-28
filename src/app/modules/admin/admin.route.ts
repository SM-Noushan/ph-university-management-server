import express from "express";
import auth from "../../middlewares/auth";
import { USER_ROLE } from "../user/user.constant";
import { AdminControllers } from "./admin.controller";
import { AdminValidations } from "./admin.validation";
import validateRequest from "../../middlewares/validateRequest";

const adminRouter = express.Router();

adminRouter.get(
  "/",
  auth(USER_ROLE.superAdmin, USER_ROLE.admin),
  AdminControllers.getAllAdmins,
);
adminRouter.get(
  "/:id",
  auth(USER_ROLE.superAdmin, USER_ROLE.admin),
  AdminControllers.getAdminById,
);
adminRouter.patch(
  "/:id",
  auth(USER_ROLE.superAdmin),
  validateRequest(AdminValidations.UpdateAdminValidationSchema),
  AdminControllers.updateAdmin,
);
adminRouter.delete(
  "/:id",
  auth(USER_ROLE.superAdmin),
  AdminControllers.deleteAdmin,
);

export const AdminRoutes = adminRouter;
