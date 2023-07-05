import { graphql } from "react-relay";
import { Environment } from "relay-runtime";

import { getViewer } from "coral-framework/helpers";
import {
  commitMutationPromiseNormalized,
  createMutation,
  MutationInput,
} from "coral-framework/lib/relay";
import { CancelAccountDeletionEvent } from "coral-stream/events";

import { CancelAccountDeletionMutation as MutationTypes } from "coral-stream/__generated__/CancelAccountDeletionMutation.graphql";

let clientMutationId = 0;

const CancelAccountDeletionMutation = createMutation(
  "cancelAccountDeletionMutation",
  async (
    environment: Environment,
    input: MutationInput<MutationTypes>,
    { eventEmitter }
  ) => {
    const cancelAccountDeletionEvent =
      CancelAccountDeletionEvent.begin(eventEmitter);
    try {
      const result = await commitMutationPromiseNormalized<MutationTypes>(
        environment,
        {
          mutation: graphql`
            mutation CancelAccountDeletionMutation(
              $input: CancelAccountDeletionInput!
            ) {
              cancelAccountDeletion(input: $input) {
                user {
                  scheduledDeletionDate
                }
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
          optimisticUpdater: (store) => {
            const viewer = getViewer(environment)!;
            const viewerProxy = store.get(viewer.id);
            if (viewerProxy) {
              viewerProxy.setValue(null, "scheduledDeletionDate");
            }
          },
        }
      );
      cancelAccountDeletionEvent.success();
      return result;
    } catch (error) {
      cancelAccountDeletionEvent.error({
        message: error.message,
        code: error.code,
      });
      throw error;
    }
  }
);

export default CancelAccountDeletionMutation;
