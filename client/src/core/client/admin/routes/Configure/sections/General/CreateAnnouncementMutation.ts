import { graphql } from "react-relay";
import { Environment } from "relay-runtime";

import {
  commitMutationPromiseNormalized,
  createMutation,
  MutationInput,
} from "coral-framework/lib/relay";

import { CreateAnnouncementMutation as MutationTypes } from "coral-admin/__generated__/CreateAnnouncementMutation.graphql";

let clientMutationId = 0;

const CreateAnnouncementMutation = createMutation(
  "createAnnouncement",
  (environment: Environment, input: MutationInput<MutationTypes>) =>
    commitMutationPromiseNormalized<MutationTypes>(environment, {
      mutation: graphql`
        mutation CreateAnnouncementMutation($input: CreateAnnouncementInput!) {
          createAnnouncement(input: $input) {
            settings {
              announcement {
                id
                content
                createdAt
                duration
              }
            }
            clientMutationId
          }
        }
      `,
      variables: {
        input: {
          content: input.content,
          duration: input.duration,
          clientMutationId: (clientMutationId++).toString(),
        },
      },
    })
);

export default CreateAnnouncementMutation;
