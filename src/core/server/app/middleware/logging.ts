import { ErrorRequestHandler, RequestHandler } from "express";
import onFinished from "on-finished";
import now from "performance-now";

import logger from "talk-server/logger";

export const accessLogger: RequestHandler = (req, res, next) => {
  const startTime = now();

  onFinished(res, () => {
    // Compute the end time.
    const responseTime = Math.round(now() - startTime);

    // Get some extra goodies from the request.
    const userAgent = req.get("User-Agent");

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
  });

  next();
};

export const errorLogger: ErrorRequestHandler = (err, req, res, next) => {
  logger.error({ err }, "http error");

  next(err);
};
