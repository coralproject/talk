import { graphql } from "react-relay";
import { Environment } from "relay-runtime";

import {
  commitMutationPromiseNormalized,
  createMutation,
  MutationInput,
} from "coral-framework/lib/relay";

import { DeleteSSOKeyMutation as MutationTypes } from "coral-admin/__generated__/DeleteSSOKeyMutation.graphql";

const clientMutationId = 0;

const DeleteSSOKeyMutation = createMutation(
  "deleteSSOKey",
  (environment: Environment, input: MutationInput<MutationTypes>) => {
    return commitMutationPromiseNormalized<MutationTypes>(environment, {
      mutation: graphql`
        mutation DeleteSSOKeyMutation($input: DeleteSSOKeyInput!) {
          deleteSSOKey(input: $input) {
            settings {
              auth {
                integrations {
                  sso {
                    enabled
                    keys {
                      kid
                      secret
                      createdAt
                      lastUsedAt
                      rotatedAt
                      inactiveAt
                    }
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
          ...input,
          clientMutationId: clientMutationId.toString(),
        },
      },
      updater: store => {
        window.console.log(store);
      },
    });
  }
);

export default DeleteSSOKeyMutation;
