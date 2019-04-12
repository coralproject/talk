import {
  GQLComment,
  GQLCOMMENT_STATUS,
  GQLMODERATION_MODE,
  GQLSettings,
  GQLStory,
  GQLUser,
  GQLUSER_ROLE,
} from "talk-framework/schema";
import {
  createFixture,
  createFixtures,
  denormalizeComment,
  denormalizeComments,
  denormalizeStories,
  denormalizeStory,
} from "talk-framework/testHelpers";

export const settings = createFixture<GQLSettings>({
  id: "settings",
  moderation: GQLMODERATION_MODE.POST,
  premodLinksEnable: false,
  communityGuidelines: {
    enabled: false,
    content: "",
  },
  disableCommenting: {
    enabled: false,
    message: "Commenting has been disabled",
  },
  closeCommenting: {
    auto: false,
    message: "Story is closed",
    timeout: undefined,
  },
  auth: {
    integrations: {
      facebook: {
        enabled: false,
        allowRegistration: true,
        targetFilter: {
          stream: true,
        },
      },
      google: {
        enabled: false,
        allowRegistration: true,
        targetFilter: {
          stream: true,
        },
      },
      oidc: {
        enabled: false,
        allowRegistration: true,
        targetFilter: {
          stream: true,
        },
      },
      sso: {
        enabled: false,
        allowRegistration: true,
        targetFilter: {
          stream: true,
        },
      },
      local: {
        enabled: true,
        allowRegistration: true,
        targetFilter: {
          stream: true,
        },
      },
    },
  },
  reaction: {
    icon: "thumb_up",
    label: "Respect",
    labelActive: "Respected",
  },
  charCount: {
    enabled: false,
  },
});

export const commenters = createFixtures<GQLUser>([
  {
    id: "user-0",
    username: "Markus",
    role: GQLUSER_ROLE.COMMENTER,
  },
  {
    id: "user-1",
    username: "Lukas",
    role: GQLUSER_ROLE.COMMENTER,
  },
  {
    id: "user-2",
    username: "Isabelle",
    role: GQLUSER_ROLE.COMMENTER,
  },
  {
    id: "user-3",
    username: "Markus",
    role: GQLUSER_ROLE.COMMENTER,
  },
]);

export const baseComment = createFixture<GQLComment>({
  author: commenters[0],
  body: "Comment Body",
  revision: {
    id: "revision-0",
  },
  status: GQLCOMMENT_STATUS.NONE,
  createdAt: "2018-07-06T18:24:00.000Z",
  replies: { edges: [], pageInfo: { endCursor: null, hasNextPage: false } },
  replyCount: 0,
  editing: {
    edited: false,
    editableUntil: "2018-07-06T18:24:30.000Z",
  },
  actionCounts: {
    reaction: {
      total: 0,
    },
  },
  tags: [],
});

export const comments = denormalizeComments(
  createFixtures<GQLComment>(
    [
      {
        id: "comment-0",
        author: commenters[0],
        body: "Joining Too",
      },
      {
        id: "comment-1",
        author: commenters[1],
        body: "What's up?",
      },
      {
        id: "comment-2",
        author: commenters[2],
        body: "Hey!",
      },
      {
        id: "comment-3",
        author: commenters[2],
        body: "Comment Body 3",
      },
      {
        id: "comment-4",
        author: commenters[2],
        body: "Comment Body 4",
      },
      {
        id: "comment-5",
        author: commenters[2],
        body: "Comment Body 5",
      },
    ],
    baseComment
  )
);

export const commentWithReplies = denormalizeComment(
  createFixture<GQLComment>(
    {
      id: "comment-with-replies",
      author: commenters[0],
      body: "I like yoghurt",
      replies: {
        edges: [
          { node: comments[3], cursor: comments[3].createdAt },
          { node: comments[4], cursor: comments[4].createdAt },
        ],
        pageInfo: {
          hasNextPage: false,
        },
      },
      replyCount: 2,
    },
    baseComment
  )
);

export const commentWithDeepReplies = denormalizeComment(
  createFixture<GQLComment>(
    {
      id: "comment-with-deep-replies",
      author: commenters[0],
      body: "I like yoghurt",
      replies: {
        edges: [
          { node: commentWithReplies, cursor: commentWithReplies.createdAt },
          { node: comments[5], cursor: comments[5].createdAt },
        ],
        pageInfo: {
          hasNextPage: false,
        },
      },
      replyCount: 2,
    },
    baseComment
  )
);

export const commentWithDeepestReplies = denormalizeComment(
  createFixture<GQLComment>({
    ...baseComment,
    id: "comment-with-deepest-replies",
    body: "body 0",
    replyCount: 1,
    replies: {
      ...baseComment.replies,
      edges: [
        {
          cursor: baseComment.createdAt,
          node: {
            ...baseComment,
            id: "comment-with-deepest-replies-1",
            body: "body 1",
            replyCount: 1,
            replies: {
              ...baseComment.replies,
              edges: [
                {
                  cursor: baseComment.createdAt,
                  node: {
                    ...baseComment,
                    id: "comment-with-deepest-replies-2",
                    body: "body 2",
                    replyCount: 1,
                    replies: {
                      ...baseComment.replies,
                      edges: [
                        {
                          cursor: baseComment.createdAt,
                          node: {
                            ...baseComment,
                            id: "comment-with-deepest-replies-3",
                            body: "body 3",
                            replyCount: 1,
                            replies: {
                              ...baseComment.replies,
                              edges: [
                                {
                                  cursor: baseComment.createdAt,
                                  node: {
                                    ...baseComment,
                                    id: "comment-with-deepest-replies-4",
                                    body: "body 4",
                                    replyCount: 1,
                                    replies: {
                                      ...baseComment.replies,
                                      edges: [
                                        {
                                          cursor: baseComment.createdAt,
                                          node: {
                                            ...baseComment,
                                            id:
                                              "comment-with-deepest-replies-5",
                                            body: "body 5",
                                            replyCount: 1,
                                            replies: {
                                              ...baseComment.replies,
                                              edges: [
                                                {
                                                  cursor: baseComment.createdAt,
                                                  node: {
                                                    ...baseComment,
                                                    id:
                                                      "comment-with-deepest-replies-6",
                                                    body: "body 6",
                                                    replyCount: 1,
                                                    replies: {
                                                      ...baseComment.replies,
                                                      edges: [],
                                                    },
                                                  },
                                                },
                                              ],
                                            },
                                          },
                                        },
                                      ],
                                    },
                                  },
                                },
                              ],
                            },
                          },
                        },
                      ],
                    },
                  },
                },
              ],
            },
          },
        },
      ],
    },
  })
);

export const baseStory = createFixture<GQLStory>({
  metadata: {
    title: "title",
  },
  isClosed: false,
  comments: {
    edges: [],
    pageInfo: {
      hasNextPage: false,
    },
  },
  commentCounts: {
    totalVisible: 0,
  },
  settings: {
    moderation: GQLMODERATION_MODE.POST,
    premodLinksEnable: false,
    messageBox: {
      enabled: false,
    },
  },
});

export const moderators = createFixtures<GQLUser>([
  {
    id: "me-as-moderator",
    username: "Moderator",
    role: GQLUSER_ROLE.MODERATOR,
  },
]);

export const commentsFromStaff = denormalizeComments(
  createFixtures<GQLComment>(
    [
      {
        id: "comment-from-staff-0",
        author: moderators[0],
        body: "Joining Too",
        tags: [{ name: "Staff" }],
      },
    ],
    baseComment
  )
);

export const stories = denormalizeStories(
  createFixtures<GQLStory>(
    [
      {
        id: "story-1",
        url: "http://localhost/stories/story-1",
        comments: {
          edges: [
            { node: comments[0], cursor: comments[0].createdAt },
            { node: comments[1], cursor: comments[1].createdAt },
          ],
          pageInfo: {
            hasNextPage: false,
          },
        },
      },
      {
        id: "story-2",
        url: "http://localhost/stories/story-2",
        comments: {
          edges: [
            { node: comments[2], cursor: comments[2].createdAt },
            { node: comments[3], cursor: comments[3].createdAt },
          ],
          pageInfo: {
            hasNextPage: false,
          },
        },
      },
      {
        id: "story-3",
        url: "http://localhost/stories/story-3",
        comments: {
          edges: [
            { node: comments[0], cursor: comments[0].createdAt },
            {
              node: commentsFromStaff[0],
              cursor: commentsFromStaff[0].createdAt,
            },
          ],
          pageInfo: {
            hasNextPage: false,
          },
        },
      },
    ],
    baseStory
  )
);

export const storyWithNoComments = denormalizeStory(
  createFixture<GQLStory>(
    {
      id: "story-with-no-comments",
      url: "http://localhost/stories/story-with-no-comments",
      comments: {
        edges: [],
        pageInfo: {
          hasNextPage: false,
        },
      },
    },
    baseStory
  )
);

export const storyWithReplies = denormalizeStory(
  createFixture<GQLStory>(
    {
      id: "story-with-replies",
      url: "http://localhost/stories/story-with-replies",
      comments: {
        edges: [
          { node: comments[0], cursor: comments[0].createdAt },
          { node: commentWithReplies, cursor: commentWithReplies.createdAt },
        ],
        pageInfo: {
          hasNextPage: false,
        },
      },
    },
    baseStory
  )
);

export const storyWithDeepReplies = denormalizeStory(
  createFixture<GQLStory>(
    {
      id: "story-with-deep-replies",
      url: "http://localhost/stories/story-with-replies",
      comments: {
        edges: [
          { node: comments[0], cursor: comments[0].createdAt },
          {
            node: commentWithDeepReplies,
            cursor: commentWithDeepReplies.createdAt,
          },
        ],
        pageInfo: {
          hasNextPage: false,
        },
      },
    },
    baseStory
  )
);

export const storyWithDeepestReplies = denormalizeStory(
  createFixture<GQLStory>(
    {
      id: "story-with-deepest-replies",
      url: "http://localhost/stories/story-with-replies",
      comments: {
        edges: [
          {
            node: commentWithDeepestReplies,
            cursor: commentWithDeepestReplies.createdAt,
          },
        ],
        pageInfo: {
          hasNextPage: false,
        },
      },
    },
    baseStory
  )
);

export const viewerWithComments = createFixture<GQLUser>({
  id: "me-with-comments",
  username: "Markus",
  role: GQLUSER_ROLE.COMMENTER,
  comments: {
    edges: [
      {
        node: { ...stories[0].comments.edges[0].node, story: stories[0] },
        cursor: comments[0].createdAt,
      },
      {
        node: { ...stories[1].comments.edges[0].node, story: stories[1] },
        cursor: comments[1].createdAt,
      },
    ],
    pageInfo: {
      hasNextPage: false,
    },
  },
});
