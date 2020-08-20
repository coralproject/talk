import { ApolloServerPlugin } from "apollo-server-plugin-base";

import { createTimer } from "coral-server/helpers";
import { Metrics } from "coral-server/services/metrics";

import { getOperationMetadata } from "./helpers";

export const MetricsApolloServerPlugin = (
  metrics: Metrics
): ApolloServerPlugin => ({
  requestDidStart() {
    return {
      executionDidStart({ document }) {
        // Grab the start time so we can calculate the time it takes to execute
        // the graph query.
        const timer = createTimer();

        return function executionDidEnd() {
          // Compute the end time.
          const responseTime = timer();

          // Get the request metadata.
          const { operation, operationName } = getOperationMetadata(document);
          if (operation && operationName) {
            // Increment the graph query value, tagging with the name of the query.
            metrics.executedGraphQueriesTotalCounter
              .labels(operation, operationName)
              .inc();

            metrics.graphQLExecutionTimingsHistogram
              .labels(operation, operationName)
              .observe(responseTime);
          }
        };
      },
    };
  },
});

export default MetricsApolloServerPlugin;
