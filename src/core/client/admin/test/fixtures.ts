import {
  GQLComment,
  GQLCOMMENT_STATUS,
  GQLCommentModerationAction,
  GQLCommentsConnection,
  GQLMODERATION_MODE,
  GQLModerationQueues,
  GQLSettings,
  GQLStoriesConnection,
  GQLStory,
  GQLSTORY_STATUS,
  GQLUser,
  GQLUSER_ROLE,
  GQLUSER_STATUS,
  GQLUsersConnection,
} from "talk-framework/schema";
import { createFixture, createFixtures } from "talk-framework/testHelpers";

export const settings = createFixture<GQLSettings>({
  id: "settings",
  moderation: GQLMODERATION_MODE.POST,
  premodLinksEnable: false,
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
  customCSSURL: "",
  domains: ["localhost:8080"],
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
  integrations: {
    akismet: {
      enabled: false,
    },
    perspective: {
      enabled: false,
    },
  },
  auth: {
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
});

export const settingsWithEmptyAuth = createFixture<GQLSettings>(
  {
    id: "settings",
    auth: {
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
    status: GQLCOMMENT_STATUS.ACCEPTED,
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
    status: GQLCOMMENT_STATUS.ACCEPTED,
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
    status: GQLCOMMENT_STATUS.ACCEPTED,
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
  },
});

export const users = {
  admins: createFixtures<GQLUser>(
    [
      {
        id: "user-admin-0",
        username: "Markus",
        email: "markus@test.com",
        role: GQLUSER_ROLE.ADMIN,
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
      },
      {
        id: "user-commenter-1",
        username: "Ngoc",
        email: "ngoc@test.com",
        role: GQLUSER_ROLE.COMMENTER,
      },
      {
        id: "user-commenter-2",
        username: "Max",
        email: "max@test.com",
        role: GQLUSER_ROLE.COMMENTER,
      },
    ],
    baseUser
  ),
  bannedCommenter: createFixture<GQLUser>(
    {
      id: "user-banned-0",
      username: "Ingrid",
      email: "ingrid@test.com",
      role: GQLUSER_ROLE.COMMENTER,
      status: {
        current: [GQLUSER_STATUS.BANNED],
        ban: { active: true },
        suspension: { active: true },
      },
    },
    baseUser
  ),
};

export const baseComment = createFixture<GQLComment>({
  author: users.commenters[0],
  body: "Comment Body",
  createdAt: "2018-07-06T18:24:00.000Z",
  status: GQLCOMMENT_STATUS.NONE,
  actionCounts: {
    flag: {
      reasons: {
        COMMENT_DETECTED_TOXIC: 0,
        COMMENT_DETECTED_SPAM: 0,
        COMMENT_DETECTED_TRUST: 0,
        COMMENT_DETECTED_LINKS: 0,
        COMMENT_DETECTED_BANNED_WORD: 0,
        COMMENT_DETECTED_SUSPECT_WORD: 0,
        COMMENT_REPORTED_OFFENSIVE: 0,
        COMMENT_REPORTED_SPAM: 0,
      },
    },
  },
});

export const reportedComments = createFixtures<GQLComment>(
  [
    {
      id: "comment-0",
      author: users.commenters[0],
      revision: {
        id: "comment-0-revision-0",
      },
      permalink: "http://localhost/comment/0",
      body:
        "This is the last random sentence I will be writing and I am going to stop mid-sent",
      actionCounts: {
        flag: {
          reasons: {
            COMMENT_REPORTED_SPAM: 2,
          },
        },
      },
    },
    {
      id: "comment-1",
      revision: {
        id: "comment-1-revision-1",
      },
      permalink: "http://localhost/comment/1",
      author: users.commenters[1],
      body: "Don't fool with me",
      actionCounts: {
        flag: {
          reasons: {
            COMMENT_REPORTED_OFFENSIVE: 3,
          },
        },
      },
    },
    {
      id: "comment-2",
      revision: {
        id: "comment-2-revision-2",
      },
      permalink: "http://localhost/comment/2",
      status: GQLCOMMENT_STATUS.PREMOD,
      author: users.commenters[2],
      body: "I think I deserve better",
      actionCounts: {
        flag: {
          reasons: {
            COMMENT_REPORTED_SPAM: 1,
            COMMENT_REPORTED_OFFENSIVE: 1,
          },
        },
      },
    },
  ],
  baseComment
);

export const rejectedComments = reportedComments.map<GQLComment>(c => ({
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

export const stories = createFixtures<GQLStory>([
  {
    id: "story-1",
    closedAt: null,
    isClosed: false,
    status: GQLSTORY_STATUS.OPEN,
    createdAt: "2018-11-29T16:01:51.897Z",
    metadata: {
      author: "Vin Hoa",
      title: "Finally a Cure for Cancer",
      publishedAt: "2018-11-29T16:01:51.897Z",
    },
  },
  {
    id: "story-2",
    closedAt: null,
    isClosed: false,
    status: GQLSTORY_STATUS.OPEN,
    createdAt: "2018-11-29T16:01:51.897Z",
    metadata: {
      author: "Linh Nguyen",
      title: "First Colony on Mars",
      publishedAt: "2018-11-29T16:01:51.897Z",
    },
  },
  {
    id: "story-3",
    closedAt: "2018-11-29T16:01:51.897Z",
    createdAt: "2018-11-29T16:01:51.897Z",
    isClosed: true,
    status: GQLSTORY_STATUS.CLOSED,
    metadata: {
      author: undefined,
      title: "World hunger has been defeated",
      publishedAt: "2018-11-29T16:01:51.897Z",
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
