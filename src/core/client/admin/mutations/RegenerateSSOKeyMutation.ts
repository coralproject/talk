import { graphql } from "react-relay";
import { Environment } from "relay-runtime";

import {
  commitMutationPromiseNormalized,
  createMutationContainer,
} from "talk-framework/lib/relay";

import { RegenerateSSOKeyMutation as MutationTypes } from "talk-admin/__generated__/RegenerateSSOKeyMutation.graphql";

const mutation = graphql`
  mutation RegenerateSSOKeyMutation($input: RegenerateSSOKeyInput!) {
    regenerateSSOKey(input: $input) {
      settings {
        auth {
          integrations {
            sso {
              key
              keyGeneratedAt
            }
          }
        }
      }
      clientMutationId
    }
  }
`;

let clientMutationId = 0;

function commit(environment: Environment) {
  return commitMutationPromiseNormalized<MutationTypes>(environment, {
    mutation,
    variables: {
      input: {
        clientMutationId: (clientMutationId++).toString(),
      },
    },
  });
}

export const withRegenerateSSOKeyMutation = createMutationContainer(
  "regenerateSSOKey",
  commit
);

export type RegenerateSSOKeyMutation = () => Promise<
  MutationTypes["response"]["regenerateSSOKey"]
>;
