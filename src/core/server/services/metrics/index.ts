import { Counter, Histogram } from "prom-client";

export interface Metrics {
  executedGraphQueriesTotalCounter: Counter;
  graphQLExecutionTimingsHistogram: Histogram;
  httpRequestsTotal: Counter;
  httpRequestDurationMilliseconds: Histogram;
}

export function createMetrics(): Metrics {
  // Configure the metrics handlers.
  const executedGraphQueriesTotalCounter = new Counter({
    name: "coral_executed_graph_queries_total",
    help: "number of GraphQL queries executed",
    labelNames: ["operation_type", "operation_name"],
  });

  const graphQLExecutionTimingsHistogram = new Histogram({
    name: "coral_executed_graph_queries_timings",
    help: "timings for execution times of GraphQL operations",
    buckets: [0.1, 5, 15, 50, 100, 500],
    labelNames: ["operation_type", "operation_name"],
  });

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

  return {
    executedGraphQueriesTotalCounter,
    graphQLExecutionTimingsHistogram,
    httpRequestsTotal,
    httpRequestDurationMilliseconds,
  };
}
