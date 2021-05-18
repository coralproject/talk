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
  createMutation,
  lookup,
  MutationInput,
} from "coral-framework/lib/relay";
import { CreateCommentEvent } from "coral-stream/events";
import { GQLSTORY_MODE, GQLTAG, GQLUSER_ROLE } from "coral-stream/schema";

import { CreateCommentMutation as MutationTypes } from "coral-stream/__generated__/CreateCommentMutation.graphql";
import { CreateCommentMutation_story } from "coral-stream/__generated__/CreateCommentMutation_story.graphql";
import { CreateCommentMutation_viewer } from "coral-stream/__generated__/CreateCommentMutation_viewer.graphql";
import { COMMENT_SORT } from "coral-stream/__generated__/StreamContainerLocal.graphql";

import {
  incrementStoryCommentCounts,
  isPublished,
  lookupFlattenReplies,
  prependCommentEdgeToProfile,
} from "../../helpers";
import incrementTagCommentCounts from "../../helpers/incrementTagCommentCounts";

export type CreateCommentInput = Omit<
  MutationInput<MutationTypes>,
  "flattenReplies"
> & {
  commentsOrderBy?: COMMENT_SORT;
  tag?: GQLTAG;
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

  if (input.tag) {
    incrementTagCommentCounts(store, input.storyID, input.tag);
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
      tag: input.tag,
    });
    if (con) {
      ConnectionHandler.insertEdgeAfter(con, commentEdge);
    }
  } else {
    const con = getConnection(streamProxy, connectionKey, {
      orderBy: "CREATED_AT_DESC",
      tag: input.tag,
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
    id
    avatar
    badges
    bio
    createdAt
    role
    username
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
    id
    viewerRating {
      id
      tags {
        code
      }
      rating
    }
    settings {
      moderation
      mode
      live {
        enabled
      }
    }
    ratings {
      count
      average
    }
  }
`;
/** end */

const mutation = graphql`
  mutation CreateCommentMutation(
    $input: CreateCommentInput!
    $flattenReplies: Boolean!
  ) {
    createComment(input: $input) {
      edge {
        cursor
        node {
          id
          status
          tags {
            code
          }
          ...AllCommentsTabCommentContainer_comment
          story {
            id
            ratings {
              count
              average
            }
            ...CreateCommentMutation_story @relay(mask: false)
          }
        }
      }
      clientMutationId
    }
  }
`;

let clientMutationId = 0;

export const CreateCommentMutation = createMutation(
  "createComment",
  async (
    environment: Environment,
    input: CreateCommentInput,
    { uuidGenerator, relayEnvironment, eventEmitter }: CoralContext
  ) => {
    const viewer = getViewer<CreateCommentMutation_viewer>(environment)!;
    const currentDate = new Date().toISOString();
    const id = uuidGenerator();

    const story = lookup<CreateCommentMutation_story>(
      relayEnvironment,
      input.storyID
    )!;
    const storySettings = story.settings;
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

    let tag: GQLTAG | undefined;
    if (input.rating) {
      if (input.body.length > 0 || input.media) {
        tag = GQLTAG.REVIEW;
      }
    } else if (storySettings.mode === GQLSTORY_MODE.RATINGS_AND_REVIEWS) {
      tag = GQLTAG.QUESTION;
    }

    const tags = new Array<{ code: GQLTAG }>();
    if (tag) {
      tags.push({ code: tag });
    }

    switch (viewer.role) {
      case GQLUSER_ROLE.ADMIN:
        tags.push({ code: GQLTAG.ADMIN });
        break;
      case GQLUSER_ROLE.MODERATOR:
        tags.push({ code: GQLTAG.MODERATOR });
        break;
      case GQLUSER_ROLE.STAFF:
        tags.push({ code: GQLTAG.STAFF });
        break;
      default:
        break;
    }

    const ratings = story.ratings
      ? {
          count: story.ratings.count,
          average: story.ratings.average,
        }
      : null;

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
              rating: input.rating,
              clientMutationId: clientMutationId.toString(),
            },
            flattenReplies: lookupFlattenReplies(environment),
          },
          optimisticResponse: {
            createComment: {
              edge: {
                cursor: currentDate,
                node: {
                  id,
                  enteredLive: false,
                  createdAt: currentDate,
                  status: "NONE",
                  pending: false,
                  lastViewerAction: null,
                  author: {
                    id: viewer.id,
                    username: viewer.username || null,
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
                  rating: input.rating,
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
                  tags,
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
                      moderation: storySettings.moderation,
                      mode: storySettings.mode,
                      live: {
                        enabled: storySettings.live.enabled,
                      },
                    },
                    viewerRating: tags.some(
                      ({ code }) => code === GQLTAG.REVIEW
                    )
                      ? {
                          id,
                          tags,
                          rating: input.rating!,
                        }
                      : story.viewerRating
                      ? {
                          id: story.viewerRating.id,
                          tags: story.viewerRating.tags.map(({ code }) => ({
                            code,
                          })),
                          rating: story.viewerRating.rating,
                        }
                      : null,
                    ratings,
                  },
                  deleted: false,
                },
              },
              clientMutationId: (clientMutationId++).toString(),
            },
            // TODO: (kiwi/wyattjoh) fix types!
          } as any,
          optimisticUpdater: (store) => {
            // Skip optimistic update if comment is probably premoderated.
            if (expectPremoderation) {
              return;
            }
            sharedUpdater(environment, store, { ...input, tag }, uuidGenerator);
            store.get(id)!.setValue(true, "pending");
          },
          updater: (store) => {
            sharedUpdater(environment, store, { ...input, tag }, uuidGenerator);
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
);
