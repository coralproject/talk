import {
  DEFAULT_SESSION_DURATION,
  TOXICITY_THRESHOLD_DEFAULT,
} from "coral-common/constants";
import TIME from "coral-common/time";
import { pureMerge } from "coral-common/utils";
import { createFixture, createFixtures } from "coral-framework/testHelpers";
import {
  GQLComment,
  GQLCOMMENT_FLAG_REASON,
  GQLCOMMENT_STATUS,
  GQLCommentModerationAction,
  GQLCommentsConnection,
  GQLMODERATION_MODE,
  GQLModerationQueues,
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
} from "coral-framework/testHelpers/schema";
import { NULL_VALUE } from "coral-test/helpers/fixture";

export const settings = createFixture<GQLSettings>({
  id: "settings",
  moderation: GQLMODERATION_MODE.POST,
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
  staff: {
    label: "Staff",
    staffLabel: "Staff",
    moderatorLabel: "Staff",
    adminLabel: "Staff",
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
});

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
    revision: {
      id: "4210dc8b-c212-4f74-9381-913e8c52e51a",
      comment: {
        author: {
          username: "luke2",
          id: "4383c3d3-bb9b-40b9-847a-240f3cf6c6af",
        },
        id: "1b41be9f-510f-41f3-a1df-5a431dc98bf3",
      },
    },
    createdAt: "2018-11-29T16:01:51.897Z",
    status: GQLCOMMENT_STATUS.APPROVED,
    __typename: "CommentModerationAction",
  },
  {
    id: "6869314b-47ef-4cf9-b8ce-42b12bca8231",
    revision: {
      id: "4210dc8b-c212-4f74-9381-913e8c52e51a",
      comment: {
        author: {
          username: "addy",
          id: "4383c3d3-bb9b-40b9-847a-240f3cf6c6af",
        },
        id: "1b41be9f-510f-41f3-a1df-5a431dc98bf3",
      },
    },
    createdAt: "2018-11-29T16:01:45.644Z",
    status: GQLCOMMENT_STATUS.REJECTED,
    __typename: "CommentModerationAction",
  },
  {
    id: "caebbf7f-4813-42c0-ac3c-46b1be8199e0",
    revision: {
      id: "4210dc8b-c212-4f74-9381-913e8c52e51a",
      comment: {
        author: {
          username: "dany",
          id: "4383c3d3-bb9b-40b9-847a-240f3cf6c6af",
        },
        id: "1b41be9f-510f-41f3-a1df-5a431dc98bf3",
      },
    },
    createdAt: "2018-11-29T16:01:42.060Z",
    status: GQLCOMMENT_STATUS.APPROVED,
    __typename: "CommentModerationAction",
  },
  {
    id: "b2f92717-e4a8-4075-a543-95f7c5eaefb2",
    revision: {
      id: "4210dc8b-c212-4f74-9381-913e8c52e51a",
      comment: {
        author: {
          username: "admin",
          id: "4383c3d3-bb9b-40b9-847a-240f3cf6c6af",
        },
        id: "1b41be9f-510f-41f3-a1df-5a431dc98bf3",
      },
    },
    createdAt: "2018-11-29T16:01:34.539Z",
    status: GQLCOMMENT_STATUS.REJECTED,
    __typename: "CommentModerationAction",
  },
  {
    id: "9fb2ff3c-7105-4357-99e1-36cdeea49c75",
    revision: {
      id: "4210dc8b-c212-4f74-9381-913e8c52e51a",
      comment: {
        author: {
          username: "mod245",
          id: "4383c3d3-bb9b-40b9-847a-240f3cf6c6af",
        },
        id: "1b41be9f-510f-41f3-a1df-5a431dc98bf3",
      },
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
      },
      {
        id: "user-commenter-1",
        username: "Ngoc",
        email: "ngoc@test.com",
        role: GQLUSER_ROLE.COMMENTER,
        ignoreable: true,
        recentCommentHistory,
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
};

export const stories = createFixtures<GQLStory>([
  {
    id: "story-1",
    closedAt: null,
    isClosed: false,
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
    },
  },
  {
    id: "story-3",
    closedAt: "2018-11-29T16:01:51.897Z",
    createdAt: "2018-11-29T16:01:51.897Z",
    isClosed: true,
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
    },
    metadata: {
      perspective: NULL_VALUE,
      wordList: NULL_VALUE,
    },
  },
  flags: {
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
        },
        metadata: {
          perspective: {
            score: 0.1,
          },
        },
      },
      permalink: "http://localhost/comment/0",
      body:
        "This is the last random sentence I will be writing and I am going to stop mid-sent",
      flags: {
        nodes: [
          {
            reason: GQLCOMMENT_FLAG_REASON.COMMENT_REPORTED_SPAM,
            flagger: users.commenters[0],
            additionalDetails: "This looks like an ad",
          },
          {
            reason: GQLCOMMENT_FLAG_REASON.COMMENT_REPORTED_SPAM,
            flagger: users.commenters[1],
            additionalDetails: "",
          },
        ],
      },
    },
    {
      id: "comment-1",
      revision: {
        id: "comment-1-revision-1",
        actionCounts: {
          flag: {
            reasons: {
              COMMENT_REPORTED_OFFENSIVE: 3,
            },
          },
        },
        metadata: {
          perspective: {
            score: 0.1,
          },
        },
      },
      permalink: "http://localhost/comment/1",
      author: users.commenters[1],
      body: "Don't fool with me",
      flags: {
        nodes: [
          {
            reason: GQLCOMMENT_FLAG_REASON.COMMENT_REPORTED_OFFENSIVE,
            flagger: users.commenters[0],
            additionalDetails: "I find this offensive",
          },
          {
            reason: GQLCOMMENT_FLAG_REASON.COMMENT_REPORTED_OFFENSIVE,
            flagger: users.commenters[1],
            additionalDetails: "Not like that",
          },
          {
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
        },
        metadata: {
          perspective: {
            score: 0.1,
          },
        },
      },
      permalink: "http://localhost/comment/2",
      status: GQLCOMMENT_STATUS.PREMOD,
      author: users.commenters[2],
      body: "I think I deserve better",
      flags: {
        nodes: [
          {
            reason: GQLCOMMENT_FLAG_REASON.COMMENT_REPORTED_OFFENSIVE,
            flagger: users.commenters[0],
            additionalDetails: "I find this offensive",
          },
          {
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
        },
        metadata: {
          perspective: {
            score: 0.1,
          },
        },
      },
      permalink: "http://localhost/comment/3",
      status: GQLCOMMENT_STATUS.PREMOD,
      author: users.commenters[3],
      body: "World peace at last",
      flags: {
        nodes: [
          {
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

export const communityUsers = createFixture<GQLUsersConnection>({
  edges: [
    { node: users.admins[0], cursor: users.admins[0].createdAt },
    { node: users.moderators[0], cursor: users.moderators[0].createdAt },
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
