import { NextFunction, Request, Response } from "express";
import { Model } from "mongoose";

export const queryBuilders =
  (model: Model<any>) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const query = { ...req.query };
      const filter = { ...query };
      const sort = query.sort || "-createdAt";
      const page = Number(query.page) || 1;
      const limit = Number(query.limit) || 10;
      const skip = (page - 1) * limit;

      const excludeField = ["sort", "page", "limit"];
      for (const field of excludeField) {
        delete filter[field];
      }
      const data = await model
        .find(filter)
        .sort(sort as string)
        .skip(skip)
        .limit(limit);

      const totalDocuments = await model.countDocuments();
      const totalPage = Math.ceil(totalDocuments / limit);
      const meta = {
        page: page,
        limit: limit,
        totalPage: totalPage,
        total: totalDocuments,
      };
      res.locals.data = {
        data,
        meta,
      };
      next();
    } catch (error) {
      next(error);
    }
  };
