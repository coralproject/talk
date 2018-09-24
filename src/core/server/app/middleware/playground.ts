import { RequestHandler } from "express";
import { MiddlewareOptions } from "graphql-playground-html";
import playground from "graphql-playground-middleware-express";

export default (options: MiddlewareOptions): RequestHandler => (
  req,
  res,
  next
) => {
  try {
    playground(options)(req, res, () => {
      // The playground calls next() when it's not supposed to.
    });
  } catch (err) {
    return next(err);
  }
};
