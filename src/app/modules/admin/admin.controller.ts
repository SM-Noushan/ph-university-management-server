import status from "http-status";
import catchAsync from "../../utils/catchAsync";
import { AdminServices } from "./admin.service";
import sendResponse from "../../utils/sendResponse";

const getAllAdmins = catchAsync(async (req, res) => {
  const result = await AdminServices.getAllAdminsFromDB(req?.query);
  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: "Admins retrieved successfully",
    meta: result.meta,
    data: result.result,
  });
});

const getAdminById = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await AdminServices.getAdminByIdFromDB(id);
  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: "Admin retrieved successfully",
    data: result,
  });
});

const updateAdmin = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await AdminServices.updateAdminIntoDB(id, req.body.admin);
  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: "Admin updated successfully",
    data: result,
  });
});

const deleteAdmin = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await AdminServices.deleteAdminFromDB(id);
  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: "Admin deleted successfully",
    data: result,
  });
});

export const AdminControllers = {
  getAllAdmins,
  getAdminById,
  updateAdmin,
  deleteAdmin,
};
