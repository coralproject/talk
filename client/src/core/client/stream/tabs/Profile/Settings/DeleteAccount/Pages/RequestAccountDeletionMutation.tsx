import { graphql } from "react-relay";
import { Environment } from "relay-runtime";

import { SCHEDULED_DELETION_WINDOW_DURATION } from "coral-common/constants";
import { getViewer } from "coral-framework/helpers";
import {
  commitMutationPromiseNormalized,
  createMutation,
  MutationInput,
} from "coral-framework/lib/relay";
import { RequestAccountDeletionEvent } from "coral-stream/events";

import { RequestAccountDeletionMutation as MutationTypes } from "coral-stream/__generated__/RequestAccountDeletionMutation.graphql";

let clientMutationId = 0;

const RequestAccountDeletionMutation = createMutation(
  "requestAccountDeletion",
  async (
    environment: Environment,
    input: MutationInput<MutationTypes>,
    { eventEmitter }
  ) => {
    const requestAccountDeletionEvent =
      RequestAccountDeletionEvent.begin(eventEmitter);
    try {
      const result = await commitMutationPromiseNormalized<MutationTypes>(
        environment,
        {
          mutation: graphql`
            mutation RequestAccountDeletionMutation(
              $input: RequestAccountDeletionInput!
            ) {
              requestAccountDeletion(input: $input) {
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
            const deletionDate = new Date(
              Date.now() + SCHEDULED_DELETION_WINDOW_DURATION * 1000
            ).toISOString();
            const viewerProxy = store.get(viewer.id);
            if (viewerProxy) {
              viewerProxy.setValue(deletionDate, "scheduledDeletionDate");
            }
          },
        }
      );
      requestAccountDeletionEvent.success();
      return result;
    } catch (error) {
      requestAccountDeletionEvent.error({
        message: error.message,
        code: error.code,
      });
      throw error;
    }
  }
);

export default RequestAccountDeletionMutation;
