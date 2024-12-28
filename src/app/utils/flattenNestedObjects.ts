// eslint-disable-next-line @typescript-eslint/no-explicit-any
type TFlattenNestedObjects = Record<string, any>;
import { Types } from "mongoose";

const flattenNestedObjects = (
  payload: TFlattenNestedObjects,
  parentKey: string = "",
) => {
  const modifiedPayload: TFlattenNestedObjects = {};

  for (const [key, value] of Object.entries(payload)) {
    const newKey = parentKey ? `${parentKey}.${key}` : key;
    if (
      typeof value === "object" &&
      value !== null &&
      !Array.isArray(value) &&
      !(value instanceof Types.ObjectId)
    )
      Object.assign(modifiedPayload, flattenNestedObjects(value, newKey));
    else modifiedPayload[newKey] = value;
  }
  return modifiedPayload;
};

export default flattenNestedObjects;
