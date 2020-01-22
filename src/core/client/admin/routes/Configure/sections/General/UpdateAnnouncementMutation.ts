import { graphql } from "react-relay";
import { Environment } from "relay-runtime";

import {
  commitMutationPromiseNormalized,
  createMutation,
  MutationInput,
} from "coral-framework/lib/relay";

import { UpdateAnnouncementMutation as MutationTypes } from "coral-admin/__generated__/UpdateAnnouncementMutation.graphql";

let clientMutationId = 0;

const UpdateAnnouncementMutation = createMutation(
  "UpdateAnnouncement",
  (environment: Environment, input: MutationInput<MutationTypes>) =>
    commitMutationPromiseNormalized<MutationTypes>(environment, {
      mutation: graphql`
        mutation UpdateAnnouncementMutation($input: UpdateAnnouncementInput!) {
          updateAnnouncement(input: $input) {
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

export default UpdateAnnouncementMutation;
