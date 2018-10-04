import { RequestHandler } from "express";
import { MiddlewareOptions } from "graphql-playground-html";
import playground from "graphql-playground-middleware-express";

export default (options: MiddlewareOptions): RequestHandler => (
  req,
  res,
  next
) =>
  playground(options)(req, res, (err?: Error) => {
    if (err) {
      return next(err);
    }
  });
