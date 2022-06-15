import {
  DEFAULT_SESSION_DURATION,
  TOXICITY_THRESHOLD_DEFAULT,
} from "coral-common/constants";
import TIME from "coral-common/time";
import { pureMerge } from "coral-common/utils";
import {
  GQLComment,
  GQLCOMMENT_FLAG_REASON,
  GQLCOMMENT_STATUS,
  GQLCommentModerationAction,
  GQLCommentsConnection,
  GQLFlag,
  GQLFlagsConnection,
  GQLMODERATION_MODE,
  GQLModerationQueues,
  GQLNEW_USER_MODERATION,
  GQLSettings,
  GQLSite,
  GQLSitesConnection,
  GQLStoriesConnection,
  GQLStory,
  GQLSTORY_MODE,
  GQLSTORY_STATUS,
  GQLTAG,
  GQLUser,
  GQLUSER_ROLE,
  GQLUSER_STATUS,
  GQLUsersConnection,
  GQLWEBHOOK_EVENT_NAME,
} from "coral-framework/schema";
import { createFixture, createFixtures } from "coral-framework/testHelpers";
import { NULL_VALUE } from "coral-test/helpers/fixture";

export const settings = createFixture<GQLSettings>({
  id: "settings",
  moderation: GQLMODERATION_MODE.POST,
  premoderateAllCommentsSites: [],
  premodLinksEnable: false,
  locale: "en-US",
  live: {
    enabled: true,
    configurable: true,
  },
  wordList: {
    suspect: ["idiot", "stupid"],
    banned: ["fuck"],
  },
  charCount: {
    enabled: false,
    max: 1000,
    min: 3,
  },
  disableCommenting: {
    enabled: false,
    message: "Comments are closed on this story.",
  },
  closeCommenting: {
    auto: false,
    timeout: 604800,
    message: "Comments are closed on this story.",
  },
  badges: {
    label: "Staff",
    staffLabel: "Staff",
    moderatorLabel: "Staff",
    adminLabel: "Staff",
    memberLabel: "Member",
  },
  memberBios: true,
  reaction: {
    label: "Reaction",
    labelActive: "reacted",
    sortLabel: "Reactions",
    icon: "icon",
  },
  email: {
    enabled: true,
    smtp: {},
  },
  customCSSURL: "",
  editCommentWindowLength: 30000,
  communityGuidelines: {
    enabled: false,
    content: "",
  },
  organization: {
    name: "Coral",
    url: "https://test.com/",
    contactEmail: "coral@test.com",
  },
  recentCommentHistory: {
    enabled: false,
    timeFrame: 7 * TIME.DAY,
    // Rejection rate defaulting to 30%, once exceeded, comments will be
    // pre-moderated.
    triggerRejectionRate: 0.3,
  },
  integrations: {
    akismet: {
      enabled: false,
      ipBased: false,
    },
    perspective: {
      enabled: false,
      threshold: TOXICITY_THRESHOLD_DEFAULT / 100,
      sendFeedback: false,
    },
  },
  auth: {
    sessionDuration: DEFAULT_SESSION_DURATION,
    integrations: {
      local: {
        enabled: true,
        allowRegistration: true,
        targetFilter: {
          admin: true,
          stream: true,
        },
      },
      sso: {
        enabled: false,
        allowRegistration: true,
        targetFilter: {
          admin: true,
          stream: true,
        },
        signingSecrets: [
          {
            kid: "kid-01",
            secret: "secret",
            createdAt: "2020-01-01T01:00:00.000Z",
            lastUsedAt: null,
            rotatedAt: null,
            inactiveAt: null,
          },
        ],
        key: "",
        keyGeneratedAt: null,
      },
      google: {
        enabled: false,
        allowRegistration: true,
        targetFilter: {
          admin: true,
          stream: true,
        },
        clientID: "",
        clientSecret: "",
        callbackURL: "http://localhost/google/callback",
        redirectURL: "http://localhost/google",
      },
      facebook: {
        enabled: false,
        allowRegistration: true,
        targetFilter: {
          admin: true,
          stream: true,
        },
        clientID: "",
        clientSecret: "",
        callbackURL: "http://localhost/facebook/callback",
        redirectURL: "http://localhost/facebook",
      },
      oidc: {
        enabled: false,
        allowRegistration: false,
        targetFilter: {
          admin: true,
          stream: true,
        },
        name: "OIDC",
        callbackURL: "http://localhost/oidc/callback",
        redirectURL: "http://localhost/oidc",
      },
    },
  },
  webhooks: {
    endpoints: [],
  },
  webhookEvents: [GQLWEBHOOK_EVENT_NAME.STORY_CREATED],
  stories: {
    scraping: {
      enabled: true,
      authentication: false,
      username: "",
      password: "",
    },
    disableLazy: false,
  },
  accountFeatures: {
    downloadComments: true,
    changeUsername: true,
    deleteAccount: true,
  },
  newCommenters: {
    premodEnabled: false,
    approvedCommentsThreshold: 2,
    moderation: {
      mode: GQLMODERATION_MODE.POST,
      premodSites: [],
    },
  },
  premoderateSuspectWords: false,
  media: {
    twitter: { enabled: false },
    giphy: { enabled: false },
    youtube: { enabled: false },
    external: { enabled: false },
  },
  slack: {
    channels: [],
  },
  multisite: false,
  featureFlags: [],
  rte: {
    enabled: true,
    strikethrough: false,
    spoiler: false,
  },
  amp: false,
  flattenReplies: false,
  forReviewQueue: false,
  emailDomainModeration: [],
});

export const settingsWithMultisite = createFixture<GQLSettings>(
  {
    multisite: true,
  },
  settings
);

export const settingsWithEmptyAuth = createFixture<GQLSettings>(
  {
    id: "settings",
    auth: {
      sessionDuration: DEFAULT_SESSION_DURATION,
      integrations: {
        local: {
          enabled: true,
          allowRegistration: true,
          targetFilter: {
            admin: true,
            stream: true,
          },
        },
        sso: {
          enabled: false,
          allowRegistration: true,
          targetFilter: {
            admin: true,
            stream: true,
          },
          key: "",
          signingSecrets: [
            {
              kid: "kid-01",
              secret: "secret",
              createdAt: "2020-01-01T01:00:00.000Z",
              lastUsedAt: null,
              rotatedAt: null,
              inactiveAt: null,
            },
          ],
          keyGeneratedAt: null,
        },
        google: {
          enabled: false,
          allowRegistration: true,
          targetFilter: {
            admin: true,
            stream: true,
          },
          clientID: "",
          clientSecret: "",
          callbackURL: "http://localhost/google/callback",
          redirectURL: "http://localhost/google",
        },
        facebook: {
          enabled: false,
          allowRegistration: true,
          targetFilter: {
            admin: true,
            stream: true,
          },
          clientID: "",
          clientSecret: "",
          callbackURL: "http://localhost/facebook/callback",
          redirectURL: "http://localhost/facebook",
        },
        oidc: {
          enabled: false,
          allowRegistration: false,
          targetFilter: {
            admin: true,
            stream: true,
          },
          name: "",
          callbackURL: "http://localhost/oidc/callback",
          redirectURL: "http://localhost/oidc",
        },
      },
    },
  },
  settings
);

export const site = createFixture<GQLSite>({
  name: "Test Site",
  id: "site-id",
  createdAt: "2018-05-06T18:24:00.000Z",
  allowedOrigins: ["http://test-site.com"],
  canModerate: true,
});

export const sites = createFixtures<GQLSite>([
  {
    name: "Test Site",
    id: "site-1",
    createdAt: "2018-07-06T18:24:00.000Z",
    allowedOrigins: ["http://test-site.com"],
    canModerate: true,
  },
  {
    name: "Second Site",
    id: "site-2",
    createdAt: "2018-09-06T18:24:00.000Z",
    allowedOrigins: ["http://test-2-site.com"],
    canModerate: true,
  },
]);

export const moderationActions = createFixtures<GQLCommentModerationAction>([
  {
    id: "07e8f815-e165-4b5d-b438-7163415c8cf7",
    comment: {
      author: {
        username: "luke2",
        id: "4383c3d3-bb9b-40b9-847a-240f3cf6c6af",
      },
      id: "1b41be9f-510f-41f3-a1df-5a431dc98bf3",
    },
    createdAt: "2018-11-29T16:01:51.897Z",
    status: GQLCOMMENT_STATUS.APPROVED,
    __typename: "CommentModerationAction",
  },
  {
    id: "6869314b-47ef-4cf9-b8ce-42b12bca8231",
    comment: {
      author: {
        username: "addy",
        id: "4383c3d3-bb9b-40b9-847a-240f3cf6c6af",
      },
      id: "1b41be9f-510f-41f3-a1df-5a431dc98bf3",
    },
    createdAt: "2018-11-29T16:01:45.644Z",
    status: GQLCOMMENT_STATUS.REJECTED,
    __typename: "CommentModerationAction",
  },
  {
    id: "caebbf7f-4813-42c0-ac3c-46b1be8199e0",
    comment: {
      author: {
        username: "dany",
        id: "4383c3d3-bb9b-40b9-847a-240f3cf6c6af",
      },
      id: "1b41be9f-510f-41f3-a1df-5a431dc98bf3",
    },
    createdAt: "2018-11-29T16:01:42.060Z",
    status: GQLCOMMENT_STATUS.APPROVED,
    __typename: "CommentModerationAction",
  },
  {
    id: "b2f92717-e4a8-4075-a543-95f7c5eaefb2",
    comment: {
      author: {
        username: "admin",
        id: "4383c3d3-bb9b-40b9-847a-240f3cf6c6af",
      },
      id: "1b41be9f-510f-41f3-a1df-5a431dc98bf3",
    },
    createdAt: "2018-11-29T16:01:34.539Z",
    status: GQLCOMMENT_STATUS.REJECTED,
    __typename: "CommentModerationAction",
  },
  {
    id: "9fb2ff3c-7105-4357-99e1-36cdeea49c75",
    comment: {
      author: {
        username: "mod245",
        id: "4383c3d3-bb9b-40b9-847a-240f3cf6c6af",
      },
      id: "1b41be9f-510f-41f3-a1df-5a431dc98bf3",
    },
    createdAt: "2018-11-29T16:01:30.648Z",
    status: GQLCOMMENT_STATUS.APPROVED,
    __typename: "CommentModerationAction",
  },
]);

export const baseUser = createFixture<GQLUser>({
  profiles: [{ __typename: "LocalProfile" }],
  createdAt: "2018-07-06T18:24:00.000Z",
  status: {
    current: [],
    ban: {
      active: false,
      history: [],
    },
    suspension: {
      active: false,
      history: [],
    },
    premod: {
      active: false,
      history: [],
    },
    warning: {
      active: false,
      history: [],
    },
    modMessage: {
      active: false,
      history: [],
    },
  },
});

const recentCommentHistory = {
  statuses: {
    APPROVED: 0,
    REJECTED: 0,
    NONE: 0,
    PREMOD: 0,
    SYSTEM_WITHHELD: 0,
  },
};

export const users = {
  admins: createFixtures<GQLUser>(
    [
      {
        id: "user-admin-0",
        username: "Markus",
        email: "markus@test.com",
        role: GQLUSER_ROLE.ADMIN,
        ignoreable: false,
      },
    ],
    baseUser
  ),
  moderators: createFixtures<GQLUser>(
    [
      {
        id: "user-moderator-0",
        username: "Lukas",
        email: "lukas@test.com",
        role: GQLUSER_ROLE.MODERATOR,
        ignoreable: false,
      },
      {
        id: "site-moderator-1",
        username: "Ginger",
        email: "ginger@test.com",
        role: GQLUSER_ROLE.MODERATOR,
        ignoreable: false,
        moderationScopes: {
          scoped: true,
          sites: [sites[0]],
        },
      },
      {
        id: "site-moderator-2",
        username: "Audrey",
        email: "audrey@test.com",
        role: GQLUSER_ROLE.MODERATOR,
        ignoreable: false,
        moderationScopes: {
          scoped: true,
          sites: [sites[0], sites[1]],
        },
      },
    ],
    baseUser
  ),
  staff: createFixtures<GQLUser>(
    [
      {
        id: "user-staff-0",
        username: "Huy",
        email: "huy@test.com",
        role: GQLUSER_ROLE.STAFF,
        ignoreable: false,
      },
    ],
    baseUser
  ),
  commenters: createFixtures<GQLUser>(
    [
      {
        id: "user-commenter-0",
        username: "Isabelle",
        email: "isabelle@test.com",
        role: GQLUSER_ROLE.COMMENTER,
        ignoreable: true,
        recentCommentHistory,
        moderatorNotes: [],
        allComments: {
          edges: [],
          nodes: [],
          pageInfo: {
            hasPreviousPage: false,
            hasNextPage: false,
            startCursor: null,
            endCursor: null,
          },
        },
      },
      {
        id: "user-commenter-1",
        username: "Ngoc",
        email: "ngoc@test.com",
        role: GQLUSER_ROLE.COMMENTER,
        ignoreable: true,
        recentCommentHistory,
        moderatorNotes: [],
        allComments: {
          edges: [],
          nodes: [],
          pageInfo: {
            hasPreviousPage: false,
            hasNextPage: false,
            startCursor: null,
            endCursor: null,
          },
        },
      },
      {
        id: "user-commenter-2",
        username: "Max",
        email: "max@test.com",
        role: GQLUSER_ROLE.COMMENTER,
        ignoreable: true,
        recentCommentHistory,
      },
    ],
    baseUser
  ),
  suspendedCommenter: createFixture<GQLUser>(
    {
      id: "user-suspended-0",
      username: "lol1111",
      email: "lol1111@test.com",
      role: GQLUSER_ROLE.COMMENTER,
      ignoreable: true,
      status: {
        current: [GQLUSER_STATUS.SUSPENDED],
        ban: { active: false },
        suspension: {
          active: true,
          until: new Date(Date.now() + 600000).toISOString(),
        },
      },
    },
    baseUser
  ),
  bannedCommenter: createFixture<GQLUser>(
    {
      id: "user-banned-0",
      username: "Ingrid",
      email: "ingrid@test.com",
      role: GQLUSER_ROLE.COMMENTER,
      ignoreable: true,
      status: {
        current: [GQLUSER_STATUS.BANNED],
        ban: { active: true },
        suspension: { active: true },
      },
    },
    baseUser
  ),
  siteBannedCommenter: createFixture<GQLUser>(
    {
      id: "user-banned-1",
      username: "Lulu",
      email: "lulu@test.com",
      role: GQLUSER_ROLE.COMMENTER,
      ignoreable: true,
      status: {
        ban: { active: false, sites: [sites[0], sites[1]] },
      },
    },
    baseUser
  ),
};

export const stories = createFixtures<GQLStory>([
  {
    id: "story-1",
    closedAt: null,
    isClosed: false,
    isArchived: false,
    isArchiving: false,
    status: GQLSTORY_STATUS.OPEN,
    createdAt: "2018-11-29T16:01:51.897Z",
    url: "",
    metadata: {
      author: "Vin Hoa",
      title: "Finally a Cure for Cancer",
      publishedAt: "2018-11-29T16:01:51.897Z",
    },
    commentCounts: {
      totalPublished: 5,
    },
    moderationQueues: {
      reported: {
        id: "reported",
        count: 3,
      },
      pending: {
        id: "pending",
        count: 2,
      },
    },
    site: sites[0],
    canModerate: true,
    settings: {
      mode: GQLSTORY_MODE.COMMENTS,
    },
  },
  {
    id: "story-2",
    closedAt: null,
    isClosed: false,
    isArchived: false,
    isArchiving: false,
    status: GQLSTORY_STATUS.OPEN,
    createdAt: "2018-11-29T16:01:51.897Z",
    url: "",
    metadata: {
      author: "Linh Nguyen",
      title: "First Colony on Mars",
      publishedAt: "2018-11-29T16:01:51.897Z",
    },
    commentCounts: {
      totalPublished: 5,
    },
    moderationQueues: {
      reported: {
        id: "reported",
        count: 3,
      },
      pending: {
        id: "pending",
        count: 2,
      },
    },
    site: sites[1],
    canModerate: true,
    settings: {
      mode: GQLSTORY_MODE.COMMENTS,
      moderation: GQLMODERATION_MODE.POST,
      premodLinksEnable: false,
      experts: [],
    },
  },
  {
    id: "story-3",
    closedAt: "2018-11-29T16:01:51.897Z",
    createdAt: "2018-11-29T16:01:51.897Z",
    isClosed: true,
    isArchived: false,
    isArchiving: false,
    status: GQLSTORY_STATUS.CLOSED,
    url: "",
    commentCounts: {
      totalPublished: 5,
    },
    moderationQueues: {
      reported: {
        id: "reported",
        count: 3,
      },
      pending: {
        id: "pending",
        count: 2,
      },
    },
    metadata: {
      author: NULL_VALUE,
      title: "World hunger has been defeated",
      publishedAt: "2018-11-29T16:01:51.897Z",
    },
    site: sites[1],
    canModerate: true,
    settings: {
      mode: GQLSTORY_MODE.COMMENTS,
    },
  },
]);

export const storyConnection = createFixture<GQLStoriesConnection>({
  edges: [
    { node: stories[0], cursor: stories[0].createdAt },
    { node: stories[1], cursor: stories[1].createdAt },
  ],
  pageInfo: { endCursor: null, hasNextPage: false },
});

export const emptyStories = createFixture<GQLStoriesConnection>({
  edges: [],
  pageInfo: { endCursor: null, hasNextPage: false },
});

export const baseComment = createFixture<GQLComment>({
  author: users.commenters[0],
  body: "Comment Body",
  createdAt: "2018-07-06T18:24:00.000Z",
  tags: [],
  status: GQLCOMMENT_STATUS.NONE,
  statusHistory: {
    edges: [],
    pageInfo: { endCursor: null, hasNextPage: false },
  },
  editing: {
    edited: false,
  },
  revisionHistory: [
    {
      id: "revision",
      body: "Comment body",
      createdAt: "2018-07-06T18:24:00.000Z",
    },
  ],
  canModerate: true,
  revision: {
    media: NULL_VALUE,
    actionCounts: {
      flag: {
        reasons: {
          COMMENT_REPORTED_SPAM: 0,
          COMMENT_REPORTED_OTHER: 0,
          COMMENT_REPORTED_OFFENSIVE: 0,
          COMMENT_REPORTED_BIO: 0,
          COMMENT_REPORTED_ABUSIVE: 0,
          COMMENT_DETECTED_TOXIC: 0,
          COMMENT_DETECTED_SUSPECT_WORD: 0,
          COMMENT_DETECTED_SPAM: 0,
          COMMENT_DETECTED_REPEAT_POST: 0,
          COMMENT_DETECTED_RECENT_HISTORY: 0,
          COMMENT_DETECTED_NEW_COMMENTER: 0,
          COMMENT_DETECTED_LINKS: 0,
          COMMENT_DETECTED_BANNED_WORD: 0,
        },
      },
      reaction: {
        total: 0,
      },
    },
    metadata: {
      perspective: NULL_VALUE,
      wordList: NULL_VALUE,
    },
  },
  flags: {
    edges: [],
    pageInfo: { endCursor: null, hasNextPage: false },
    nodes: [],
  },
  story: stories[0],
  site: sites[0],
  parent: NULL_VALUE,
  deleted: NULL_VALUE,
});

export const unmoderatedComments = createFixtures<GQLComment>(
  [
    {
      id: "comment-0",
      author: users.commenters[0],
      createdAt: "2018-07-06T18:24:00.000Z",
      revision: {
        id: "comment-0-revision-0",
      },
      permalink: "http://localhost/comment/0",
      body: "This is an unmoderated comment.",
    },
  ],
  baseComment
);

export const featuredComments = createFixtures<GQLComment>(
  [
    {
      id: "comment-0",
      author: users.commenters[0],
      createdAt: "2018-07-06T18:24:00.000Z",
      tags: [
        {
          code: GQLTAG.FEATURED,
        },
      ],
      revision: {
        id: "comment-0-revision-0",
      },
      permalink: "http://localhost/comment/0",
      body: "This is a featured comment.",
    },
  ],
  baseComment
);

export const reportedComments = createFixtures<GQLComment>(
  [
    {
      id: "comment-0",
      author: users.commenters[0],
      revision: {
        id: "comment-0-revision-0",
        actionCounts: {
          flag: {
            reasons: {
              COMMENT_REPORTED_SPAM: 2,
            },
          },
          reaction: {
            total: 1,
          },
        },
        metadata: {
          perspective: {
            score: 0.1,
          },
        },
        body:
          "This is the last random sentence I will be writing and I am going to stop mid-sent",
      },
      permalink: "http://localhost/comment/0",
      body:
        "This is the last random sentence I will be writing and I am going to stop mid-sent",
      flags: {
        edges: [
          {
            node: {
              id: "comment-0-flag-0",
              reason: GQLCOMMENT_FLAG_REASON.COMMENT_REPORTED_SPAM,
              flagger: users.commenters[0],
              additionalDetails: "This looks like an ad",
            },
            cursor: "2021-06-01T14:21:21.890Z",
          },
          {
            node: {
              id: "comment-0-flag-1",
              reason: GQLCOMMENT_FLAG_REASON.COMMENT_REPORTED_SPAM,
              flagger: users.commenters[1],
              additionalDetails: "",
            },
            cursor: "2021-06-01T14:21:21.890Z",
          },
        ],
        pageInfo: { endCursor: "2021-06-01T14:21:21.890Z", hasNextPage: true },
        nodes: [
          {
            id: "comment-0-flag-0",
            reason: GQLCOMMENT_FLAG_REASON.COMMENT_REPORTED_SPAM,
            flagger: users.commenters[0],
            additionalDetails: "This looks like an ad",
          },
          {
            id: "comment-0-flag-1",
            reason: GQLCOMMENT_FLAG_REASON.COMMENT_REPORTED_SPAM,
            flagger: users.commenters[1],
            additionalDetails: "",
          },
        ],
      },
      reactions: {
        edges: [
          {
            node: {
              id: "comment-0-reaction-1",
              reacter: {
                userID: "user-commenter-1",
                username: "Ngoc",
              },
            },
            cursor: "2021-06-01T14:21:21.890Z",
          },
        ],
        pageInfo: { endCursor: "2021-06-01T14:21:21.890Z", hasNextPage: true },
      },
    },
    {
      id: "comment-1",
      parent: {
        id: "comment-2",
        author: {
          username: "luke2",
          id: "4383c3d3-bb9b-40b9-847a-240f3cf6c6af",
        },
      },
      revision: {
        id: "comment-1-revision-1",
        actionCounts: {
          flag: {
            reasons: {
              COMMENT_REPORTED_OFFENSIVE: 3,
            },
          },
          reaction: {
            total: 0,
          },
        },
        metadata: {
          perspective: {
            score: 0.1,
          },
        },
        body: "Don't fool with me",
      },
      permalink: "http://localhost/comment/1",
      author: users.commenters[1],
      body: "Don't fool with me",
      flags: {
        edges: [
          {
            node: {
              id: "comment-1-flag-0",
              reason: GQLCOMMENT_FLAG_REASON.COMMENT_REPORTED_OFFENSIVE,
              flagger: users.commenters[0],
              additionalDetails: "I find this offensive",
            },
            cursor: "2021-06-01T14:21:21.890Z",
          },
          {
            node: {
              id: "comment-1-flag-1",
              reason: GQLCOMMENT_FLAG_REASON.COMMENT_REPORTED_OFFENSIVE,
              flagger: users.commenters[1],
              additionalDetails: "Not like that",
            },
            cursor: "2021-06-01T14:21:21.890Z",
          },
          {
            node: {
              id: "comment-1-flag-2",
              reason: GQLCOMMENT_FLAG_REASON.COMMENT_REPORTED_OFFENSIVE,
              flagger: users.commenters[2],
              additionalDetails: "",
            },
            cursor: "2021-06-01T14:21:21.890Z",
          },
        ],
        pageInfo: { endCursor: null, hasNextPage: false },
        nodes: [
          {
            id: "comment-1-flag-0",
            reason: GQLCOMMENT_FLAG_REASON.COMMENT_REPORTED_OFFENSIVE,
            flagger: users.commenters[0],
            additionalDetails: "I find this offensive",
          },
          {
            id: "comment-1-flag-1",
            reason: GQLCOMMENT_FLAG_REASON.COMMENT_REPORTED_OFFENSIVE,
            flagger: users.commenters[1],
            additionalDetails: "Not like that",
          },
          {
            id: "comment-1-flag-2",
            reason: GQLCOMMENT_FLAG_REASON.COMMENT_REPORTED_OFFENSIVE,
            flagger: users.commenters[2],
            additionalDetails: "",
          },
        ],
      },
    },
    {
      id: "comment-2",
      revision: {
        id: "comment-2-revision-2",
        actionCounts: {
          flag: {
            reasons: {
              COMMENT_REPORTED_SPAM: 1,
              COMMENT_REPORTED_OFFENSIVE: 1,
            },
          },
          reaction: {
            total: 0,
          },
        },
        metadata: {
          perspective: {
            score: 0.1,
          },
        },
        body: "I think I deserve better",
      },
      permalink: "http://localhost/comment/2",
      status: GQLCOMMENT_STATUS.PREMOD,
      author: users.commenters[2],
      body: "I think I deserve better",
      flags: {
        edges: [
          {
            node: {
              id: "comment-2-flag-0",
              reason: GQLCOMMENT_FLAG_REASON.COMMENT_REPORTED_OFFENSIVE,
              flagger: users.commenters[0],
              additionalDetails: "I find this offensive",
            },
            cursor: "2021-06-01T14:21:21.890Z",
          },
          {
            node: {
              id: "comment-2-flag-1",
              reason: GQLCOMMENT_FLAG_REASON.COMMENT_REPORTED_SPAM,
              flagger: users.commenters[2],
              additionalDetails: "",
            },
            cursor: "2021-06-01T14:21:21.890Z",
          },
        ],
        pageInfo: { endCursor: null, hasNextPage: false },
        nodes: [
          {
            id: "comment-2-flag-0",
            reason: GQLCOMMENT_FLAG_REASON.COMMENT_REPORTED_OFFENSIVE,
            flagger: users.commenters[0],
            additionalDetails: "I find this offensive",
          },
          {
            id: "comment-2-flag-1",
            reason: GQLCOMMENT_FLAG_REASON.COMMENT_REPORTED_SPAM,
            flagger: users.commenters[2],
            additionalDetails: "",
          },
        ],
      },
    },
    {
      id: "comment-3",
      revision: {
        id: "comment-3-revision-3",
        actionCounts: {
          flag: {
            reasons: {
              COMMENT_REPORTED_SPAM: 1,
            },
          },
          reaction: {
            total: 0,
          },
        },
        metadata: {
          perspective: {
            score: 0.1,
          },
        },
        body: "World peace at last",
      },
      permalink: "http://localhost/comment/3",
      status: GQLCOMMENT_STATUS.PREMOD,
      author: users.commenters[3],
      body: "World peace at last",
      flags: {
        edges: [
          {
            node: {
              id: "comment-3-flag-0",
              reason: GQLCOMMENT_FLAG_REASON.COMMENT_REPORTED_SPAM,
              flagger: users.commenters[2],
              additionalDetails: "",
            },
            cursor: "2021-06-01T14:21:21.890Z",
          },
        ],
        pageInfo: { endCursor: null, hasNextPage: false },
        nodes: [
          {
            id: "comment-3-flag-0",
            reason: GQLCOMMENT_FLAG_REASON.COMMENT_REPORTED_SPAM,
            flagger: users.commenters[2],
            additionalDetails: "",
          },
        ],
      },
    },
    {
      id: "comment-4",
      revision: {
        id: "comment-4-revision-4",
        actionCounts: {
          flag: {
            reasons: {
              COMMENT_REPORTED_SPAM: 1,
            },
          },
          reaction: {
            total: 0,
          },
        },
        metadata: {
          perspective: {
            score: 0.1,
          },
          wordList: {
            bannedWords: [
              { value: "bad", index: 33, length: 3 },
              { value: "bad", index: 54, length: 3 },
              { value: "bad", index: 62, length: 3 },
              { value: "bad", index: 71, length: 3 },
              { value: "bad", index: 75, length: 3 },
              { value: "bad", index: 88, length: 3 },
            ],
          },
        },
        body:
          "This is a very long comment with bad words. Let's try bad and bad. Now bad bad.\nBad BAD bad.\n",
      },
      permalink: "http://localhost/comment/4",
      status: GQLCOMMENT_STATUS.PREMOD,
      author: users.commenters[3],
      body:
        "This is a very long comment with bad words. Let's try bad and bad. Now bad bad.\nBad BAD bad.\n",
      flags: {
        edges: [
          {
            node: {
              id: "comment-4-flag-0",
              reason: GQLCOMMENT_FLAG_REASON.COMMENT_REPORTED_SPAM,
              flagger: users.commenters[2],
              additionalDetails: "",
            },
            cursor: "2021-06-01T14:21:21.890Z",
          },
        ],
        pageInfo: { endCursor: null, hasNextPage: false },
        nodes: [
          {
            id: "comment-4-flag-0",
            reason: GQLCOMMENT_FLAG_REASON.COMMENT_REPORTED_SPAM,
            flagger: users.commenters[2],
            additionalDetails: "",
          },
        ],
      },
    },
  ],
  baseComment
);

export const rejectedComments = reportedComments.map<GQLComment>((c) => ({
  ...c,
  status: GQLCOMMENT_STATUS.REJECTED,
}));

export const emptyModerationQueues = createFixture<GQLModerationQueues>({
  reported: {
    id: "reported",
    count: 0,
    comments: { edges: [], pageInfo: { endCursor: null, hasNextPage: false } },
  },
  pending: {
    id: "pending",
    count: 0,
    comments: { edges: [], pageInfo: { endCursor: null, hasNextPage: false } },
  },
  unmoderated: {
    id: "unmoderated",
    count: 0,
    comments: { edges: [], pageInfo: { endCursor: null, hasNextPage: false } },
  },
});

export const emptyRejectedComments = createFixture<GQLCommentsConnection>({
  edges: [],
  pageInfo: { endCursor: null, hasNextPage: false },
});

export const emptyFlags = createFixture<GQLFlagsConnection>({
  edges: [],
  pageInfo: { endCursor: null, hasNextPage: false },
});

export const commentFlags = createFixtures<GQLFlag>([
  {
    id: "comment-flag-1",
    createdAt: "2021-06-01T14:21:21.890Z",
    reason: GQLCOMMENT_FLAG_REASON.COMMENT_REPORTED_ABUSIVE,
    additionalDetails: "this is why",
    flagger: users.commenters[0],
    comment: reportedComments[0],
    revision: reportedComments[0].revision,
    reviewed: false,
  },
  {
    id: "comment-flag-2",
    createdAt: "2021-06-01T13:21:21.890Z",
    reason: GQLCOMMENT_FLAG_REASON.COMMENT_REPORTED_OFFENSIVE,
    additionalDetails: "I felt bad after reading this",
    flagger: users.commenters[1],
    comment: reportedComments[1],
    revision: reportedComments[1].revision,
    reviewed: false,
  },
  {
    id: "comment-flag-3",
    createdAt: "2021-06-01T11:21:21.890Z",
    reason: GQLCOMMENT_FLAG_REASON.COMMENT_REPORTED_SPAM,
    additionalDetails: "Looks like ads",
    flagger: users.commenters[2],
    comment: reportedComments[2],
    revision: reportedComments[2].revision,
    reviewed: false,
  },
]);

export const commentFlagsDeleted = createFixtures<GQLFlag>([
  {
    id: "comment-flag-deleted-1",
    createdAt: "2021-06-01T14:21:21.890Z",
    reason: GQLCOMMENT_FLAG_REASON.COMMENT_REPORTED_ABUSIVE,
    additionalDetails: "Looks abusive",
    flagger: users.commenters[0],
    comment: reportedComments[0],
    revision: undefined,
    reviewed: false,
  },
]);

export const commentFlagsReviewed = createFixtures<GQLFlag>([
  {
    id: "comment-flag-reviewed-1",
    createdAt: "2021-06-01T14:21:21.890Z",
    reason: GQLCOMMENT_FLAG_REASON.COMMENT_REPORTED_ABUSIVE,
    additionalDetails: "Looks abusive",
    flagger: users.commenters[0],
    comment: reportedComments[0],
    revision: reportedComments[1].revision,
    reviewed: true,
  },
]);

export const commentFlagsNoDetails = createFixtures<GQLFlag>([
  {
    id: "comment-flag-no-details-1",
    createdAt: "2021-06-01T14:21:21.890Z",
    reason: GQLCOMMENT_FLAG_REASON.COMMENT_REPORTED_ABUSIVE,
    additionalDetails: undefined,
    flagger: users.commenters[0],
    comment: reportedComments[0],
    revision: reportedComments[1].revision,
    reviewed: false,
  },
]);

export const communityUsers = createFixture<GQLUsersConnection>({
  edges: [
    { node: users.admins[0], cursor: users.admins[0].createdAt },
    { node: users.moderators[0], cursor: users.moderators[0].createdAt },
    { node: users.moderators[1], cursor: users.moderators[1].createdAt },
    { node: users.moderators[2], cursor: users.moderators[2].createdAt },
    { node: users.staff[0], cursor: users.staff[0].createdAt },
    { node: users.commenters[0], cursor: users.commenters[0].createdAt },
  ],
  pageInfo: { endCursor: null, hasNextPage: false },
});

export const emptyCommunityUsers = createFixture<GQLUsersConnection>({
  edges: [],
  pageInfo: { endCursor: null, hasNextPage: false },
});

export const disabledEmail = createFixture<GQLSettings>(
  pureMerge(settings, {
    email: {
      enabled: false,
    },
  })
);

export const disabledLocalAuth = createFixture<GQLSettings>(
  pureMerge(settings, {
    auth: {
      integrations: {
        local: {
          enabled: false,
        },
      },
    },
  })
);

export const disabledLocalAuthAdminTargetFilter = createFixture<GQLSettings>(
  pureMerge(settings, {
    auth: {
      integrations: {
        local: {
          targetFilter: {
            admin: false,
          },
        },
      },
    },
  })
);

export const disabledLocalRegistration = createFixture<GQLSettings>(
  pureMerge(settings, {
    auth: {
      integrations: {
        local: {
          allowRegistration: false,
        },
      },
    },
  })
);

export const siteConnection = createFixture<GQLSitesConnection>({
  edges: [
    { node: sites[0], cursor: sites[0].createdAt },
    { node: sites[1], cursor: sites[1].createdAt },
  ],
  pageInfo: { endCursor: null, hasNextPage: false },
});

export const emailDomain = createFixture({
  id: "1a60424a-c116-483a-b315-837a7fd5b496",
  domain: "email.com",
  newUserModeration: GQLNEW_USER_MODERATION.BAN,
});
