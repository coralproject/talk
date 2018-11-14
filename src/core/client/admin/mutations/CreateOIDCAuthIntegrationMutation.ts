import { graphql } from "react-relay";
import { Environment } from "relay-runtime";

import {
  commitMutationPromiseNormalized,
  createMutationContainer,
} from "talk-framework/lib/relay";
import { Omit } from "talk-framework/types";

import { CreateOIDCAuthIntegrationMutation as MutationTypes } from "talk-admin/__generated__/CreateOIDCAuthIntegrationMutation.graphql";

export type CreateOIDCAuthIntegrationInput = Omit<
  MutationTypes["variables"]["input"],
  "clientMutationId"
>;

const mutation = graphql`
  mutation CreateOIDCAuthIntegrationMutation(
    $input: CreateOIDCAuthIntegrationInput!
  ) {
    createOIDCAuthIntegration(input: $input) {
      settings {
        auth {
          ...OIDCConfigListContainer_authReadOnly
        }
      }
      clientMutationId
    }
  }
`;

const clientMutationId = 0;

function commit(
  environment: Environment,
  input: CreateOIDCAuthIntegrationInput
) {
  return commitMutationPromiseNormalized<MutationTypes>(environment, {
    mutation,
    variables: {
      input: {
        ...input,
        clientMutationId: clientMutationId.toString(),
      },
    },
    updater: store => {
      const record = store
        .getRootField("createOIDCAuthIntegration")!
        .getLinkedRecord("settings")!
        .getLinkedRecord("auth")!
        .getLinkedRecord("integrations");
      if (record) {
        store
          .getRoot()
          .getLinkedRecord("settings")!
          .getLinkedRecord("auth")!
          .getLinkedRecord("integrations")!
          .copyFieldsFrom(record);
      }
    },
  });
}

export const withCreateOIDCAuthIntegrationMutation = createMutationContainer(
  "createOIDCAuthIntegration",
  commit
);

export type CreateOIDCAuthIntegrationMutation = (
  input: CreateOIDCAuthIntegrationInput
) => Promise<MutationTypes["response"]["createOIDCAuthIntegration"]>;
