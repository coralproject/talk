import { pick } from "lodash";
import { graphql } from "react-relay";
import { Environment } from "relay-runtime";

import { DeleteModeratorNoteMutation as MutationTypes } from "coral-admin/__generated__/DeleteModeratorNoteMutation.graphql";
import { CoralContext } from "coral-framework/lib/bootstrap";
import {
  commitMutationPromiseNormalized,
  createMutation,
  lookup,
  MutationInput,
} from "coral-framework/lib/relay";
import { GQLUser } from "coral-framework/schema";

let clientMutationId = 0;

const DeleteModeratorNoteMutation = createMutation(
  "deleteModeratorNote",
  (
    environment: Environment,
    input: MutationInput<MutationTypes>,
    { uuidGenerator }: CoralContext
  ) => {
    const notes =
      lookup<GQLUser>(environment, input.userID)!.moderatorNotes.map(note => {
        const createdBy = pick(note.createdBy, ["username", "id"]);
        return {
          ...pick(note, ["id", "body", "createdAt"]),
          createdBy,
        };
      }) || [];
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
