import { graphql } from "react-relay";
import { Environment } from "relay-runtime";

import {
  commitMutationPromiseNormalized,
  createMutation,
  MutationInput,
} from "coral-framework/lib/relay";

import { DeleteSSOSigningSecretMutation as MutationTypes } from "coral-admin/__generated__/DeleteSSOSigningSecretMutation.graphql";

const clientMutationId = 0;

const DeleteSSOSigningSecretMutation = createMutation(
  "deleteSSOSigningSecret",
  (environment: Environment, input: MutationInput<MutationTypes>) => {
    return commitMutationPromiseNormalized<MutationTypes>(environment, {
      mutation: graphql`
        mutation DeleteSSOSigningSecretMutation(
          $input: DeleteSSOSigningSecretInput!
        ) {
          deleteSSOSigningSecret(input: $input) {
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

export default DeleteSSOSigningSecretMutation;
