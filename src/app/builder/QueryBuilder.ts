import { Query } from "mongoose";

class QueryBuilder<T> {
  public modelQuery: Query<T[], T>;
  public query: Record<string, unknown>;

  constructor(modelQuery: Query<T[], T>, query: Record<string, unknown>) {
    this.modelQuery = modelQuery;
    this.query = query;
  }
  search(searchableFields: string[]) {
    const searchTerm: string = this.query.searchTerm as string;
    if (searchTerm) {
      this.modelQuery = this.modelQuery.find({
        $or: searchableFields.map((field: string) => ({
          [field]: { $regex: searchTerm, $options: "i" },
        })),
      });
    }
    return this;
  }

  filter() {
    const filterQueryObj = { ...this.query };
    const excludeFields = ["searchTerm", "sort", "limit", "page", "fields"];
    excludeFields.forEach(field => delete filterQueryObj[field]);
    const caseInsensitiveFilter: Record<string, unknown> = {};
    for (const [key, value] of Object.entries(filterQueryObj)) {
      // Skip empty strings
      if (typeof value === "string" && value.trim() === "") continue;

      // Numeric strings (like "123", "-45") are converted to numbers
      if (
        typeof value === "string" &&
        !Number.isNaN(Number(value)) &&
        value.trim() !== ""
      )
        caseInsensitiveFilter[key] = Number(value);
      // Direct numbers are added
      else if (typeof value === "number" && !Number.isNaN(value))
        caseInsensitiveFilter[key] = value;
      // Non-empty strings are handled with regex for case-insensitive match
      else if (typeof value === "string")
        caseInsensitiveFilter[key] = {
          $regex: `^${value}$`,
          $options: "i",
        };
      // Skip null, undefined, and other types
      else continue;
    }

    this.modelQuery = this.modelQuery.find(caseInsensitiveFilter);
    return this;
  }

  sort() {
    const sort: string =
      (this?.query?.sort as string)?.split(",")?.join(" ") || "-createdAt";
    this.modelQuery = this.modelQuery.sort(sort);
    return this;
  }

  paginate() {
    const page: number = parseInt(this.query?.page as string) || 1;
    const limit: number = parseInt(this.query?.limit as string) || 10;
    const skip: number = (page - 1) * limit;
    this.modelQuery = this.modelQuery.skip(skip).limit(limit);
    return this;
  }

  fields() {
    const fields =
      (this.query?.fields as string)?.split(",")?.join(" ") || "-__v";
    this.modelQuery = this.modelQuery.select(fields);
    return this;
  }
}

export default QueryBuilder;
