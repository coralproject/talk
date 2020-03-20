import { graphql } from "react-relay";
import { Environment } from "relay-runtime";

import {
  commitMutationPromiseNormalized,
  createMutation,
  MutationInput,
} from "coral-framework/lib/relay";

import { RotateSSOSigningSecretMutation as MutationTypes } from "coral-admin/__generated__/RotateSSOSigningSecretMutation.graphql";

const clientMutationId = 0;

const RotateSSOSigningSecretMutation = createMutation(
  "rotateSSOSigningSecret",
  (environment: Environment, input: MutationInput<MutationTypes>) => {
    return commitMutationPromiseNormalized<MutationTypes>(environment, {
      mutation: graphql`
        mutation RotateSSOSigningSecretMutation(
          $input: RotateSSOSigningSecretInput!
        ) {
          rotateSSOSigningSecret(input: $input) {
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

export default RotateSSOSigningSecretMutation;
