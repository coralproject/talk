import { ErrorRequestHandler, RequestHandler } from "express";
import now from "performance-now";
import logger from "../../logger";

export const access: RequestHandler = (req, res, next) => {
  const startTime = now();
  const end = res.end;
  res.end = (chunk: any, encodingOrCb?: any, cb?: any) => {
    // Compute the end time.
    const responseTime = Math.round(now() - startTime);

    // Get some extra goodies from the request.
    const userAgent = req.get("User-Agent");

    // Reattach the old end, and finish.
    res.end = end;
    if (typeof encodingOrCb === "function") {
      res.end(chunk, encodingOrCb);
    } else {
      res.end(chunk, encodingOrCb, cb);
    }

    // Log this out.
    logger.info(
      {
        // traceID: req.id,
        url: req.originalUrl || req.url,
        method: req.method,
        statusCode: res.statusCode,
        userAgent,
        responseTime,
      },
      "http request"
    );
  };

  next();
};

export const error: ErrorRequestHandler = (err, req, res, next) => {
  logger.error({ err }, "http error");
  next(err);
};
