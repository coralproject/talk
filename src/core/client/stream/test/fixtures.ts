import TIME from "coral-common/time";
import {
  GQLComment,
  GQLCOMMENT_STATUS,
  GQLDIGEST_FREQUENCY,
  GQLFEATURE_FLAG,
  GQLMODERATION_MODE,
  GQLSettings,
  GQLSite,
  GQLStory,
  GQLSTORY_MODE,
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
import { NULL_VALUE } from "coral-test/helpers/fixture";

export const settings = createFixture<GQLSettings>({
  id: "settings",
  moderation: GQLMODERATION_MODE.POST,
  memberBios: false,
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
    timeout: 2 * TIME.WEEK,
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
  badges: {
    label: "Staff",
    adminLabel: "Staff",
    moderatorLabel: "Staff",
    staffLabel: "Staff",
    memberLabel: "Member",
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
  media: {
    twitter: { enabled: false },
    youtube: { enabled: false },
    giphy: { enabled: false },
    external: { enabled: false },
  },
  multisite: false,
  featureFlags: [],
  rte: {
    enabled: true,
    strikethrough: false,
    spoiler: false,
    sarcasm: false,
  },
  flattenReplies: false,
  flairBadges: {
    flairBadgesEnabled: true,
    flairBadgeURLs: ["https://wwww.example.com/image.jpg"],
  },
});

export const site = createFixtures<GQLSite>([
  {
    name: "Test Site",
    id: "site-id",
    createdAt: "2018-05-06T18:24:00.000Z",
    allowedOrigins: ["http://test-site.com"],
    canModerate: true,
  },
  {
    name: "Second Site",
    id: "site-two",
    createdAt: "2018-05-06T18:24:00.000Z",
    allowedOrigins: ["http://second-site.com"],
    canModerate: true,
  },
]);

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

export const settingsWithMultisite = createFixture<GQLSettings>(
  {
    multisite: true,
  },
  settings
);

export const settingsWithAlternateOldestFirstView = createFixture<GQLSettings>(
  {
    featureFlags: [GQLFEATURE_FLAG.ALTERNATE_OLDEST_FIRST_VIEW],
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
    warning: {
      active: false,
      history: [],
    },
    premod: {
      active: false,
      history: [],
    },
    modMessage: {
      active: false,
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
  mediaSettings: {
    unfurlEmbeds: false,
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
  avatar: NULL_VALUE,
});

export const userWithModMessageHistory = createFixture<GQLUser>(
  {
    status: {
      warning: {
        active: true,
        history: [
          {
            active: true,
            createdBy: { id: "4d4e482f-24ce-44a7-8e2f-dbbb3c17cf52" },
            createdAt: "2021-10-20T13:54:23.549Z",
            message: "You have been warned",
          },
        ],
      },
      modMessage: {
        active: true,
        history: [
          {
            active: true,
            createdBy: { id: "4d4e482f-24ce-44a7-8e2f-dbbb3c17cf52" },
            createdAt: "2021-10-19T19:02:22.532Z",
            message: "first message",
          },
          {
            active: true,
            createdBy: { id: "4d4e482f-24ce-44a7-8e2f-dbbb3c17cf52" },
            createdAt: "2021-10-19T19:08:53.844Z",
            message:
              "This is a friendly reminder about our community guidelines.",
          },
        ],
      },
    },
  },
  baseUser
);

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

export const member = createFixture<GQLUser>({
  id: "member-user",
  username: "member",
  role: GQLUSER_ROLE.MEMBER,
  badges: ["https://wwww.example.com/image.jpg"],
});

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

export const baseStory = createFixture<GQLStory>({
  id: "story-0",
  metadata: {
    title: "title",
  },
  url: "https://www.test.com/story-0",
  isClosed: false,
  isArchiving: false,
  isArchived: false,
  isUnarchiving: false,
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
      UNANSWERED: 0,
      REVIEW: 0,
      QUESTION: 0,
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
    mode: GQLSTORY_MODE.COMMENTS,
    experts: [],
  },
  canModerate: true,
  site: site[0],
});

export const baseComment = createFixture<GQLComment>({
  author: commenters[0],
  body: "Comment Body",
  revision: {
    id: "revision-0",
    media: NULL_VALUE,
  },
  status: GQLCOMMENT_STATUS.NONE,
  createdAt: "2018-07-06T18:24:00.000Z",
  replies: { edges: [], pageInfo: { endCursor: null, hasNextPage: false } },
  replyCount: 0,
  rating: NULL_VALUE,
  editing: {
    edited: false,
    editableUntil: "2018-07-06T18:24:30.000Z",
  },
  actionCounts: {
    reaction: {
      total: 0,
    },
  },
  site: { id: "site-0" },
  story: baseStory,
  parent: NULL_VALUE,
  viewerActionPresence: { reaction: false, dontAgree: false, flag: false },
  tags: [],
  deleted: NULL_VALUE,
  reactions: { edges: [], pageInfo: { endCursor: null, hasNextPage: false } },
  seen: false,
  canReply: true,
  allChildComments: {
    edges: [],
    pageInfo: { endCursor: null, hasNextPage: false },
  },
});

export const moderators = createFixtures<GQLUser>(
  [
    {
      id: "me-as-moderator",
      username: "Moderator",
      role: GQLUSER_ROLE.MODERATOR,
      ignoreable: false,
    },
    {
      id: "site-moderator",
      username: "Site Moderator",
      role: GQLUSER_ROLE.MODERATOR,
      ignoreable: false,
      moderationScopes: {
        scoped: true,
        sites: [site[0]],
      },
    },
    {
      id: "site-moderator-2",
      username: "Site Moderator 2",
      role: GQLUSER_ROLE.MODERATOR,
      ignoreable: false,
      moderationScopes: {
        scoped: true,
        sites: [site[0]],
      },
    },
  ],
  baseUser
);

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
        author: moderators[2],
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
      {
        id: "comment-21",
        author: commenters[2],
        body: "Comment Body 5",
      },
    ],
    baseComment
  )
);

export const commentFromMember = denormalizeComment(
  createFixture<GQLComment>(
    {
      id: "comment-from-member",
      author: member,
      body: "I like gogurt.",
      tags: [
        {
          code: GQLTAG.MEMBER,
        },
      ],
    },
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
                            replyCount: 0,
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
                                                    id: "comment-with-deepest-replies-6",
                                                    body: "body 6",
                                                    replyCount: 1,
                                                    replies: {
                                                      ...baseComment.replies,
                                                      edges: [
                                                        {
                                                          cursor:
                                                            baseComment.createdAt,
                                                          node: {
                                                            ...baseComment,
                                                            id: "comment-with-deepest-replies-7",
                                                            body: "body 7",
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
          },
        },
      ],
    },
  })
);

export const commentFromModerator = denormalizeComment(
  createFixture<GQLComment>(
    {
      id: "comment-from-moderator",
      author: moderators[0],
      body: "Stop all that cussing!",
      tags: [
        {
          code: GQLTAG.MODERATOR,
        },
      ],
    },
    baseComment
  )
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
            { node: comments[4], cursor: comments[4].createdAt },
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

export const storyWithDeletedComments = denormalizeStory(
  createFixture<GQLStory>(
    {
      id: "story-with-deleted-comments",
      url: "http://localhost/stories/story-with-deleted-comments",
      comments: {
        edges: [
          {
            node: { ...comments[0], deleted: true },
            cursor: comments[0].createdAt,
          },
          {
            node: { ...comments[1] },
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

export const storyQAMode = createFixture<GQLStory>(
  {
    settings: {
      mode: GQLSTORY_MODE.QA,
    },
  },
  baseStory
);

export const storyWithAnsweredComments = denormalizeStory(
  createFixture<GQLStory>(
    {
      id: "story-with-answered-comments",
      url: "http://localhost/stories/story-with-answered-comments",
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
    storyQAMode
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

export const replyableComment: GQLComment = {
  ...comments[0],
  author: {
    ...comments[0].author!,
    username: "replyable comment author",
  },
  canReply: true,
};

export const rejectedComment: GQLComment = {
  ...comments[1],
  author: {
    ...comments[1].author!,
    username: "rejected comment author",
  },
  status: GQLCOMMENT_STATUS.REJECTED,
};

export const unrepliableComment: GQLComment = {
  ...comments[2],
  author: {
    ...comments[2].author!,
    username: "unrepliable comment author",
  },
  canReply: false,
};

export const commentWithRejectedReply: GQLComment = denormalizeComment(
  createFixture<GQLComment>({
    ...replyableComment,
    replies: {
      nodes: [rejectedComment],
      pageInfo: { hasNextPage: false, hasPreviousPage: false },
      edges: [
        {
          cursor: "cursor",
          node: {
            ...rejectedComment,
            replies: {
              edges: [
                {
                  cursor: "cursor",
                  node: unrepliableComment,
                },
              ],
              nodes: [rejectedComment],
              pageInfo: { hasNextPage: false, hasPreviousPage: false },
            },
          },
        },
      ],
    },
  })
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
