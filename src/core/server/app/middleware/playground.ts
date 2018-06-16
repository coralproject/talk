import { Request, RequestHandler } from 'express';
import { MiddlewareOptions } from 'graphql-playground-html';
import playground from 'graphql-playground-middleware-express';

export type PlaygroundFn = (req: Request) => MiddlewareOptions;

export default (fn: PlaygroundFn): RequestHandler => (req, res, next) => {
    // Generate the options.
    const options: MiddlewareOptions = fn(req);

    // Create the playground handler.
    const handler = playground(options);

    // Execute it.
    handler(req, res, next);
};
