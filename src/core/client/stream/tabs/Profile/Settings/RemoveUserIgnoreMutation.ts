import { graphql } from "react-relay";
import { Environment } from "relay-runtime";

import { getViewer } from "coral-framework/helpers";
import {
  commitMutationPromiseNormalized,
  createMutation,
  MutationInput,
} from "coral-framework/lib/relay";

import { RemoveUserIgnoreMutation as MutationTypes } from "coral-stream/__generated__/RemoveUserIgnoreMutation.graphql";

let clientMutationId = 0;

const RemoveUserIgnoreMutation = createMutation(
  "removeUserIgnore",
  (environment: Environment, input: MutationInput<MutationTypes>) =>
    commitMutationPromiseNormalized<MutationTypes>(environment, {
      mutation: graphql`
        mutation RemoveUserIgnoreMutation($input: RemoveUserIgnoreInput!) {
          removeUserIgnore(input: $input) {
            clientMutationId
          }
        }
      `,
      variables: {
        input: {
          ...input,
          clientMutationId: (clientMutationId++).toString(),
        },
      },
      updater: store => {
        const viewer = getViewer(environment)!;
        const viewerProxy = store.get(viewer.id)!;
        const removeIgnoredUserRecords = viewerProxy.getLinkedRecords(
          "ignoredUsers"
        );
        if (removeIgnoredUserRecords) {
          viewerProxy.setLinkedRecords(
            removeIgnoredUserRecords.filter(
              r => r!.getValue("id") !== input.userID
            ),
            "ignoredUsers"
          );
        }
      },
    })
);

export default RemoveUserIgnoreMutation;
