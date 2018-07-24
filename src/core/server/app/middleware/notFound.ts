import { RequestHandler } from "express";

export const notFoundMiddleware: RequestHandler = (req, res, next) => {
  // FIXME: (wyattjoh) send an error that won't log as crazily as this one does.
  next(new Error("not found"));
};
