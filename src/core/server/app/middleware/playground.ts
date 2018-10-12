import { RequestHandler } from "express";

import {
  MiddlewareOptions,
  RenderPageOptions,
  renderPlaygroundPage,
} from "graphql-playground-html";

export default (options: MiddlewareOptions): RequestHandler => {
  const middlewareOptions: RenderPageOptions = {
    ...options,
    version: "1.6.0",
  };

  return (req, res, next) => {
    try {
      res.setHeader("Content-Type", "text/html");
      const playground = renderPlaygroundPage(middlewareOptions);
      res.write(playground);
      res.end();
    } catch (err) {
      return next(err);
    }
  };
};
