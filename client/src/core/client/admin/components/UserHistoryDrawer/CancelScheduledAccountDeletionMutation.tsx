import { graphql } from "react-relay";
import { Environment } from "relay-runtime";

import {
  commitMutationPromiseNormalized,
  createMutation,
  MutationInput,
} from "coral-framework/lib/relay";
// import { CancelScheduledAccountDeletionEvent } from "coral-stream/events";

import { CancelScheduledAccountDeletionMutation as MutationTypes } from "coral-admin/__generated__/CancelScheduledAccountDeletionMutation.graphql";

let clientMutationId = 0;

const CancelScheduledAccountDeletionMutation = createMutation(
  "cancelScheduleAccountDeletion",
  async (
    environment: Environment,
    input: MutationInput<MutationTypes>,
    { eventEmitter }
  ) => {
    // const requestAccountDeletionEvent =
    //   CancelScheduledAccountDeletionEvent.begin(eventEmitter);
    // try {
    const result = await commitMutationPromiseNormalized<MutationTypes>(
      environment,
      {
        mutation: graphql`
          mutation CancelScheduledAccountDeletionMutation(
            $input: CancelScheduledAccountDeletionInput!
          ) {
            cancelScheduledAccountDeletion(input: $input) {
              user {
                scheduledDeletionDate
              }
              clientMutationId
            }
          }
        `,
        variables: {
          input: {
            userID: input.userID,
            clientMutationId: (clientMutationId++).toString(),
          },
        },
        optimisticUpdater: (store) => {
          const userProxy = store.get(input.userID);
          if (userProxy) {
            userProxy.setValue(null, "scheduledDeletionDate");
          }
        },
      }
    );
    // requestAccountDeletionEvent.success();
    return result;
    // } catch (error) {
    // requestAccountDeletionEvent.error({
    //   message: error.message,
    //   code: error.code,
    // });
    //   throw error;
    // }
  }
);

export default CancelScheduledAccountDeletionMutation;
