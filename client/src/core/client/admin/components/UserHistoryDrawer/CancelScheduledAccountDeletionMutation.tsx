import { graphql } from "react-relay";
import { Environment } from "relay-runtime";

import {
  commitMutationPromiseNormalized,
  createMutation,
  MutationInput,
} from "coral-framework/lib/relay";

import { CancelScheduledAccountDeletionMutation as MutationTypes } from "coral-admin/__generated__/CancelScheduledAccountDeletionMutation.graphql";

let clientMutationId = 0;

const CancelScheduledAccountDeletionMutation = createMutation(
  "cancelScheduleAccountDeletion",
  async (environment: Environment, input: MutationInput<MutationTypes>) => {
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

export default CancelScheduledAccountDeletionMutation;
