import { ErrorRequestHandler } from "express";

export const apiErrorHandler: ErrorRequestHandler = (err, req, res, next) => {
  // TODO: handle better when we improve errors.
  res.status(500).json({ error: err.message });
};

export const errorHandler: ErrorRequestHandler = (err, req, res, next) => {
  // TODO: handle better when we improve errors.
  if (err.message === "not found") {
    // TODO: handle better when we improve errors.
    res
      .status(404)
      .send(err.message)
      .end();
  } else {
    // TODO: handle better when we improve errors.
    res
      .status(500)
      .send(err.message)
      .end();
  }
};
