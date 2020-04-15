import {
  DocumentNode,
  GraphQLFormattedError,
  OperationDefinitionNode,
  OperationTypeNode,
} from "graphql";

import { PersistedQuery } from "coral-server/models/queries";

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
