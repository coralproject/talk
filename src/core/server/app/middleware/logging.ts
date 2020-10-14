import { Request, Response } from "express";
import onFinished from "on-finished";

import { createTimer } from "coral-server/helpers";
import logger from "coral-server/logger";
import { RequestHandler } from "coral-server/types/express";

export const extractLoggerMetadata = (req: Request, res: Response) => ({
  url: req.originalUrl || req.url,
  method: req.method,
  statusCode: res.statusCode,
  host: req.hostname,
  userAgent: req.get("User-Agent"),
  ip: req.ip,
});

export const accessLogger: RequestHandler = (req, res, next) => {
  const timer = createTimer();
  onFinished(res, () => {
    // Compute the end time.
    const responseTime = timer();

    // Grab the logger.
    const log = req.coral ? req.coral.logger : logger;

    // Log this out.
    log.debug(
      { ...extractLoggerMetadata(req, res), responseTime },
      "http request"
    );
  });

  next();
};
