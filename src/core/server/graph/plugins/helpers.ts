import { ApolloError } from "apollo-server-express";
import {
  DocumentNode,
  GraphQLFormattedError,
  OperationDefinitionNode,
  OperationTypeNode,
} from "graphql";
import { merge } from "lodash";

import {
  CoralError,
  InternalDevelopmentError,
  WrappedInternalError,
} from "coral-server/errors";
import { PersistedQuery } from "coral-server/models/queries";

import GraphContext from "../context";

export interface OperationMetadata {
  operationName: string;
  operation: OperationTypeNode;
}

/**
 * getOperationMetadata will extract the operation metadata from the document
 * node.
 *
 * @param doc the document node that can be used to extract operation metadata
 *            from
 */
export const getOperationMetadata = (
  doc: DocumentNode
): Partial<OperationMetadata> => {
  if (doc.kind === "Document") {
    const operationDefinition = doc.definitions.find(
      ({ kind }) => kind === "OperationDefinition"
    ) as OperationDefinitionNode | undefined;
    if (operationDefinition) {
      let operationName: string | undefined;
      if (operationDefinition.name) {
        operationName = operationDefinition.name.value;
      }

      return {
        operationName,
        operation: operationDefinition.operation,
      };
    }
  }

  return {};
};

interface PersistedQueryOperationMetadata extends OperationMetadata {
  persistedQueryID: string;
  persistedQueryBundle: string;
  persistedQueryVersion: string;
}

/**
 * getPersistedQueryMetadata will remap the persisted query to the operation
 * metadata.
 *
 * @param persisted persisted query to remap to operation metadata
 */
export const getPersistedQueryMetadata = ({
  id: persistedQueryID,
  operation,
  operationName,
  bundle: persistedQueryBundle,
  version: persistedQueryVersion,
}: PersistedQuery): PersistedQueryOperationMetadata => ({
  persistedQueryID,
  persistedQueryBundle,
  persistedQueryVersion,
  operation,
  operationName,
});

/**
 * getOriginalError tries to return the original error from a
 * formatted GraphQL error.
 *
 * @param err A GraphQL Formatted Error
 */
export const getOriginalError = (err: GraphQLFormattedError) => {
  if ((err as any).originalError) {
    return (err as any).originalError as Error;
  }
  return null;
};

function hoistCoralErrorExtensions(
  ctx: GraphContext,
  err: GraphQLFormattedError
): void {
  // Grab or wrap the originalError so that it's a CoralError.
  const originalError = getWrappedOriginalError(err, ctx);
  if (!originalError) {
    return;
  }

  // Get the translation bundle.
  const bundle = ctx.i18n.getBundle(ctx.lang);

  // Translate the extensions.
  const extensions = originalError.serializeExtensions(bundle);

  // Hoist the message from the original error into the message of the base
  // error.
  (err as any).message = extensions.message;

  // Re-hoist the extensions.
  merge(err.extensions, extensions);

  return;
}

/**
 * extractOriginalError will pull out the original error if available.
 *
 * @param err the error to have their original error extracted from.
 * @param ctx the Context to extract the environment state.
 */
function getWrappedOriginalError(
  err: GraphQLFormattedError,
  ctx: GraphContext
): CoralError | undefined {
  if (err instanceof ApolloError) {
    // ApolloError's don't need to be hoisted as they contain validation
    // messages about the graph.
    return;
  }

  const originalError = getOriginalError(err);

  if (!originalError) {
    // Only errors that have an originalError need to be hoisted.
    return;
  }

  if (originalError instanceof CoralError) {
    return originalError;
  }

  if (ctx.config.get("env") !== "production") {
    return new InternalDevelopmentError(
      originalError,
      "wrapped internal development error"
    );
  }

  return new WrappedInternalError(originalError, "wrapped internal error");
}

/**
 * enrichAndLogError will enrich and then log out the error.
 *
 * @param ctx the GraphQL context for the request
 * @param err the error that occurred
 */
export function enrichError(
  ctx: GraphContext,
  err: GraphQLFormattedError
): GraphQLFormattedError {
  if (err.extensions) {
    // Delete the exception field from the error extension, we never need to
    // provide that data.
    if (err.extensions.exception) {
      delete err.extensions.exception;
    }

    if (getOriginalError(err)) {
      // Hoist the extensions onto the error.
      hoistCoralErrorExtensions(ctx, err);
    }
  }

  return err;
}
