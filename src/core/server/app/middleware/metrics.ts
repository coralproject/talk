import onFinished from "on-finished";
import now from "performance-now";

import { Metrics } from "coral-server/services/metrics";
import { RequestHandler } from "coral-server/types/express";

export type MetricsRecorderOptions = Metrics;

export const metricsRecorder = ({
  httpRequestsTotal,
  httpRequestDurationMilliseconds,
}: Metrics): RequestHandler => {
  return (req, res, next) => {
    const startTime = now();

    onFinished(res, () => {
      // Compute the end time.
      const responseTime = Math.round(now() - startTime);

      // Increment the request counter.
      httpRequestsTotal.labels(`${res.statusCode}`, req.method).inc();

      // Add the request duration.
      httpRequestDurationMilliseconds
        .labels(req.method, req.baseUrl + req.path)
        .observe(responseTime);
    });

    next();
  };
};
