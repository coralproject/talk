import { graphql } from "react-relay";
import { Environment } from "relay-runtime";

import { getViewer } from "coral-framework/helpers";
import { CoralContext } from "coral-framework/lib/bootstrap";
import {
  commitMutationPromiseNormalized,
  createMutation,
  MutationInput,
} from "coral-framework/lib/relay";
import { IgnoreUserEvent } from "coral-stream/events";

import { IgnoreUserMutation as MutationTypes } from "coral-stream/__generated__/IgnoreUserMutation.graphql";

let clientMutationId = 0;

const IgnoreUserMutation = createMutation(
  "ignoreUser",
  async (
    environment: Environment,
    input: MutationInput<MutationTypes>,
    { eventEmitter }: CoralContext
  ) => {
    const ignoreUserEvent = IgnoreUserEvent.begin(eventEmitter, {
      userID: input.userID,
    });
    try {
      const result = await commitMutationPromiseNormalized<MutationTypes>(
        environment,
        {
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
          updater: (store) => {
            const viewer = getViewer(environment)!;
            const viewerProxy = store.get(viewer.id)!;
            const ignoredUserRecords =
              viewerProxy.getLinkedRecords("ignoredUsers");
            if (ignoredUserRecords) {
              viewerProxy.setLinkedRecords(
                ignoredUserRecords.concat(store.get(input.userID)!),
                "ignoredUsers"
              );
            }
          },
        }
      );
      ignoreUserEvent.success();
      return result;
    } catch (error) {
      ignoreUserEvent.error({ message: error.message, code: error.code });
      throw error;
    }
  }
);

export default IgnoreUserMutation;
