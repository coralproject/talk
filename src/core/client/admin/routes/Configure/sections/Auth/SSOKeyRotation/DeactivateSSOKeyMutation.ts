import { graphql } from "react-relay";
import { Environment } from "relay-runtime";

import {
  commitMutationPromiseNormalized,
  createMutation,
  MutationInput,
} from "coral-framework/lib/relay";

import { DeactivateSSOKeyMutation as MutationTypes } from "coral-admin/__generated__/DeactivateSSOKeyMutation.graphql";

const clientMutationId = 0;

const DeactivateSSOKeyMutation = createMutation(
  "deactivateSSOKey",
  (environment: Environment, input: MutationInput<MutationTypes>) => {
    return commitMutationPromiseNormalized<MutationTypes>(environment, {
      mutation: graphql`
        mutation DeactivateSSOKeyMutation($input: DeactivateSSOKeyInput!) {
          deactivateSSOKey(input: $input) {
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

export default DeactivateSSOKeyMutation;
