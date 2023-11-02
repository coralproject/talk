import { v4 as uuid } from "uuid";

import {
  GQLComment,
  GQLCOMMENT_STATUS,
  GQLMODERATION_MODE,
  GQLSettings,
  GQLSite,
  GQLStory,
  GQLSTORY_MODE,
  GQLUser,
  GQLUSER_ROLE,
  GQLUSER_STATUS,
  GQLUserStatus,
} from "coral-framework/schema";
import {
  createFixture,
  denormalizeComment,
  denormalizeStory,
} from "coral-framework/testHelpers";

// TODO (cvle) Temporary way to use `null` in fixtures as the gql types
// are incorrect by not including `null` as an allowed value.
// https://vmproduct.atlassian.net/browse/CORL-1377
export const NULL_VALUE: any = null;

export function createDateInRange(start: Date, end: Date) {
  return new Date(
    start.getTime() + Math.random() * (end.getTime() - start.getTime())
  );
}

export function randomDate() {
  return createDateInRange(new Date(2000, 0, 1), new Date());
}

export function createUserStatus(banned = false): GQLUserStatus {
  return {
    current: [banned ? GQLUSER_STATUS.BANNED : GQLUSER_STATUS.ACTIVE],
    ban: {
      active: banned,
      history: [],
      sites: [],
    },
    suspension: {
      active: false,
      until: null,
      history: [],
    },
    username: {
      history: [],
    },
    premod: {
      active: false,
      history: [],
    },
    warning: {
      active: false,
      history: [],
      message: NULL_VALUE,
    },
    modMessage: {
      active: false,
      history: [],
      message: NULL_VALUE,
    },
  };
}

export function createUser() {
  return createFixture<GQLUser>({
    id: uuid(),
    username: uuid(),
    role: GQLUSER_ROLE.COMMENTER,
    createdAt: randomDate().toISOString(),
    status: createUserStatus(),
    ignoredUsers: [],
    avatar: NULL_VALUE,
    mediaSettings: {
      unfurlEmbeds: false,
    },
    comments: {
      edges: [],
      pageInfo: {
        hasNextPage: false,
      },
    },
    ignoreable: true,
  });
}

export function createComment(
  data: {
    author?: GQLUser;
    story?: GQLStory;
    canModerate?: boolean;
    site?: GQLSite;
  } = {}
) {
  const revision = uuid();
  const createdAt = randomDate();
  const editableUntil = new Date(createdAt.getTime() + 30 * 60000);
  let author = data.author;
  if (!data.author) {
    author = createUser();
    author.createdAt = new Date(createdAt.getTime() - 60 * 60000).toISOString();
  }

  const comment = denormalizeComment(
    createFixture<GQLComment>({
      id: uuid(),
      author,
      body: uuid(),
      status: GQLCOMMENT_STATUS.NONE,
      deleted: NULL_VALUE,
      statusHistory: {
        edges: [],
        pageInfo: { endCursor: null, hasNextPage: false },
      },
      createdAt: createdAt.toISOString(),
      replies: { edges: [], pageInfo: { endCursor: null, hasNextPage: false } },
      replyCount: 0,
      editing: {
        edited: false,
        editableUntil: editableUntil.toISOString(),
      },
      actionCounts: {
        reaction: {
          total: 0,
        },
        flag: {
          reasons: {
            COMMENT_DETECTED_TOXIC: 0,
            COMMENT_DETECTED_SPAM: 0,
            COMMENT_DETECTED_RECENT_HISTORY: 0,
            COMMENT_DETECTED_LINKS: 0,
            COMMENT_DETECTED_BANNED_WORD: 0,
            COMMENT_DETECTED_SUSPECT_WORD: 0,
            COMMENT_REPORTED_OFFENSIVE: 0,
            COMMENT_REPORTED_ABUSIVE: 0,
            COMMENT_REPORTED_SPAM: 0,
            COMMENT_REPORTED_BIO: 0,
            COMMENT_DETECTED_NEW_COMMENTER: 0,
            COMMENT_DETECTED_REPEAT_POST: 0,
          },
        },
      },
      site: data.site || createSite(),
      tags: [],
      permalink: "",
      flags: {
        edges: [],
        nodes: [],
        pageInfo: {
          hasNextPage: false,
          hasPreviousPage: false,
        },
      },
      viewerActionPresence: {
        reaction: false,
        dontAgree: false,
        flag: false,
        illegal: false,
      },
      parent: NULL_VALUE,
      canModerate: !!data.canModerate,
      canReply: true,
      allChildComments: {
        edges: [],
        pageInfo: { endCursor: null, hasNextPage: false },
      },
    })
  );

  comment.story = data.story || createStory({ comments: [comment] });

  comment.revision = {
    id: revision,
    comment,
    metadata: {
      perspective: {
        score: 0,
      },
      wordList: {
        timedOut: false,
      },
    },
    media: NULL_VALUE,
    createdAt,
    actionCounts: {
      reaction: {
        total: 0,
      },
      dontAgree: {
        total: 0,
      },
      illegal: {
        total: 0,
      },
      flag: {
        total: 0,
        reasons: {
          COMMENT_REPORTED_OFFENSIVE: 0,
          COMMENT_REPORTED_ABUSIVE: 0,
          COMMENT_REPORTED_SPAM: 0,
          COMMENT_REPORTED_OTHER: 0,
          COMMENT_REPORTED_BIO: 0,
          COMMENT_DETECTED_TOXIC: 0,
          COMMENT_DETECTED_SPAM: 0,
          COMMENT_DETECTED_RECENT_HISTORY: 0,
          COMMENT_DETECTED_LINKS: 0,
          COMMENT_DETECTED_BANNED_WORD: 0,
          COMMENT_DETECTED_SUSPECT_WORD: 0,
          COMMENT_DETECTED_PREMOD_USER: 0,
          COMMENT_DETECTED_NEW_COMMENTER: 0,
          COMMENT_DETECTED_REPEAT_POST: 0,
        },
      },
    },
    body: comment.body,
  };

  comment.revisionHistory = [comment.revision];

  return comment;
}

export function createComments(count: number) {
  const comments = [];
  for (let i = 0; i < count; i++) {
    comments.push(createComment());
  }

  return comments;
}

export function createStory(
  data: { comments?: GQLComment[]; site?: GQLSite } = {}
) {
  const id = uuid();
  const comments = data.comments || [];

  comments.forEach((c) => {
    const edges = [{ node: c, cursor: c.createdAt }];
    c.author!.comments = {
      edges,
      nodes: [c],
      pageInfo: {
        hasPreviousPage: false,
        hasNextPage: false,
        startCursor: null,
        endCursor: null,
      },
    };
    c.author!.allComments = {
      edges,
      nodes: [c],
      pageInfo: {
        hasPreviousPage: false,
        hasNextPage: false,
        startCursor: null,
        endCursor: null,
      },
    };
    c.author!.rejectedComments = {
      edges,
      nodes: [c],
      pageInfo: {
        hasPreviousPage: false,
        hasNextPage: false,
        startCursor: null,
        endCursor: null,
      },
    };
  });

  return denormalizeStory(
    createFixture<GQLStory>({
      id,
      url: `http://localhost/stories/story-${id}`,
      comments: {
        edges: comments.map((c) => ({ node: c, cursor: c.createdAt })),
        pageInfo: {
          hasNextPage: false,
        },
      },
      metadata: {
        title: uuid(),
      },
      canModerate: true,
      isClosed: false,
      isArchived: false,
      isArchiving: false,
      commentCounts: {
        totalPublished: 0,
        tags: {
          FEATURED: 0,
          UNANSWERED: 0,
          QUESTION: 0,
          REVIEW: 0,
        },
      },
      site: data.site || createSite(),
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
    })
  );
}

export function createSite() {
  const id = uuid();
  return createFixture<GQLSite>({
    id,
    name: `Site ${id}`,
  });
}

export function createSettings(): GQLSettings {
  return createFixture<GQLSettings>({
    id: "settings",
    moderation: GQLMODERATION_MODE.POST,
    premodLinksEnable: false,
    featureFlags: [],
    reaction: {
      icon: "test-reaction-icon",
      iconActive: "test-reaction-icon-active",
      label: "test-reaction-label",
      labelActive: "test-reaction-label-active",
      color: "test-reaction-color",
      sortLabel: "test-reaction-sort-label",
    },
    live: {
      enabled: true,
      configurable: true,
    },
    memberBios: false,
    wordList: {
      suspect: ["suspect"],
      banned: ["banned"],
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
    email: {
      enabled: true,
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
    integrations: {
      akismet: {
        enabled: false,
        ipBased: false,
      },
      perspective: {
        enabled: false,
      },
    },
    newCommenters: {
      premodEnabled: false,
      approvedCommentsThreshold: 2,
    },
    premoderateSuspectWords: false,
    flattenReplies: false,
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
}
