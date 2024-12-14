import cors from "cors";
import express, { Application, Request, Response } from "express";
import globalErrorHandler from "./app/middlewares/globalErrorHandler";
import notFound from "./app/middlewares/notFound";
import router from "./app/routes";
const app: Application = express();

// parsers
app.use(express.json());
app.use(cors());

// application routes
app.use("/api/v1", router);

app.get("/", async (req: Request, res: Response) => {
  res.send("Welcome to University Management TS!");
});

// global error handler
app.use(globalErrorHandler);
// not found route handler
app.use(notFound);

export default app;
