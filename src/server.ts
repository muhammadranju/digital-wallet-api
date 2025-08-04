import { Server } from "http";
import config from "./app/config";
import mongoose from "mongoose";
import { app } from "./app";
import { seedAdmin } from "./app/utils/seedAdmin";

let server: Server;

const A5Server = async () => {
  try {
    if (!config.DATABASE_URL) {
      throw new Error("Database URL is missing in environment variables.");
    }
    await mongoose.connect(config.DATABASE_URL);
    console.log("Database connected successfully");
    server = app.listen(config.PORT, () => {
      console.log(`Server is running on http://localhost:${config.PORT}`);
    });
  } catch (error) {
    console.error("Database connection error:", error);
    process.exit(1);
  }
};
(async () => {
  await A5Server();
  await seedAdmin();
})();

//Server error handle
process.on("unhandledRejection", (err) => {
  console.log("unHandle rejection detected... Server shutting down... ", err);
  if (server) {
    server.close(() => {
      process.exit(1);
    });
  }
  process.exit(1);
});

process.on("uncaughtException", (err) => {
  console.log("un caught exception detected... Server shutting down... ", err);
  if (server) {
    server.close(() => {
      process.exit(1);
    });
  }
  process.exit(1);
});

process.on("SIGTERM", () => {
  if (server) {
    server.close(() => {
      process.exit(1);
    });
  }
  process.exit(1);
});
