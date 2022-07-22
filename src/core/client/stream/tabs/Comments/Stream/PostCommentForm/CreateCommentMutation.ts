import { pick } from "lodash";
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
  LOCAL_ID,
  lookup,
  MutationInput,
} from "coral-framework/lib/relay";
import {
  GQLCOMMENT_SORT,
  GQLSTORY_MODE,
  GQLTAG,
  GQLUSER_ROLE,
} from "coral-framework/schema";
import { CreateCommentEvent } from "coral-stream/events";

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

export type CreateCommentInput = Omit<
  MutationInput<MutationTypes>,
  "flattenReplies"
> & {
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
  const node = commentEdge.getLinkedRecord("node")!;
  const status = node.getValue("status");
  node.setValue("CREATE", "lastViewerAction");

  // If comment is not visible, we don't need to add it.
  if (!isPublished(status)) {
    return;
  }

  prependCommentEdgeToProfile(environment, store, commentEdge);
  addCommentToStory(store, input, commentEdge);

  incrementStoryCommentCounts(store, input.storyID, commentEdge);
}

/**
 * update integrates new comment into the CommentConnection.
 */
function addCommentToStory(
  store: RecordSourceSelectorProxy,
  input: CreateCommentInput,
  commentEdge: RecordProxy
) {
  const local = store.get(LOCAL_ID)!;
  const story = store.get(input.storyID)!;
  const commentsTab = store.get(LOCAL_ID)!.getValue("commentsTab")!;

  if (!input.rating && commentsTab === "REVIEWS") {
    // Frontend automatically switches to Questions tab.
    // Nothing to be done here.
    return;
  }

  let connectionKey = "Stream_comments";
  if (commentsTab === "UNANSWERED_COMMENTS") {
    connectionKey = "UnansweredStream_comments";
  }

  let tag: GQLTAG | undefined;
  let rating: number | undefined;
  switch (commentsTab) {
    case "UNANSWERED_COMMENTS":
      tag = GQLTAG.UNANSWERED;
      break;
    case "REVIEWS":
      tag = GQLTAG.REVIEW;
      rating = local.getValue("ratingFilter") as number;
      break;
    case "QUESTIONS":
      tag = GQLTAG.QUESTION;
      rating = local.getValue("ratingFilter") as number;
      break;
    default:
  }

  if (input.commentsOrderBy === GQLCOMMENT_SORT.CREATED_AT_ASC) {
    const con = ConnectionHandler.getConnection(story, connectionKey, {
      orderBy: GQLCOMMENT_SORT.CREATED_AT_ASC,
      tag,
      rating,
    });
    if (con) {
      ConnectionHandler.insertEdgeAfter(con, commentEdge);
    }
  } else {
    const con = ConnectionHandler.getConnection(story, connectionKey, {
      orderBy: GQLCOMMENT_SORT.CREATED_AT_DESC,
      tag,
      rating,
    });
    if (con) {
      ConnectionHandler.insertEdgeBefore(con, commentEdge);
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
    url
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
      experts {
        id
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

    // Determine tags.
    const tags = new Array<{ code: GQLTAG }>();
    if (input.rating) {
      if (input.body.length > 0 || input.media) {
        tags.push({ code: GQLTAG.REVIEW });
      }
    } else if (storySettings.mode === GQLSTORY_MODE.RATINGS_AND_REVIEWS) {
      tags.push({ code: GQLTAG.QUESTION });
    } else if (storySettings.mode === GQLSTORY_MODE.QA) {
      const experts = storySettings.experts;
      // if there are no experts or the author is not an expert, the question is unanswered
      if (!experts || experts.every((exp) => exp.id !== viewer.id)) {
        tags.push({ code: GQLTAG.UNANSWERED });
      }
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
                  lastViewerAction: "CREATE",
                  hasTraversalFocus: false,
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
                    url: story.url,
                    settings: {
                      moderation: storySettings.moderation,
                      mode: storySettings.mode,
                      live: {
                        enabled: storySettings.live.enabled,
                      },
                      experts: storySettings.experts.map((e) =>
                        pick(e, ["id"])
                      ),
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
                    ratings: story.ratings
                      ? {
                          count: story.ratings.count,
                          average: story.ratings.average,
                        }
                      : null,
                  },
                  deleted: false,
                  seen: true,
                  canReply: true,
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
);
