import { graphql } from "react-relay";
import { Environment } from "relay-runtime";

import {
  commitMutationPromiseNormalized,
  createMutation,
  MutationInput,
} from "coral-framework/lib/relay";

import { DeactivateSSOSigningSecretMutation as MutationTypes } from "coral-admin/__generated__/DeactivateSSOSigningSecretMutation.graphql";

const clientMutationId = 0;

const DeactivateSSOSigningSecretMutation = createMutation(
  "deactivateSSOSigningSecret",
  (environment: Environment, input: MutationInput<MutationTypes>) => {
    return commitMutationPromiseNormalized<MutationTypes>(environment, {
      mutation: graphql`
        mutation DeactivateSSOSigningSecretMutation(
          $input: DeactivateSSOSigningSecretInput!
        ) {
          deactivateSSOSigningSecret(input: $input) {
            settings {
              auth {
                integrations {
                  sso {
                    enabled
                    signingSecrets {
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
    });
  }
);

export default DeactivateSSOSigningSecretMutation;
