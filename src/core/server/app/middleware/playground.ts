import { MiddlewareOptions } from "graphql-playground-html";
import playground from "graphql-playground-middleware-express";

export default (options: MiddlewareOptions) => playground(options);
