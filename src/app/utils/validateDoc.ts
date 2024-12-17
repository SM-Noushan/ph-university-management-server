/* eslint-disable no-unused-vars */
import status from "http-status";
import { Model } from "mongoose";
import AppError from "../errors/AppError";

interface ValidateDocOptionsBase<T> {
  model: Model<T>;
  query: Record<string, unknown>;
  errMsg?: string;
  trueValidate?: boolean;
}

// Overloads
function validateDoc<T>(
  options: ValidateDocOptionsBase<T> & { trueValidate?: true },
): Promise<T>;
function validateDoc<T>(
  options: ValidateDocOptionsBase<T> & { trueValidate: false },
): Promise<null>;

/**
 * Validates the existence (or non-existence) of a document in the database.
 *
 * @template T - Type of the document.
 * @param {ValidateDocOptionsBase<T>} options - Validation options.
 * @returns {Promise<T | null>} - Returns the document if found or null.
 * @throws {AppError} - Throws an error if validation fails.
 */

async function validateDoc<T>({
  model,
  query,
  errMsg = "",
  trueValidate = true,
}: ValidateDocOptionsBase<T>): Promise<T | null> {
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

  return doc as T | null;
}

export default validateDoc;
