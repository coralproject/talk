import { graphql } from "react-relay";
import { Environment } from "relay-runtime";

import { getViewer } from "coral-framework/helpers";
import {
  commitMutationPromiseNormalized,
  createMutation,
  MutationInput,
} from "coral-framework/lib/relay";

import { UpdateBioMutation as MutationTypes } from "coral-stream/__generated__/UpdateBioMutation.graphql";

let clientMutationId = 0;
const UpdateBioMutation = createMutation(
  "updateBio",
  (environment: Environment, input: MutationInput<MutationTypes>) => {
    const viewer = getViewer(environment)!;
    return commitMutationPromiseNormalized<MutationTypes>(environment, {
      mutation: graphql`
        mutation UpdateBioMutation($input: UpdateBioInput!) {
          updateBio(input: $input) {
            clientMutationId
            user {
              bio
              id
            }
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
        updateBio: {
          clientMutationId: (clientMutationId++).toString(),
          user: {
            id: viewer.id,
            bio: input.bio || null,
          },
        },
      },
    });
  }
);

export default UpdateBioMutation;
