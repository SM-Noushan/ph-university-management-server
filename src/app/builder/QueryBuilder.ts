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
      caseInsensitiveFilter[key] = {
        $regex: `^${value}$`,
        $options: "i",
      };
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
