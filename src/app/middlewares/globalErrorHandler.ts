// import { NextFunction, Request, Response } from "express";

import { NextFunction, Request, Response } from "express";
import AppError from "../errorHelpers/AppError";
import config from "../config";

interface IErrorSources {
  message: string;
  path: string;
}

export const globalErrorHandler = (
  error: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const errorSources: IErrorSources[] = [];
  let statusCode = 500;
  let message = "Something Went Wrong!!";

  //duplicate error
  if (error.code === 11000) {
    const matchArray = error.message.match(/"([^"]*)"/);
    statusCode = 400;
    message = `${matchArray[1]} already exists!!`;
  }
  // cast error
  else if (error.name === "CastError") {
    statusCode = 400;
    message = "Invalid MongoDB ObjectId. Please provide a valid id";
  }
  //mongoose validation error
  else if (error.name === "ValidationError") {
    statusCode = 400;
    const errors = Object.values(error.errors);
    errors.forEach((errorObject: any) =>
      errorSources.push({
        path: errorObject.path,
        message: errorObject.message,
      })
    );
    message = "Validation Error";
  }
  // zod validation error
  else if (error.name === "ZodError") {
    statusCode = 400;
    error.issues.forEach((issue: any) =>
      errorSources.push({
        path: issue.path[issue.path.length - 1],
        message: issue.message,
      })
    );
    message = "Zod Error";
  } else if (error instanceof AppError) {
    statusCode = error.statusCode;
    message = error.message;
  } else if (error instanceof Error) {
    statusCode = 500;
    message = error.message;
  }
  res.status(statusCode).json({
    success: false,
    message,
    errorSources,
    error: config.NODE_ENV === "development" ? error : null,
    stack: config.NODE_ENV === "development" ? error.stack : null,
  });
};
