import config from "../config";
import { User } from "../modules/user/user.model";
import { USER_ROLE } from "../modules/user/user.constant";

const SuperAdminUser = {
  id: "SA-001",
  password: config.superAdminPassword,
  email: "superAdmin@superAdmin.superAdmin",
  needsPasswordChange: false,
  role: USER_ROLE.superAdmin,
  status: "in-progress",
};

const seedSuperAdmin = async () => {
  // check if super admin exists
  const isSuperAdminExists = await User.findOne({ role: USER_ROLE.superAdmin });
  if (!isSuperAdminExists) {
    await User.create(SuperAdminUser);
  }
};

export default seedSuperAdmin;
