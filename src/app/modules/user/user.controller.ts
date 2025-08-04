import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import httpStatus from "http-status-codes";
import { UserServices } from "./user.service";
import AppError from "../../errorHelpers/AppError";

const createUser = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const user = await UserServices.createUser(req.body);
    sendResponse(res, {
      statusCode: httpStatus.CREATED,
      success: true,
      message: "User Register Successfully",
      data: user,
    });
  }
);

const getAllUserOrAgent = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const role = req.query.role as string;
    if (!role) {
      throw new AppError(400, "Role query parameter is required");
    }
    const users = await UserServices.getAllUserOrAgent(role.toUpperCase());
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: `${role} Retrieve Successfully`,
      data: users,
    });
  }
);

//Approve Agent
const approveAgent = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const createAgent = await UserServices.approveAgent(id);
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "User has been promoted to AGENT",
      data: createAgent,
    });
  }
);

//suspend Agent
const suspendAgent = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const suspendAgent = await UserServices.suspendAgent(id);
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "AGENT suspend Successfully",
      data: suspendAgent,
    });
  }
);

export const UserControllers = {
  createUser,
  approveAgent,
  suspendAgent,
  getAllUserOrAgent,
};
