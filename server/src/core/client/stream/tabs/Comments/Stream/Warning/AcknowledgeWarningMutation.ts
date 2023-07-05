import { graphql } from "react-relay";
import { Environment } from "relay-runtime";

import { getViewer } from "coral-framework/helpers";
import {
  commitMutationPromiseNormalized,
  createMutation,
  lookup,
  MutationInput,
} from "coral-framework/lib/relay";

import { GQLUser, GQLUSER_STATUS } from "coral-framework/schema";
let clientMutationId = 0;
import { AcknowledgeWarningMutation as MutationTypes } from "coral-stream/__generated__/AcknowledgeWarningMutation.graphql";

const AcknowledgeWarningMutation = createMutation(
  "acknowledgeWarning",
  (environment: Environment, input: MutationInput<MutationTypes>) => {
    const viewer = getViewer(environment)!;
    return commitMutationPromiseNormalized<MutationTypes>(environment, {
      mutation: graphql`
        mutation AcknowledgeWarningMutation($input: AcknowledgeWarningInput!) {
          acknowledgeWarning(input: $input) {
            user {
              id
              status {
                current
                warning {
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
        acknowledgeWarning: {
          user: {
            id: viewer.id,
            status: {
              current: lookup<GQLUser>(
                environment,
                viewer.id
              )!.status.current.filter((s) => s !== GQLUSER_STATUS.WARNED),
              warning: {
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

export default AcknowledgeWarningMutation;
