import onFinished from "on-finished";
import now from "performance-now";

import logger from "coral-server/logger";
import {
  ErrorRequestHandler,
  RequestHandler,
} from "coral-server/types/express";

export const accessLogger: RequestHandler = (req, res, next) => {
  const startTime = now();

  onFinished(res, () => {
    // Compute the end time.
    const responseTime = Math.round(now() - startTime);

    // Get some extra goodies from the request.
    const userAgent = req.get("User-Agent");

    // Grab the logger.
    const log = req.coral ? req.coral.logger : logger;

    // Log this out.
    log.debug(
      {
        url: req.originalUrl || req.url,
        method: req.method,
        statusCode: res.statusCode,
        host: req.hostname,
        userAgent,
        responseTime,
      },
      "http request"
    );
  });

  next();
};

export const errorLogger: ErrorRequestHandler = (err, req, res, next) => {
  // Grab the logger.
  const log = req.coral ? req.coral.logger : logger;

  // Log this out.
  log.error({ err }, "http error");

  next(err);
};
