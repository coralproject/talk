import { graphql } from "react-relay";
import { Environment } from "relay-runtime";

import { SCHEDULED_DELETION_WINDOW_DURATION } from "coral-common/common/lib/constants";
import {
  commitMutationPromiseNormalized,
  createMutation,
  MutationInput,
} from "coral-framework/lib/relay";
// import { ScheduleAccountDeletionEvent } from "coral-stream/events";

import { ScheduleAccountDeletionMutation as MutationTypes } from "coral-admin/__generated__/ScheduleAccountDeletionMutation.graphql";

let clientMutationId = 0;

const ScheduleAccountDeletionMutation = createMutation(
  "scheduleAccountDeletion",
  async (
    environment: Environment,
    input: MutationInput<MutationTypes>,
    { eventEmitter }
  ) => {
    // const requestAccountDeletionEvent =
    //   ScheduleAccountDeletionEvent.begin(eventEmitter);
    // try {
    const result = await commitMutationPromiseNormalized<MutationTypes>(
      environment,
      {
        mutation: graphql`
          mutation ScheduleAccountDeletionMutation(
            $input: ScheduleAccountDeletionInput!
          ) {
            scheduleAccountDeletion(input: $input) {
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
          // TODO: Also add to the user's deletion history?
          const deletionDate = new Date(
            Date.now() + SCHEDULED_DELETION_WINDOW_DURATION * 1000
          ).toISOString();
          const userProxy = store.get(input.userID);
          if (userProxy) {
            userProxy.setValue(deletionDate, "scheduledDeletionDate");
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

export default ScheduleAccountDeletionMutation;
