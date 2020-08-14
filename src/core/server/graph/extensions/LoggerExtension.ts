import { DocumentNode, ExecutionArgs, GraphQLFormattedError } from "graphql";
import {
  EndHandler,
  GraphQLExtension,
  GraphQLResponse,
} from "graphql-extensions";

import GraphContext from "coral-server/graph/context";
import { createTimer } from "coral-server/helpers";
import logger from "coral-server/logger";
import { ErrorReporterScope } from "coral-server/services/errors";

import { getOperationMetadata, getPersistedQueryMetadata } from "./helpers";

export function logAndReportError(
  ctx: GraphContext,
  err: GraphQLFormattedError
) {
  ctx.logger.error({ err }, "graphql query error");

  // If there's no reporter active, then return now.
  if (!ctx.reporter) {
    return;
  }

  // Collect the error scope for the reporter.
  const scope: ErrorReporterScope = {
    ipAddress: ctx.req?.ip,
  };

  // Add Tenant details to the scope.
  scope.tenantID = ctx.tenant.id;
  scope.tenantDomain = ctx.tenant.domain;

  // Add User details if there is any to the request.
  if (ctx.user) {
    scope.userID = ctx.user.id;
    scope.userRole = ctx.user.role;
  }

  // Report the error and get back the report ID.
  const report = ctx.reporter.report(err, scope);

  // Log that we reported an error.
  ctx.logger.error({ err, report }, "graphql query error");
}

export function logQuery(
  ctx: GraphContext,
  document: DocumentNode,
  persisted = ctx.persisted,
  responseTime?: number
) {
  // Try..catch introduced as we try and explore CORL-933.
  // We are seeing that the logger context was undefined
  // when trying to log the query. Putting a lot of safety
  // to keep this up and running, and if it fails for other
  // reasons, gather metrics on it.
  try {
    const queryMeta = {
      responseTime,
      // deprecated: use of the `authenticated` log field is deprecated in favour of the `userID` field
      authenticated: ctx.user ? true : false,
      userID: ctx.user ? ctx.user.id : null,
      ...(persisted
        ? // A persisted query was provided, we can pull the operation metadata
          // out from the persisted object.
          getPersistedQueryMetadata(persisted)
        : // A persisted query was not provided, parse the operation metadata
          // out from the document.
          getOperationMetadata(document)),
    };

    // CORL-933: We are checking we have a logger as sometimes
    // we are seeing no logger on the graph context. We're not
    // sure why this is the case, but we want to catch when this
    // is happening and not throw an error.
    if (!ctx || !ctx.logger) {
      // Catch the context and log it out, we need to know what is
      // going on here
      logger.warn(
        { ctx: Boolean(ctx) },
        "unable to find logger on GraphContext"
      );

      // Continue to log the query.
      // We don't want to lose the precious metrics.
      logger.info(queryMeta, "graphql query");
    } else {
      // HAPPY STATE:
      // Carry on as normal, everything is as it should be!
      ctx.logger.info(queryMeta, "graphql query");
    }
  } catch (err) {
    // Since we introduced all these checks, we don't know
    // the state of the context or what other data may be
    // undefined.
    //
    // If while compositing this log data we fail for other
    // reasons, let's catch that to prevent other errors from
    // occurring and log everything we can.
    logger.error(
      { err, ctx: Boolean(ctx), document: Boolean(document) },
      "unable to log GraphQL query"
    );
  }
}

export class LoggerExtension implements GraphQLExtension<GraphContext> {
  public executionDidStart(o: {
    executionArgs: ExecutionArgs;
  }): EndHandler | void {
    // Only try to log things if the context is provided.
    if (o.executionArgs.contextValue) {
      // Grab the start time so we can calculate the time it takes to execute
      // the graph query.
      const timer = createTimer();
      return () => {
        // Log out the details of the request.
        logQuery(
          o.executionArgs.contextValue,
          o.executionArgs.document,
          undefined,
          timer()
        );
      };
    }
  }

  public willSendResponse(response: {
    graphqlResponse: GraphQLResponse;
    context: GraphContext;
  }): void {
    if (response.graphqlResponse.errors) {
      response.graphqlResponse.errors.forEach((err) =>
        logAndReportError(response.context, err)
      );
    }
  }
}
