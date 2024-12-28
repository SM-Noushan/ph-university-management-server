/* eslint-disable no-console */
import app from "./app";
import { Server } from "http";
import mongoose from "mongoose";
import config from "./app/config";
import seedSuperAdmin from "./app/db";

let server: Server;

async function main() {
  try {
    await mongoose.connect(config.dbUrl as string);
    seedSuperAdmin();
    server = app.listen(config.port, () => {
      console.log("Server is running on port:", config.port);
    });
  } catch (error) {
    console.log(error);
  }
}

main();

process.on("unhandledRejection", () => {
  if (server) server.close(() => process.exit(1));
  process.exit(1);
});

process.on("uncaughtException", () => {
  console.log("Uncaught Exception! Shutting down...");
  process.exit(1);
});
