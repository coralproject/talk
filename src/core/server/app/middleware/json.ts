import bodyParser from "body-parser";

/**
 * jsonMiddleware is middleware that will parse the incoming JSON payloads.
 *
 * @param limit the amount of bytes to allow for POST requests
 */
export const jsonMiddleware = (limit: number) => bodyParser.json({ limit });
