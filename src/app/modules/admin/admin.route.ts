import express from "express";
import { AdminControllers } from "./admin.controller";
import { AdminValidations } from "./admin.validation";
import validateRequest from "../../middlewares/validateRequest";

const adminRouter = express.Router();

adminRouter.get("/", AdminControllers.getAllAdmins);
adminRouter.get("/:id", AdminControllers.getAdminById);
adminRouter.patch(
  "/:id",
  validateRequest(AdminValidations.UpdateAdminValidationSchema),
  AdminControllers.updateAdmin,
);
adminRouter.delete("/:id", AdminControllers.deleteAdmin);

export const AdminRoutes = adminRouter;
