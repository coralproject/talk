import { RequestHandler } from "express";

import { HTTPNotFoundErr } from "talk-server/errors";

export const notFoundMiddleware: RequestHandler = (req, res, next) => {
  next(new HTTPNotFoundErr());
};
