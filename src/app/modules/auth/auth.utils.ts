import jwt from "jsonwebtoken";
import { TUser } from "../user/user.interface";

const createToken = (
  jwtPayload: Pick<TUser, "id" | "role">,
  secret: string,
  expiresIn: string,
): string =>
  jwt.sign(
    {
      userId: jwtPayload.id,
      role: jwtPayload.role,
    },
    secret,
    {
      expiresIn,
    },
  );

export default createToken;
