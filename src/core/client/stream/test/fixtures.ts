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

export const comments = [
  {
    id: "comment-0",
    author: users[0],
    body: "Joining Too",
    createdAt: "2018-07-06T18:24:00.000Z",
    replies: { edges: [], pageInfo: { endCursor: null, hasNextPage: false } },
    replyCount: 0,
    editing: {
      edited: false,
      editableUntil: "2018-07-06T18:24:30.000Z",
    },
  },
  {
    id: "comment-1",
    author: users[1],
    body: "What's up?",
    createdAt: "2018-07-06T18:20:00.000Z",
    replies: { edges: [], pageInfo: { endCursor: null, hasNextPage: false } },
    replyCount: 0,
    editing: {
      edited: false,
      editableUntil: "2018-07-06T18:20:30.000Z",
    },
  },
  {
    id: "comment-2",
    author: users[2],
    body: "Hey!",
    createdAt: "2018-07-06T18:14:00.000Z",
    replies: { edges: [], pageInfo: { endCursor: null, hasNextPage: false } },
    replyCount: 0,
    editing: {
      edited: false,
      editableUntil: "2018-07-06T18:14:30.000Z",
    },
  },
  {
    id: "comment-3",
    author: users[2],
    body: "Comment Body 3",
    createdAt: "2018-07-06T18:14:00.000Z",
    replies: { edges: [], pageInfo: { endCursor: null, hasNextPage: false } },
    replyCount: 0,
    editing: {
      edited: false,
      editableUntil: "2018-07-06T18:14:30.000Z",
    },
  },
  {
    id: "comment-4",
    author: users[2],
    body: "Comment Body 4",
    createdAt: "2018-07-06T18:14:00.000Z",
    replies: { edges: [], pageInfo: { endCursor: null, hasNextPage: false } },
    replyCount: 0,
    editing: {
      edited: false,
      editableUntil: "2018-07-06T18:14:30.000Z",
    },
  },
  {
    id: "comment-5",
    author: users[2],
    body: "Comment Body 5",
    createdAt: "2018-07-06T18:14:00.000Z",
    replies: { edges: [], pageInfo: { endCursor: null, hasNextPage: false } },
    replyCount: 0,
    editing: {
      edited: false,
      editableUntil: "2018-07-06T18:14:30.000Z",
    },
  },
];

export const assets = [
  {
    id: "asset-1",
    url: "http://localhost/assets/asset-1",
    isClosed: false,
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
];

export const commentWithReplies = {
  id: "comment-with-replies",
  author: users[0],
  body: "I like yoghurt",
  createdAt: "2018-07-06T18:24:00.000Z",
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
  editing: {
    edited: false,
    editableUntil: "2018-07-06T18:24:30.000Z",
  },
};

export const commentWithDeepReplies = {
  id: "comment-with-deep-replies",
  author: users[0],
  body: "I like yoghurt",
  createdAt: "2018-07-06T18:24:00.000Z",
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
  editing: {
    edited: false,
    editableUntil: "2018-07-06T18:24:30.000Z",
  },
};

export const assetWithReplies = {
  id: "asset-with-replies",
  url: "http://localhost/assets/asset-with-replies",
  isClosed: false,
  comments: {
    edges: [
      { node: comments[0], cursor: comments[0].createdAt },
      { node: commentWithReplies, cursor: commentWithReplies.createdAt },
    ],
    pageInfo: {
      hasNextPage: false,
    },
  },
};

export const assetWithDeepReplies = {
  id: "asset-with-deep-replies",
  url: "http://localhost/assets/asset-with-replies",
  isClosed: false,
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
};

export const commentWithDeepestReplies = {
  ...commentWithReplies,
  id: "comment-with-deepest-replies",
  body: "body 0",
  replyCount: 1,
  replies: {
    ...commentWithReplies.replies,
    edges: [
      {
        cursor: commentWithReplies.createdAt,
        node: {
          ...commentWithReplies,
          id: "comment-with-deepest-replies-1",
          body: "body 1",
          replyCount: 1,
          replies: {
            ...commentWithReplies.replies,
            edges: [
              {
                cursor: commentWithReplies.createdAt,
                node: {
                  ...commentWithReplies,
                  id: "comment-with-deepest-replies-2",
                  body: "body 2",
                  replyCount: 1,
                  replies: {
                    ...commentWithReplies.replies,
                    edges: [
                      {
                        cursor: commentWithReplies.createdAt,
                        node: {
                          ...commentWithReplies,
                          id: "comment-with-deepest-replies-3",
                          body: "body 3",
                          replyCount: 1,
                          replies: {
                            ...commentWithReplies.replies,
                            edges: [
                              {
                                cursor: commentWithReplies.createdAt,
                                node: {
                                  ...commentWithReplies,
                                  id: "comment-with-deepest-replies-4",
                                  body: "body 4",
                                  replyCount: 1,
                                  replies: {
                                    ...commentWithReplies.replies,
                                    edges: [
                                      {
                                        cursor: commentWithReplies.createdAt,
                                        node: {
                                          ...commentWithReplies,
                                          id: "comment-with-deepest-replies-5",
                                          body: "body 5",
                                          replyCount: 1,
                                          replies: {
                                            ...commentWithReplies.replies,
                                            edges: [
                                              {
                                                cursor:
                                                  commentWithReplies.createdAt,
                                                node: {
                                                  ...commentWithReplies,
                                                  id:
                                                    "comment-with-deepest-replies-6",
                                                  body: "body 6",
                                                  replyCount: 1,
                                                  replies: {
                                                    ...commentWithReplies.replies,
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
};

export const assetWithDeepestReplies = {
  id: "asset-with-deepest-replies",
  url: "http://localhost/assets/asset-with-replies",
  isClosed: false,
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
};
