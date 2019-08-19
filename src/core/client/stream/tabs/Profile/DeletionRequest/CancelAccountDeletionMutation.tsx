import { graphql } from "react-relay";
import { Environment } from "relay-runtime";

import { getViewer } from "coral-framework/helpers";
import {
  commitMutationPromiseNormalized,
  createMutation,
  MutationInput,
} from "coral-framework/lib/relay";

import { CancelAccountDeletionMutation as MutationTypes } from "coral-stream/__generated__/CancelAccountDeletionMutation.graphql";

let clientMutationId = 0;

const CancelAccountDeletionMutation = createMutation(
  "cancelAccountDeletionMutation",
  (environment: Environment, input: MutationInput<MutationTypes>) =>
    commitMutationPromiseNormalized<MutationTypes>(environment, {
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
      optimisticUpdater: store => {
        const viewer = getViewer(environment)!;

        const viewerProxy = store.get(viewer.id);
        if (viewerProxy !== null) {
          viewerProxy.setValue(null, "scheduledDeletionDate");
        }
      },
    })
);

export default CancelAccountDeletionMutation;
