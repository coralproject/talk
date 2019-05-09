import { ExecutionArgs } from "graphql";
import { EndHandler, GraphQLExtension } from "graphql-extensions";
import now from "performance-now";
import { Counter, Histogram } from "prom-client";

import CommonContext from "talk-server/graph/common/context";
import { getOperationMetadata } from "./helpers";

export interface MetricsExtensionOptions {
  executedGraphQueriesTotalCounter: Counter;
  graphQLExecutionTimingsHistogram: Histogram;
}

export class MetricsExtension implements GraphQLExtension<CommonContext> {
  private options: MetricsExtensionOptions;

  constructor(options: MetricsExtensionOptions) {
    this.options = options;
  }

  public executionDidStart(o: {
    executionArgs: ExecutionArgs;
  }): EndHandler | void {
    // Only try to log things if the context is provided.
    if (o.executionArgs.contextValue) {
      // Grab the start time so we can calculate the time it takes to execute
      // the graph query.
      const startTime = now();
      return () => {
        // Compute the end time.
        const responseTime = Math.round(now() - startTime);

        // Get the request metadata.
        const { operation, operationName } = getOperationMetadata(
          o.executionArgs.document
        );

        if (operation && operationName) {
          // Increment the graph query value, tagging with the name of the query.
          this.options.executedGraphQueriesTotalCounter
            .labels(operation, operationName)
            .inc();

          this.options.graphQLExecutionTimingsHistogram
            .labels(operation, operationName)
            .observe(responseTime);
        }
      };
    }
  }
}
