import { graphql } from "react-relay";
import { Environment } from "relay-runtime";

import { getViewer } from "coral-framework/helpers";
import {
  commitMutationPromiseNormalized,
  createMutation,
} from "coral-framework/lib/relay";

let clientMutationId = 0;
import { AcknowledgeModMessageMutation as MutationTypes } from "coral-stream/__generated__/AcknowledgeModMessageMutation.graphql";

const AcknowledgeModMessageMutation = createMutation(
  "acknowledgeModMessage",
  (environment: Environment) => {
    const viewer = getViewer(environment)!;
    return commitMutationPromiseNormalized<MutationTypes>(environment, {
      mutation: graphql`
        mutation AcknowledgeModMessageMutation(
          $input: AcknowledgeModMessageInput!
        ) {
          acknowledgeModMessage(input: $input) {
            user {
              id
              status {
                modMessage {
                  active
                }
              }
            }
            clientMutationId
          }
        }
      `,
      variables: {
        input: {
          clientMutationId: clientMutationId.toString(),
        },
      },
      optimisticResponse: {
        acknowledgeModMessage: {
          user: {
            id: viewer.id,
            status: {
              modMessage: {
                active: false,
              },
            },
          },
          clientMutationId: (clientMutationId++).toString(),
        },
      },
    });
  }
);

export default AcknowledgeModMessageMutation;
