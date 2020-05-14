import { v4 as uuid } from "uuid";

import {
  GQLComment,
  GQLCOMMENT_STATUS,
  GQLMODERATION_MODE,
  GQLSettings,
  GQLStory,
  GQLUser,
  GQLUSER_ROLE,
  GQLUSER_STATUS,
} from "coral-framework/schema";
import {
  createFixture,
  denormalizeComment,
  denormalizeStory,
} from "coral-framework/testHelpers";

// TODO: Look into a date/time provider that can create
// predictable date/time (i.e. constantly increasing, or seeded)
export function createDateInRange(start: Date, end: Date) {
  return new Date(
    start.getTime() + Math.random() * (end.getTime() - start.getTime())
  );
}

export function randomDate() {
  return createDateInRange(new Date(2000, 0, 1), new Date());
}

export function createUserStatus(banned = false) {
  return {
    current: [banned ? GQLUSER_STATUS.BANNED : GQLUSER_STATUS.ACTIVE],
    ban: {
      active: banned,
      history: [],
    },
    suspension: {
      active: false,
      until: null,
      history: [],
    },
    premod: {
      active: false,
      history: [],
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
    ignoreable: true,
  });
}

export function createComment(author?: GQLUser) {
  const revision = uuid();
  const createdAt = randomDate();
  const editableUntil = new Date(createdAt.getTime() + 30 * 60000);

  if (author === undefined) {
    author = createUser();
    author.createdAt = new Date(createdAt.getTime() - 60 * 60000).toISOString();
  }

  const comment = denormalizeComment(
    createFixture<GQLComment>({
      id: uuid(),
      author,
      body: uuid(),
      status: GQLCOMMENT_STATUS.NONE,
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
            COMMENT_DETECTED_NEW_COMMENTER: 0,
            COMMENT_DETECTED_REPEAT_POST: 0,
          },
        },
      },
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
      viewerActionPresence: { reaction: false, dontAgree: false, flag: false },
      parent: undefined,
    })
  );

  comment.revision = {
    id: revision,
    comment,
    metadata: {
      perspective: {
        score: 0,
      },
    },
    createdAt,
    actionCounts: {
      reaction: {
        total: 0,
      },
      dontAgree: {
        total: 0,
      },
      flag: {
        total: 0,
        reasons: {
          COMMENT_REPORTED_OFFENSIVE: 0,
          COMMENT_REPORTED_ABUSIVE: 0,
          COMMENT_REPORTED_SPAM: 0,
          COMMENT_REPORTED_OTHER: 0,
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
  };

  return comment;
}

export function createComments(count = 3) {
  const comments = [];
  for (let i = 0; i < count; i++) {
    comments.push(createComment());
  }

  return comments;
}

export function createStory() {
  const id = uuid();
  const comments = createComments();
  comments.forEach((c) => {
    const edges = [{ node: c, cursor: c.createdAt }];
    c.author!.comments = {
      edges,
      nodes: [c],
      pageInfo: {
        hasPreviousPage: false,
        hasNextPage: false,
      },
    };
    c.author!.allComments = {
      edges,
      nodes: [c],
      pageInfo: {
        hasPreviousPage: false,
        hasNextPage: false,
      },
    };
    c.author!.rejectedComments = {
      edges,
      nodes: [c],
      pageInfo: {
        hasPreviousPage: false,
        hasNextPage: false,
      },
    };
  });

  const story = denormalizeStory(
    createFixture<GQLStory>({
      id,
      url: `http://localhost/stories/story-${id}`,
      comments: {
        edges: [
          { node: comments[0], cursor: comments[0].createdAt },
          { node: comments[1], cursor: comments[1].createdAt },
          { node: comments[2], cursor: comments[2].createdAt },
        ],
        pageInfo: {
          hasNextPage: false,
        },
      },
      metadata: {
        title: uuid(),
      },
      isClosed: false,
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
      },
    })
  );

  comments.forEach((c) => (c.story = story));

  return story;
}

export function createSettings() {
  return createFixture<GQLSettings>({
    id: "settings",
    moderation: GQLMODERATION_MODE.POST,
    premodLinksEnable: false,
    live: {
      enabled: true,
      configurable: true,
    },
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
      },
      perspective: {
        enabled: false,
      },
    },
    newCommenters: {
      premodEnabled: false,
      approvedCommentsThreshold: 2,
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
}
