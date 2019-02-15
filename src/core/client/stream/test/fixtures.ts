import {
  denormalizeComment,
  denormalizeComments,
  denormalizeStories,
  denormalizeStory,
} from "talk-framework/testHelpers";

export const settings = {
  id: "settings",
  communityGuidelines: {
    enabled: false,
    content: "",
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
};

export const users = [
  {
    id: "user-0",
    username: "Markus",
  },
  {
    id: "user-1",
    username: "Lukas",
  },
  {
    id: "user-2",
    username: "Isabelle",
  },
];

export const baseComment = {
  author: users[0],
  body: "Comment Body",
  revision: {
    id: "revision-0",
  },
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
};

export const comments = denormalizeComments([
  {
    ...baseComment,
    id: "comment-0",
    author: users[0],
    body: "Joining Too",
  },
  {
    ...baseComment,
    id: "comment-1",
    author: users[1],
    body: "What's up?",
  },
  {
    ...baseComment,
    id: "comment-2",
    author: users[2],
    body: "Hey!",
  },
  {
    ...baseComment,
    id: "comment-3",
    author: users[2],
    body: "Comment Body 3",
  },
  {
    ...baseComment,
    id: "comment-4",
    author: users[2],
    body: "Comment Body 4",
  },
  {
    ...baseComment,
    id: "comment-5",
    author: users[2],
    body: "Comment Body 5",
  },
]);

export const commentWithReplies = denormalizeComment({
  ...baseComment,
  id: "comment-with-replies",
  author: users[0],
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
});

export const commentWithDeepReplies = denormalizeComment({
  ...baseComment,
  id: "comment-with-deep-replies",
  author: users[0],
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
});

export const commentWithDeepestReplies = denormalizeComment({
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
                                          id: "comment-with-deepest-replies-5",
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
});

export const baseStory = {
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
};

export const stories = denormalizeStories([
  {
    ...baseStory,
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
    ...baseStory,
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
]);

export const storyWithReplies = denormalizeStory({
  ...baseStory,
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
});

export const storyWithDeepReplies = denormalizeStory({
  ...baseStory,
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
});

export const storyWithDeepestReplies = denormalizeStory({
  ...baseStory,
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
});

export const meWithComments = {
  id: "me-with-comments",
  username: "Markus",
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
};
