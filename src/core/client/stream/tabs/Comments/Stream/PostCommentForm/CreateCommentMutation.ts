import { graphql } from "react-relay";
import {
  ConnectionHandler,
  Environment,
  RecordProxy,
  RecordSourceSelectorProxy,
} from "relay-runtime";

import { getViewer, roleIsAtLeast } from "coral-framework/helpers";
import { CoralContext } from "coral-framework/lib/bootstrap";
import {
  commitMutationPromiseNormalized,
  createMutationContainer,
  lookup,
  MutationInput,
  MutationResponsePromise,
} from "coral-framework/lib/relay";
import {
  GQLStory,
  GQLSTORY_MODE,
  GQLTAG,
  GQLUSER_ROLE,
} from "coral-framework/schema";
import { CreateCommentEvent } from "coral-stream/events";

import { CreateCommentMutation as MutationTypes } from "coral-stream/__generated__/CreateCommentMutation.graphql";
import { COMMENT_SORT } from "coral-stream/__generated__/StreamContainerLocal.graphql";

import {
  incrementStoryCommentCounts,
  isPublished,
  prependCommentEdgeToProfile,
} from "../../helpers";

export type CreateCommentInput = MutationInput<MutationTypes> & {
  commentsOrderBy?: COMMENT_SORT;
};

function sharedUpdater(
  environment: Environment,
  store: RecordSourceSelectorProxy,
  input: CreateCommentInput,
  uuidGenerator: CoralContext["uuidGenerator"]
) {
  const commentEdge = store
    .getRootField("createComment")!
    .getLinkedRecord("edge")!;
  const status = commentEdge.getLinkedRecord("node")!.getValue("status");
  // If comment is not visible, we don't need to add it.
  if (!isPublished(status)) {
    return;
  }

  incrementStoryCommentCounts(store, input.storyID);
  prependCommentEdgeToProfile(environment, store, commentEdge);
  tagUnansweredQuestions(environment, store, input, commentEdge, uuidGenerator);
  addCommentToStory(store, input, commentEdge);
}

function getConnection(
  streamProxy: RecordProxy | null,
  connectionKey: string,
  filters: any
) {
  if (!streamProxy) {
    return null;
  }

  const con = ConnectionHandler.getConnection(
    streamProxy,
    connectionKey,
    filters
  );

  return con;
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
  const streamProxy = store.get(input.storyID)!;
  const connectionKey = "Stream_comments";

  if (input.commentsOrderBy === "CREATED_AT_ASC") {
    const con = getConnection(streamProxy, connectionKey, {
      orderBy: "CREATED_AT_ASC",
    });
    if (con) {
      ConnectionHandler.insertEdgeAfter(con, commentEdge);
    }
  } else {
    const con = getConnection(streamProxy, connectionKey, {
      orderBy: "CREATED_AT_DESC",
    });
    if (con) {
      ConnectionHandler.insertEdgeBefore(con, commentEdge);
    }
  }
}

function tagUnansweredQuestions(
  environment: Environment,
  store: RecordSourceSelectorProxy,
  input: CreateCommentInput,
  commentEdge: RecordProxy,
  uuidGenerator: CoralContext["uuidGenerator"]
) {
  const node = commentEdge.getLinkedRecord("node");
  if (!node) {
    return;
  }
  const story = store.get(input.storyID);
  if (!story) {
    return;
  }
  const storySettings = story.getLinkedRecord("settings");
  const mode = storySettings?.getValue("mode");
  if (mode !== GQLSTORY_MODE.QA) {
    return;
  }
  const viewer = getViewer(environment)!;
  const experts = storySettings?.getLinkedRecords("experts");

  // if there are no experts or the author is not an expert, the question is unanswered
  if (!experts || experts.every((exp) => exp.getValue("id") !== viewer.id)) {
    const tags = node.getLinkedRecords("tags");
    if (tags) {
      const featuredTag = store.create(uuidGenerator(), "Tag");
      featuredTag.setValue(GQLTAG.UNANSWERED, "code");
      node.setLinkedRecords(tags.concat(featuredTag), "tags");
    }
    const commentCountsRecord = story.getLinkedRecord("commentCounts");
    if (!commentCountsRecord) {
      return;
    }
    const tagsRecord = commentCountsRecord.getLinkedRecord("tags");
    if (tagsRecord) {
      tagsRecord.setValue(
        (tagsRecord.getValue("UNANSWERED") as number) + 1,
        "UNANSWERED"
      );
    }
  }
}

/** These are needed to be included when querying for the stream. */
// eslint-disable-next-line no-unused-expressions
graphql`
  fragment CreateCommentMutation_viewer on User {
    role
    createdAt
    badges
    status {
      current
      ban {
        active
      }
    }
  }
`;
// eslint-disable-next-line no-unused-expressions
graphql`
  fragment CreateCommentMutation_story on Story {
    settings {
      moderation
    }
  }
`;
/** end */

const mutation = graphql`
  mutation CreateCommentMutation($input: CreateCommentInput!) {
    createComment(input: $input) {
      edge {
        cursor
        node {
          ...AllCommentsTabContainer_comment @relay(mask: false)
          status
          story {
            settings {
              # Load the story live settings so new comments can verify if live
              # updates are still enabled (and enable then if they are).
              live {
                enabled
              }
            }
          }
        }
      }
      clientMutationId
    }
  }
`;

let clientMutationId = 0;

async function commit(
  environment: Environment,
  input: CreateCommentInput,
  { uuidGenerator, relayEnvironment, eventEmitter }: CoralContext
) {
  const viewer = getViewer(environment)!;
  const currentDate = new Date().toISOString();
  const id = uuidGenerator();

  const storySettings = lookup<GQLStory>(relayEnvironment, input.storyID)!
    .settings;
  if (!storySettings || !storySettings.moderation) {
    throw new Error("Moderation mode of the story was not included");
  }

  // TODO: Generate and use schema types.
  const expectPremoderation =
    !roleIsAtLeast(viewer.role, GQLUSER_ROLE.STAFF) &&
    storySettings.moderation === "PRE";

  const createCommentEvent = CreateCommentEvent.begin(eventEmitter, {
    body: input.body,
    storyID: input.storyID,
  });

  try {
    const result = await commitMutationPromiseNormalized<MutationTypes>(
      environment,
      {
        mutation,
        variables: {
          input: {
            storyID: input.storyID,
            body: input.body || "",
            nudge: input.nudge,
            media: input.media,
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
                pending: false,
                lastViewerAction: null,
                author: {
                  id: viewer.id,
                  username: viewer.username,
                  bio: viewer.bio,
                  createdAt: viewer.createdAt,
                  badges: viewer.badges,
                  avatar: viewer.avatar,
                  ignoreable: false,
                },
                site: {
                  id: uuidGenerator(),
                },
                revision: {
                  id: uuidGenerator(),
                  media: null,
                },
                parent: null,
                body: input.body || "",
                editing: {
                  editableUntil: new Date(Date.now() + 10000).toISOString(),
                  edited: false,
                },
                actionCounts: {
                  reaction: {
                    total: 0,
                  },
                },
                tags: roleIsAtLeast(viewer.role, GQLUSER_ROLE.STAFF)
                  ? [{ code: "STAFF" }]
                  : [],
                viewerActionPresence: {
                  reaction: false,
                  dontAgree: false,
                  flag: false,
                },
                replies: {
                  edges: [],
                  viewNewEdges: [],
                  pageInfo: { endCursor: null, hasNextPage: false },
                },
                story: {
                  id: input.storyID,
                  settings: {
                    live: {
                      enabled: Boolean(storySettings.live?.enabled),
                    },
                  },
                },
                deleted: false,
              },
            },
            clientMutationId: (clientMutationId++).toString(),
          },
          // TODO: (cvle) fix types.
        } as any,
        optimisticUpdater: (store) => {
          // Skip optimistic update if comment is probably premoderated.
          if (expectPremoderation) {
            return;
          }
          sharedUpdater(environment, store, input, uuidGenerator);
          store.get(id)!.setValue(true, "pending");
        },
        updater: (store) => {
          sharedUpdater(environment, store, input, uuidGenerator);
        },
      }
    );
    createCommentEvent.success({
      id: result.edge.node.id,
      status: result.edge.node.status,
    });
    return result;
  } catch (error) {
    createCommentEvent.error({ message: error.message, code: error.code });
    throw error;
  }
}

export const withCreateCommentMutation = createMutationContainer(
  "createComment",
  commit
);

export type CreateCommentMutation = (
  input: CreateCommentInput
) => MutationResponsePromise<MutationTypes, "createComment">;
