import status from "http-status";
import { Model } from "mongoose";
import AppError from "../errors/AppError";

interface ValidateDocOptions<T> {
  model: Model<T>;
  query: Record<string, unknown>;
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
}: ValidateDocOptions<T>): Promise<T | null> => {
  const doc = await model.findOne(query);

  if (trueValidate && !doc)
    throw new AppError(
      status.NOT_FOUND,
      errMsg || "Ref/Document does not exist.",
    );

  if (!trueValidate && doc)
    throw new AppError(
      status.CONFLICT,
      errMsg || "Ref/Document already exists.",
    );
  return doc;
};

export default validateDoc;
