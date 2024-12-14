import express from "express";
import { FacultyControllers } from "./faculty.controller";

const facultyRouter = express.Router();

facultyRouter.get("/", FacultyControllers.getAllFaculties);

export const FacultyRoutes = facultyRouter;
