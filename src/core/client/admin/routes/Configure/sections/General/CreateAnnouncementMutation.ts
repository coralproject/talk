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
            announcement {
              id
              content
              disableAt
            }
            clientMutationId
          }
        }
      `,
      variables: {
        input: {
          content: input.content,
          disableAt: input.disableAt,
          clientMutationId: (clientMutationId++).toString(),
        },
      },
    })
);

export default CreateAnnouncementMutation;
