import { RequestHandler } from "express";
import onFinished from "on-finished";
import now from "performance-now";
import { Counter, Histogram } from "prom-client";

export const metricsRecorder = (): RequestHandler => {
  const httpRequestsTotal = new Counter({
    name: "http_requests_total",
    help: "Total number of HTTP requests made.",
    labelNames: ["code", "method"],
  });

  const httpRequestDurationMilliseconds = new Histogram({
    name: "http_request_duration_milliseconds",
    help: "Histogram of latencies for HTTP requests.",
    buckets: [0.1, 5, 15, 50, 100, 500],
    labelNames: ["method", "handler"],
  });

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
