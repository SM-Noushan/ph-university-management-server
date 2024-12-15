import {
  TCourse,
  TCourseFaculty,
  TPreRequisiteCourses,
} from "./course.interface";
import { Schema, model } from "mongoose";

const preRequisiteCourseSchema = new Schema<TPreRequisiteCourses>({
  course: {
    type: Schema.Types.ObjectId,
    ref: "Course",
    required: [true, "Course is required"],
  },
  isDeleted: {
    type: Boolean,
    default: false,
  },
});

const courseSchema = new Schema<TCourse>(
  {
    title: {
      type: String,
      unique: true,
      required: [true, "Title is required"],
    },
    prefix: {
      type: String,
      required: [true, "Prefix is required"],
    },
    code: {
      type: Number,
      required: [true, "Code is required"],
    },
    credits: {
      type: Number,
      required: [true, "Credits is required"],
    },
    preRequisiteCourses: {
      type: [preRequisiteCourseSchema],
      default: [],
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  },
);

export async function validatePreRequisiteCourses(
  preRequisiteCourses: TPreRequisiteCourses[] = [],
): Promise<void> {
  if (preRequisiteCourses.length > 0) {
    // Remove duplicate entries based on the `course` field
    const uniqueCourses = Array.from(
      new Map(
        preRequisiteCourses.map(prereq => [prereq.course.toString(), prereq]),
      ).values(),
    );

    // Extract unique course IDs
    const courseIds = uniqueCourses.map(prereq => prereq.course);

    // Validate if all referenced courses exist
    const count = await Course.countDocuments({
      _id: { $in: courseIds },
      isDeleted: { $ne: true },
    });

    if (count !== courseIds.length) {
      throw new Error(
        "One or more prerequisite courses are invalid or do not exist.",
      );
    }
  }
}

// Pre-hook for saving
courseSchema.pre("save", async function (next) {
  try {
    await validatePreRequisiteCourses(this.preRequisiteCourses || []);
    next();
  } catch (error) {
    next(error as Error);
  }
});

courseSchema.pre(["find", "findOne"], function (next) {
  this.find({ isDeleted: { $ne: true } });
  next();
});

courseSchema.pre("aggregate", function (next) {
  this.pipeline().unshift({ $match: { isDeleted: { $ne: true } } });
  next();
});

export const Course = model<TCourse>("Course", courseSchema);

const courseFacultySchema = new Schema<TCourseFaculty>(
  {
    course: {
      type: Schema.Types.ObjectId,
      ref: "Course",
      unique: true,
      required: [true, "Course is required"],
    },
    faculties: [
      {
        type: Schema.Types.ObjectId,
        ref: "Faculty",
        required: [true, "Faculty is required"],
      },
    ],
  },
  {
    timestamps: true,
  },
);

export const CourseFaculty = model<TCourseFaculty>(
  "CourseFaculty",
  courseFacultySchema,
);
