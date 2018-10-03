import { RequestHandler, Response } from "express";

import logger from "talk-server/logger";
import { Request } from "talk-server/types/express";

function wrapResponse(req: Request, res: Response) {
  // If the request is not an array, or has no elements, we should skip it.
  if (!Array.isArray(req.body) || req.body.length === 0) {
    return res;
  }

  // If the request is an array, but it does not have an ID field, then we
  // should skip it.
  const needsUpgrade = Boolean(typeof req.body[0].id !== "undefined");
  if (!needsUpgrade) {
    return res;
  }

  // Grab all the existing ID's.
  const ids: string[] = req.body.map(({ id }) => id);

  // Save a reference to the old setHeader function.
  const setHeader = res.setHeader.bind(res);

  // Capture all the headers that are sent to this, in case we need to use it.
  const setHeaders: Record<string, any> = {};
  res.setHeader = (name: string, value: any) => {
    setHeaders[name] = value;
    return res;
  };

  // Save a reference to the old write function.
  const write = res.write.bind(res);

  // Create a flush function that will be used to flush the response to the
  // underlying response.
  const flush = (chunk: any, headers: Record<string, any> = setHeaders) => {
    for (const name in headers) {
      if (!headers.hasOwnProperty(name)) {
        continue;
      }

      setHeader(name, headers[name]);
    }

    return write(chunk);
  };

  // Override the response writer to parse the response to determine if it needs
  // to be rewritten.
  res.write = (chunk: string) => {
    try {
      // If there is no response, forward it, or if we peek at the first
      // character and it's not an array opening, then skip it.
      if (chunk.length <= 0 || chunk[0] !== "[") {
        return flush(chunk);
      }

      // Parse the responses, if it's not an array, then skip it.
      const responses: object[] | any = JSON.parse(chunk);
      if (!Array.isArray(responses) || responses.length === 0) {
        return flush(chunk);
      }

      // If the length of responses do not equal the length of id's collected,
      // then skip it.
      if (responses.length !== ids.length) {
        return flush(chunk);
      }

      // For each of the responses, zip up their id's into the objects, and
      // string concat them together to ensure we get the right request.
      const gqlResponse = responses.reduce((body: string, payload, idx) => {
        const id = ids[idx];
        body += JSON.stringify({ id, payload });
        if (responses.length - 1 > idx) {
          body += ",";
        }
        return body;
      }, "");

      const response = `[${gqlResponse}]`;

      return flush(response, {
        "Content-Type": "application/json",
        "Content-Length": Buffer.byteLength(response, "utf8").toString(),
      });
    } catch (err) {
      logger.error({ err }, "could not parse chunk as JSON");
      return flush(chunk);
    }
  };

  return res;
}

export const graphqlBatchMiddleware = (
  graphqlRequestHandler: RequestHandler
): RequestHandler => (req: Request, res, next) =>
  graphqlRequestHandler(req, wrapResponse(req, res), next);
