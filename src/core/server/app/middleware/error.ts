import { ErrorRequestHandler } from "express";

export const apiErrorHandler: ErrorRequestHandler = (err, req, res, next) => {
  // TODO: handle better when we improve errors.
  res.status(500).json({ error: err.message });
};
