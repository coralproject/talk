import { graphql } from "react-relay";
import { Environment } from "relay-runtime";

import {
  commitMutationPromiseNormalized,
  createMutation,
  MutationInput,
} from "coral-framework/lib/relay";

import { ScheduleAccountDeletionMutation as MutationTypes } from "coral-admin/__generated__/ScheduleAccountDeletionMutation.graphql";

let clientMutationId = 0;

const ScheduleAccountDeletionMutation = createMutation(
  "scheduleAccountDeletion",
  async (environment: Environment, input: MutationInput<MutationTypes>) => {
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
                status {
                  deletion {
                    history {
                      updateType
                      createdBy {
                        username
                      }
                      createdAt
                    }
                  }
                }
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
      }
    );
    return result;
  }
);

export default ScheduleAccountDeletionMutation;
