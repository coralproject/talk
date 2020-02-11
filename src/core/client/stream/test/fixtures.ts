import {
  GQLComment,
  GQLCOMMENT_STATUS,
  GQLDIGEST_FREQUENCY,
  GQLMODERATION_MODE,
  GQLSettings,
  GQLSite,
  GQLStory,
  GQLTAG,
  GQLTag,
  GQLUser,
  GQLUSER_ROLE,
  GQLUSER_STATUS,
} from "coral-framework/schema";
import {
  createFixture,
  createFixtures,
  denormalizeComment,
  denormalizeComments,
  denormalizeStories,
  denormalizeStory,
} from "coral-framework/testHelpers";

export const settings = createFixture<GQLSettings>({
  id: "settings",
  moderation: GQLMODERATION_MODE.POST,
  premodLinksEnable: false,
  live: {
    enabled: true,
    configurable: true,
  },
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
  organization: {
    name: "Acme Co",
    contactEmail: "acme@acme.co",
    url: "https://acme.co",
  },
  auth: {
    integrations: {
      facebook: {
        enabled: false,
        allowRegistration: true,
        redirectURL: "http://localhost/facebook",
        targetFilter: {
          stream: true,
        },
      },
      google: {
        enabled: false,
        allowRegistration: true,
        redirectURL: "http://localhost/google",
        targetFilter: {
          stream: true,
        },
      },
      oidc: {
        enabled: false,
        allowRegistration: true,
        redirectURL: "http://localhost/oidc",
        targetFilter: {
          stream: true,
        },
      },
      sso: {
        enabled: false,
        allowRegistration: true,
        targetFilter: {
          stream: true,
          admin: true,
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
  staff: {
    label: "Staff",
  },
  reaction: {
    icon: "thumb_up",
    label: "Respect",
    labelActive: "Respected",
    sortLabel: "Most Respected",
  },
  charCount: {
    enabled: false,
  },
  accountFeatures: {
    downloadComments: true,
    changeUsername: true,
    deleteAccount: true,
  },
  multisite: false,
});

export const site = createFixture<GQLSite>({
  name: "Test Site",
  id: "site-id",
  createdAt: "2018-05-06T18:24:00.000Z",
  allowedDomains: ["http://test-site.com"],
});

export const settingsWithoutLocalAuth = createFixture<GQLSettings>(
  {
    auth: {
      integrations: {
        local: {
          enabled: false,
        },
      },
    },
  },
  settings
);

export const baseUser = createFixture<GQLUser>({
  createdAt: "2018-02-06T18:24:00.000Z",
  id: "base-user",
  role: GQLUSER_ROLE.COMMENTER,
  badges: [],
  status: {
    current: [GQLUSER_STATUS.ACTIVE],
    ban: {
      active: false,
      history: [],
    },
    username: {
      history: [],
    },
    suspension: {
      active: false,
      until: null,
      history: [],
    },
  },
  ignoredUsers: [],
  comments: {
    edges: [],
    pageInfo: {
      hasNextPage: false,
    },
  },
  notifications: {
    onReply: false,
    onModeration: false,
    onStaffReplies: false,
    onFeatured: false,
    digestFrequency: GQLDIGEST_FREQUENCY.NONE,
  },
  ignoreable: true,
  profiles: [
    {
      __typename: "LocalProfile",
    },
  ],
});

const yesterday = new Date();
yesterday.setDate(yesterday.getDate() - 1);
const weekago = new Date();
weekago.setDate(yesterday.getDate() - 7);

export const userWithNewUsername = createFixture<GQLUser>(
  {
    id: "new-user",
    username: "u_original",
    role: GQLUSER_ROLE.COMMENTER,
    status: {
      current: [GQLUSER_STATUS.ACTIVE],
      username: {
        history: [
          {
            username: "u_original",
            createdAt: `${yesterday.toISOString()}`,
            createdBy: { id: "new-user" },
          },
        ],
      },
    },
  },
  baseUser
);

export const userWithChangedUsername = createFixture<GQLUser>(
  {
    id: "changed-user",
    username: "u_changed",
    role: GQLUSER_ROLE.COMMENTER,
    status: {
      current: [GQLUSER_STATUS.ACTIVE],
      username: {
        history: [
          {
            username: "original",
            createdAt: weekago.toISOString(),
            createdBy: { id: "changed-user" },
          },
          {
            username: "u_changed",
            createdAt: yesterday.toISOString(),
            createdBy: { id: "changed-user" },
          },
        ],
      },
    },
  },
  baseUser
);

export const userWithEmail = createFixture<GQLUser>(
  {
    id: "email-user",
    email: "used-email@email.com",
  },
  baseUser
);

export const commenters = createFixtures<GQLUser>(
  [
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
  ],
  baseUser
);

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
  parent: undefined,
  viewerActionPresence: { reaction: false, dontAgree: false, flag: false },
  tags: [],
  deleted: undefined,
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
      {
        id: "comment-6",
        author: commenters[2],
        body: "Comment Body 5",
      },
      {
        id: "comment-7",
        author: commenters[2],
        body: "Comment Body 5",
      },
      {
        id: "comment-8",
        author: commenters[2],
        body: "Comment Body 5",
      },
      {
        id: "comment-9",
        author: commenters[2],
        body: "Comment Body 5",
      },
      {
        id: "comment-10",
        author: commenters[2],
        body: "Comment Body 5",
      },
      {
        id: "comment-11",
        author: commenters[2],
        body: "Comment Body 5",
      },
      {
        id: "comment-12",
        author: commenters[2],
        body: "Comment Body 5",
      },
      {
        id: "comment-13",
        author: commenters[2],
        body: "Comment Body 5",
      },
      {
        id: "comment-14",
        author: commenters[2],
        body: "Comment Body 5",
      },
      {
        id: "comment-15",
        author: commenters[2],
        body: "Comment Body 5",
      },
      {
        id: "comment-16",
        author: commenters[2],
        body: "Comment Body 5",
      },
      {
        id: "comment-17",
        author: commenters[2],
        body: "Comment Body 5",
      },
      {
        id: "comment-18",
        author: commenters[2],
        body: "Comment Body 5",
      },
      {
        id: "comment-19",
        author: commenters[2],
        body: "Comment Body 5",
      },
      {
        id: "comment-20",
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

export const featuredTag = createFixture<GQLTag>({
  code: GQLTAG.FEATURED,
  createdAt: "2015-02-06T18:24:00.000Z",
});

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
                                    body: "body 1",
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
    totalPublished: 0,
    tags: {
      FEATURED: 0,
    },
  },
  settings: {
    moderation: GQLMODERATION_MODE.POST,
    premodLinksEnable: false,
    messageBox: {
      enabled: false,
    },
    live: {
      enabled: true,
      configurable: true,
    },
  },
  site,
});

export const moderators = createFixtures<GQLUser>(
  [
    {
      id: "me-as-moderator",
      username: "Moderator",
      role: GQLUSER_ROLE.MODERATOR,
      ignoreable: false,
    },
  ],
  baseUser
);

export const commentsFromStaff = denormalizeComments(
  createFixtures<GQLComment>(
    [
      {
        id: "comment-from-staff-0",
        author: moderators[0],
        body: "Joining Too",
        tags: [{ code: GQLTAG.STAFF }],
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

export const storyWithFeaturedComments = denormalizeStory(
  createFixture<GQLStory>(
    {
      id: "story-with-featured-comments",
      url: "http://localhost/stories/story-with-featured-comments",
      comments: {
        edges: [
          {
            node: { ...comments[0], tags: [featuredTag] },
            cursor: comments[0].createdAt,
          },
          {
            node: { ...comments[1], tags: [featuredTag] },
            cursor: comments[1].createdAt,
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

export const storyWithOnlyStaffComments = denormalizeStory(
  createFixture<GQLStory>(
    {
      id: "story-with-only-staff-comments",
      url: "http://localhost/stories/story-with-only-staff-comments",
      comments: {
        edges: [
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
    baseStory
  )
);

export const viewerWithComments = createFixture<GQLUser>(
  {
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
  },
  baseUser
);

/**
 * viewerPassive is a viewer who has not participated in any story.
 */
export const viewerPassive = createFixture<GQLUser>(
  {
    id: "viewer-passive",
    username: "Passivo",
    role: GQLUSER_ROLE.COMMENTER,
  },
  baseUser
);
