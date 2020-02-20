import { graphql } from "react-relay";
import { Environment } from "relay-runtime";

import { CoralContext } from "coral-framework/lib/bootstrap";
import {
  commitMutationPromiseNormalized,
  createMutation,
  MutationInput,
} from "coral-framework/lib/relay";

import { CreateSiteMutation as MutationTypes } from "coral-admin/__generated__/CreateSiteMutation.graphql";

let clientMutationId = 0;

const CreateSiteMutation = createMutation(
  "createSite",
  (
    environment: Environment,
    input: MutationInput<MutationTypes>,
    { uuidGenerator }: CoralContext
  ) => {
    const id = uuidGenerator();
    const now = new Date();
    return commitMutationPromiseNormalized<MutationTypes>(environment, {
      mutation: graphql`
        mutation CreateSiteMutation($input: CreateSiteInput!) {
          createSite(input: $input) {
            site {
              id
              name
              createdAt
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
      optimisticResponse: {
        createSite: {
          site: {
            id,
            createdAt: now.toISOString(),
            name: input.site.name,
          },
          clientMutationId: (clientMutationId++).toString(),
        },
      },
    });
  }
);

export default CreateSiteMutation;
