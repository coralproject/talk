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
import { CreateModeratorNoteMutation } from "coral-stream/__generated__/CreateModeratorNoteMutation.graphql";

let clientMutationId = 0;

const CreateModeratorNoteMutation = createMutation(
  "createModeratorNote",
  (
    environment: Environment,
    input: MutationInput<CreateModeratorNoteMutation>,
    { uuidGenerator }: CoralContext
  ) => {
    const viewer = getViewer(environment)!;
    const notes =
      lookup<GQLUser>(environment, input.userID)!.moderatorNotes || [];
    const now = new Date();
    return commitMutationPromiseNormalized<CreateModeratorNoteMutation>(
      environment,
      {
        mutation: graphql`
          mutation CreateModeratorNoteMutation(
            $input: CreateModeratorNoteInput!
          ) {
            createModeratorNote(input: $input) {
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
          createModeratorNote: {
            user: {
              id: input.userID,
              moderatorNotes: notes.concat({
                id: uuidGenerator(),
                body: input.body,
                createdAt: now.toISOString(),
                createdBy: {
                  username: viewer.username,
                  id: viewer.id,
                } as any,
              }),
            },
            clientMutationId: (clientMutationId++).toString(),
          },
        },
      }
    );
  }
);

export default CreateModeratorNoteMutation;
