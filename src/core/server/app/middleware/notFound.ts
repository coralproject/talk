import { RequestHandler } from "express";

export const notFoundMiddleware: RequestHandler = (req, res, next) => {
  next(new Error("not found"));
};
