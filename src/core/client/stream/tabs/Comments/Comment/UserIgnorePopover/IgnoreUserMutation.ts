import { graphql } from "react-relay";
import { Environment } from "relay-runtime";

import { getViewer } from "coral-framework/helpers";
import {
  commitMutationPromiseNormalized,
  createMutation,
  MutationInput,
} from "coral-framework/lib/relay";

import { IgnoreUserMutation as MutationTypes } from "coral-stream/__generated__/IgnoreUserMutation.graphql";

let clientMutationId = 0;

const IgnoreUserMutation = createMutation(
  "ignoreUser",
  (environment: Environment, input: MutationInput<MutationTypes>) =>
    commitMutationPromiseNormalized<MutationTypes>(environment, {
      mutation: graphql`
        mutation IgnoreUserMutation($input: IgnoreUserInput!) {
          ignoreUser(input: $input) {
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
        const ignoredUserRecords = viewerProxy.getLinkedRecords("ignoredUsers");
        if (ignoredUserRecords) {
          viewerProxy.setLinkedRecords(
            ignoredUserRecords.concat(store.get(input.userID)),
            "ignoredUsers"
          );
        }
      },
    })
);

export default IgnoreUserMutation;
