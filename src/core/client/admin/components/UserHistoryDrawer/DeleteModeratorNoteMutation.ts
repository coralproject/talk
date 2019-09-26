import { graphql } from "react-relay";
import { Environment } from "relay-runtime";

import { getViewer } from "coral-framework/helpers";
import { CoralContext } from "coral-framework/lib/bootstrap";
import {
  commitMutationPromiseNormalized,
  createMutation,
  lookup,
  MutationInput,
} from "coral-framework/lib/relay";
import { GQLUser } from "coral-framework/schema";
import { DeleteModeratorNoteMutation as MutationTypes } from "coral-stream/__generated__/DeleteModeratorNoteMutation.graphql";

let clientMutationId = 0;

const DeleteModeratorNoteMutation = createMutation(
  "deleteModeratorNote",
  (
    environment: Environment,
    input: MutationInput<MutationTypes>,
    { uuidGenerator }: CoralContext
  ) => {
    const notes =
      lookup<GQLUser>(environment, input.userID)!.moderatorNotes || [];
    return commitMutationPromiseNormalized<MutationTypes>(environment, {
      mutation: graphql`
        mutation DeleteModeratorNoteMutation(
          $input: DeleteModeratorNoteInput!
        ) {
          deleteModeratorNote(input: $input) {
            user {
              moderatorNotes {
                id
                body
                createdBy {
                  username
                  id
                }
                createdAt
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
      optimisticResponse: {
        deleteModeratorNote: {
          user: {
            id: input.userID,
            moderatorNotes: notes.filter(note => note.id !== input.id),
          },
          clientMutationId: (clientMutationId++).toString(),
        },
      },
    });
  }
);

export default DeleteModeratorNoteMutation;
