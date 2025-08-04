import express, { Request, Response } from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import notFound from "./app/middlewares/notFound";
import { globalErrorHandler } from "./app/middlewares/globalErrorHandler";
import routes from "./app/routes/routes";

export const app = express();

//middleware
app.use(cookieParser());
app.use(express.json());
app.set("trust proxy", 1);
app.use(cors());

//routes
app.use("/api/v1", routes);

app.get("/", (req: Request, res: Response) => {
  res.send({
    success: true,
    message: "Welcome to the Digital Wallet Server",
  });
});

app.use(globalErrorHandler);
app.use(notFound);
