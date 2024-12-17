import path from "path";
import dotenv from "dotenv";

dotenv.config({ path: path.join(process.cwd(), ".env") });

export default {
  NODE_ENV: process.env.NODE_ENV,
  port: process.env.PORT || 3000,
  dbUrl: process.env.DB_URL,
  bcryptSaltRounds: process.env.BCRYPT_SALT_ROUNDS,
  defaultPassword: process.env.DEFAULT_PASSWORD,
  JwtAccessSecret: process.env.JWT_ACCESS_SECRET,
  JwtRefreshSecret: process.env.JWT_REFRESH_SECRET,
  JwtAccessExpiration: process.env.JWT_ACCESS_EXPIRATION,
  JwtRefreshExpiration: process.env.JWT_REFRESH_EXPIRATION,
};
