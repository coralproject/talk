import { RequestHandler } from "express";

import { NotFoundError } from "coral-server/errors";

export const notFoundMiddleware: RequestHandler = (req, res, next) => {
  next(new NotFoundError(req.method, req.originalUrl));
};
