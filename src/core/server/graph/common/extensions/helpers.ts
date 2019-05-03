import { DocumentNode, OperationDefinitionNode } from "graphql";

export function getOperationMetadata(doc: DocumentNode) {
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
}
