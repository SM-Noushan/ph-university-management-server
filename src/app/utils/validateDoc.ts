import status from "http-status";
import { Model } from "mongoose";
import AppError from "../errors/AppError";

interface ValidateDocOptions<T> {
  model: Model<T>;
  query: object;
  errMsg?: string;
  trueValidate?: boolean;
}

/**
 * Validates the existence of a document in the database.
 *
 * @param {ValidateDocOptions<T>} options - Validation options.
 * @throws {AppError} Throws an error if the validation fails.
 */

const validateDoc = async <T>({
  model,
  query,
  errMsg = "",
  trueValidate = true,
}: ValidateDocOptions<T>): Promise<void> => {
  const exists = await model.exists(query);

  if (trueValidate && !exists)
    throw new AppError(
      status.NOT_FOUND,
      errMsg || "Ref/Document does not exist.",
    );

  if (!trueValidate && exists)
    throw new AppError(
      status.CONFLICT,
      errMsg || "Ref/Document already exists.",
    );
};

export default validateDoc;
