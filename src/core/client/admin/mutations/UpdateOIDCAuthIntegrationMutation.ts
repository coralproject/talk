import { graphql } from "react-relay";
import { Environment } from "relay-runtime";

import {
  commitMutationPromiseNormalized,
  createMutationContainer,
} from "talk-framework/lib/relay";
import { Omit } from "talk-framework/types";

import { UpdateOIDCAuthIntegrationMutation as MutationTypes } from "talk-admin/__generated__/UpdateOIDCAuthIntegrationMutation.graphql";

export type UpdateOIDCAuthIntegrationInput = Omit<
  MutationTypes["variables"]["input"],
  "clientMutationId"
>;

const mutation = graphql`
  mutation UpdateOIDCAuthIntegrationMutation(
    $input: UpdateOIDCAuthIntegrationInput!
  ) {
    updateOIDCAuthIntegration(input: $input) {
      settings {
        auth {
          ...OIDCConfigListContainer_auth
          ...OIDCConfigListContainer_authReadOnly
        }
      }
      clientMutationId
    }
  }
`;

let clientMutationId = 0;

function commit(
  environment: Environment,
  input: UpdateOIDCAuthIntegrationInput
) {
  return commitMutationPromiseNormalized<MutationTypes>(environment, {
    mutation,
    variables: {
      input: {
        ...input,
        clientMutationId: (clientMutationId++).toString(),
      },
    },
  });
}

export const withUpdateOIDCAuthIntegrationMutation = createMutationContainer(
  "updateOIDCAuthIntegration",
  commit
);

export type UpdateOIDCAuthIntegrationMutation = (
  input: UpdateOIDCAuthIntegrationInput
) => Promise<MutationTypes["response"]["updateOIDCAuthIntegration"]>;
