import { graphql } from "react-relay";
import {
  ConnectionHandler,
  Environment,
  RecordProxy,
  RecordSourceSelectorProxy,
} from "relay-runtime";

import { getViewer } from "talk-framework/helpers";
import { TalkContext } from "talk-framework/lib/bootstrap";
import {
  commitMutationPromiseNormalized,
  createMutationContainer,
  lookup,
  MutationInput,
  MutationResponsePromise,
} from "talk-framework/lib/relay";
import { GQLStory, GQLUSER_ROLE } from "talk-framework/schema";
import { CreateCommentMutation as MutationTypes } from "talk-stream/__generated__/CreateCommentMutation.graphql";

import {
  incrementStoryCommentCounts,
  isVisible,
  prependCommentEdgeToProfile,
  roleIsAtLeast,
} from "../helpers";

export type CreateCommentInput = MutationInput<MutationTypes>;

function sharedUpdater(
  environment: Environment,
  store: RecordSourceSelectorProxy,
  input: CreateCommentInput
) {
  const commentEdge = store
    .getRootField("createComment")!
    .getLinkedRecord("edge")!;
  const status = commentEdge.getLinkedRecord("node")!.getValue("status");

  // If comment is not visible, we don't need to add it.
  if (!isVisible(status)) {
    return;
  }

  incrementStoryCommentCounts(store, input.storyID);
  prependCommentEdgeToProfile(environment, store, commentEdge);
  addCommentToStory(store, input, commentEdge);
}

/**
 * update integrates new comment into the CommentConnection.
 */
function addCommentToStory(
  store: RecordSourceSelectorProxy,
  input: CreateCommentInput,
  commentEdge: RecordProxy
) {
  // Get stream proxy.
  const streamProxy = store.get(input.storyID);
  const connectionKey = "Stream_comments";
  const filters = { orderBy: "CREATED_AT_DESC" };

  if (streamProxy) {
    const con = ConnectionHandler.getConnection(
      streamProxy,
      connectionKey,
      filters
    );
    if (con) {
      ConnectionHandler.insertEdgeBefore(con, commentEdge);
    }
  }
}

/** These are needed to be included when querying for the stream. */
// tslint:disable-next-line:no-unused-expression
graphql`
  fragment CreateCommentMutation_story on Story {
    settings {
      moderation
    }
  }
  fragment CreateCommentMutation_viewer on User {
    role
  }
`;
/** end */

const mutation = graphql`
  mutation CreateCommentMutation($input: CreateCommentInput!) {
    createComment(input: $input) {
      edge {
        cursor
        node {
          ...StreamContainer_comment @relay(mask: false)
          status
        }
      }
      clientMutationId
    }
  }
`;

let clientMutationId = 0;

function commit(
  environment: Environment,
  input: CreateCommentInput,
  { uuidGenerator, relayEnvironment }: TalkContext
) {
  const me = getViewer(environment)!;
  const currentDate = new Date().toISOString();
  const id = uuidGenerator();

  const storySettings = lookup<GQLStory>(relayEnvironment, input.storyID)!
    .settings;
  if (!storySettings || !storySettings.moderation) {
    throw new Error("Moderation mode of the story was not included");
  }

  // TODO: Generate and use schema types.
  const expectPremoderation =
    !roleIsAtLeast(me.role, GQLUSER_ROLE.STAFF) &&
    storySettings.moderation === "PRE";

  return commitMutationPromiseNormalized<MutationTypes>(environment, {
    mutation,
    variables: {
      input: {
        storyID: input.storyID,
        body: input.body,
        nudge: input.nudge,
        clientMutationId: clientMutationId.toString(),
      },
    },
    optimisticResponse: {
      createComment: {
        edge: {
          cursor: currentDate,
          node: {
            id,
            createdAt: currentDate,
            status: "NONE",
            author: {
              id: me.id,
              username: me.username,
            },
            body: input.body,
            editing: {
              editableUntil: new Date(Date.now() + 10000),
            },
            actionCounts: {
              reaction: {
                total: 0,
              },
            },
            tags: [],
          },
        },
        clientMutationId: (clientMutationId++).toString(),
      },
    } as any, // TODO: (cvle) generated types should contain one for the optimistic response.
    optimisticUpdater: store => {
      // Skip optimistic update if comment is probably premoderated.
      if (expectPremoderation) {
        return;
      }
      sharedUpdater(environment, store, input);
      store.get(id)!.setValue(true, "pending");
    },
    updater: store => {
      sharedUpdater(environment, store, input);
    },
  });
}

export const withCreateCommentMutation = createMutationContainer(
  "createComment",
  commit
);

export type CreateCommentMutation = (
  input: CreateCommentInput
) => MutationResponsePromise<MutationTypes, "createComment">;
