import express from "express";
import { FacultyControllers } from "./faculty.controller";

const facultyRouter = express.Router();

facultyRouter.get("/", FacultyControllers.getAllFaculties);
facultyRouter.get("/:id", FacultyControllers.getFacultyById);

export const FacultyRoutes = facultyRouter;
