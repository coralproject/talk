import { merge } from "lodash";
import { v4 as uuid } from "uuid";

import TIME from "coral-common/common/lib/time";
import { Comment } from "coral-server/models/comment";
import { Site } from "coral-server/models/site";
import { Story } from "coral-server/models/story";
import { Tenant } from "coral-server/models/tenant";
import { Token, User } from "coral-server/models/user";

import {
  GQLCOMMENT_STATUS,
  GQLDIGEST_FREQUENCY,
  GQLDSA_METHOD_OF_REDRESS,
  GQLMODERATION_MODE,
  GQLUSER_ROLE,
} from "coral-server/graph/schema/__generated__/types";

type Defaults<T> = {
  [P in keyof T]?: T[P] extends Array<infer U>
    ? Array<Defaults<U>>
    : T[P] extends object
    ? Defaults<T[P]>
    : T[P];
};

export const createTenantFixture = (
  defaults: Defaults<Tenant> = {}
): Tenant => {
  const now = new Date();
  const fixture = {
    // Create a new ID.
    id: uuid(),
    locale: "en-US",
    domain: "test-domain",
    organization: {
      name: "test-org",
      contactEmail: "test@org.org",
      url: "https://www.org.org",
    },
    moderation: GQLMODERATION_MODE.POST,
    premoderateAllCommentsSites: [],

    // Default to enabled.
    live: {
      enabled: true,
    },

    communityGuidelines: {
      enabled: false,
      content: "",
    },
    premodLinksEnable: false,
    closeCommenting: {
      auto: false,
      timeout: 2 * TIME.WEEK,
    },
    disableCommenting: {
      enabled: false,
    },
    editCommentWindowLength: 30 * TIME.SECOND,
    webhooks: {
      endpoints: [],
    },
    charCount: {
      enabled: false,
    },
    wordList: {
      suspect: [],
      banned: [],
    },
    auth: {
      sessionDuration: 30 * TIME.MINUTE,
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
          allowRegistration: false,
          targetFilter: {
            admin: true,
            stream: true,
          },
          // TODO: [CORL-754] (wyattjoh) remove this in favor of generating this when needed
          signingSecrets: [],
        },
        oidc: {
          enabled: false,
          allowRegistration: false,
          targetFilter: {
            admin: true,
            stream: true,
          },
        },
        google: {
          enabled: false,
          allowRegistration: false,
          targetFilter: {
            admin: true,
            stream: true,
          },
        },
        facebook: {
          enabled: false,
          allowRegistration: false,
          targetFilter: {
            admin: true,
            stream: true,
          },
        },
      },
    },
    email: {
      enabled: false,
      smtp: {},
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
        doNotStore: true,
        sendFeedback: false,
      },
    },
    reaction: {
      label: "Respect",
      labelActive: "Respected",
      sortLabel: "Most Respected",
      icon: "thumbs_up",
    },
    badges: {
      label: "Staff",
      adminLabel: "Staff",
      staffLabel: "Staff",
      moderatorLabel: "Staff",
    },
    stories: {
      scraping: {
        enabled: true,
        authentication: false,
      },
      disableLazy: false,
    },
    accountFeatures: {
      changeUsername: false,
      deleteAccount: false,
      downloadComments: false,
    },
    newCommenters: {
      premodEnabled: false,
      approvedCommentsThreshold: 2,
      moderation: {
        mode: "POST",
        premodSites: [],
      },
    },
    premoderateSuspectWords: false,
    createdAt: now,
    slack: {
      channels: [],
    },
    memberBios: false,
    rte: {
      enabled: true,
      spoiler: false,
      strikethrough: false,
    },
    amp: false,
    flattenReplies: false,
    disableDefaultFonts: false,
    emailDomainModeration: [],
    dsa: {
      enabled: false,
      methodOfRedress: {
        method: GQLDSA_METHOD_OF_REDRESS.NONE,
      },
    },
    embeddedComments: {
      allowReplies: true,
      oEmbedAllowedOrigins: [],
    },
  };

  return merge(fixture, defaults);
};

export const createTokenFixture = (defaults: Defaults<Token> = {}): Token => ({
  id: uuid(),
  name: "test-token",
  createdAt: new Date(),
});

export const createUserFixture = (defaults: Defaults<User> = {}): User => {
  const id = uuid();
  const fixture = {
    id,
    tenantID: uuid(),
    username: "test-user",
    avatar: "ovuupi cabka",
    email: "piwdengoc@vewapi.st",
    badges: [],
    ssoURL: "hip ebovof",
    emailVerificationID: "vujbo@tamzo.gp",
    emailVerified: false,
    duplicateEmail: "fukalzuc@noruc.mm",
    profiles: [
      {
        type: "local",
        id: uuid(),
        password: "hashed-password",
        passwordID: uuid(),
      },
    ],
    tokens: [createTokenFixture()],
    role: GQLUSER_ROLE.COMMENTER,
    moderationScopes: {},
    notifications: {
      onReply: false,
      onFeatured: false,
      onModeration: false,
      onStaffReplies: false,
      digestFrequency: GQLDIGEST_FREQUENCY.NONE,
    },
    digests: [],
    hasDigests: false,
    status: {
      suspension: {
        history: [],
      },
      ban: {
        active: false,
        siteIDs: [],
        history: [],
      },
      username: {
        history: [
          {
            id: uuid(),
            username: "test-user",
            createdAt: new Date(),
            createdBy: id,
          },
        ],
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
    ignoredUsers: [],
    moderatorNotes: [],
    createdAt: new Date(),
    commentCounts: {
      status: {
        [GQLCOMMENT_STATUS.APPROVED]: 0,
        [GQLCOMMENT_STATUS.NONE]: 0,
        [GQLCOMMENT_STATUS.PREMOD]: 0,
        [GQLCOMMENT_STATUS.REJECTED]: 0,
        [GQLCOMMENT_STATUS.SYSTEM_WITHHELD]: 0,
      },
    },
    bio: "essavta da",
  };

  return merge(fixture, defaults);
};

export const createSiteFixture = (defaults: Defaults<Site> = {}): Site => {
  const fixture = {
    id: uuid(),
    tenantID: uuid(),
    name: "test-site",
    allowedOrigins: [],
    commentCounts: {
      action: {},
      status: {
        [GQLCOMMENT_STATUS.APPROVED]: 0,
        [GQLCOMMENT_STATUS.NONE]: 0,
        [GQLCOMMENT_STATUS.PREMOD]: 0,
        [GQLCOMMENT_STATUS.REJECTED]: 0,
        [GQLCOMMENT_STATUS.SYSTEM_WITHHELD]: 0,
      },
      moderationQueue: {
        total: 0,
        queues: {
          unmoderated: 0,
          pending: 0,
          reported: 0,
        },
      },
    },
    createdAt: new Date(),
  };

  return merge(fixture, defaults) as Site;
};

export const createStoryFixture = (defaults: Defaults<Story> = {}): Story => {
  const fixture = {
    id: uuid(),
    url: "https://www.site.com/story",
    siteID: uuid(),
    tenantID: uuid(),
    commentCounts: {
      action: {},
      status: {
        [GQLCOMMENT_STATUS.APPROVED]: 0,
        [GQLCOMMENT_STATUS.NONE]: 0,
        [GQLCOMMENT_STATUS.PREMOD]: 0,
        [GQLCOMMENT_STATUS.REJECTED]: 0,
        [GQLCOMMENT_STATUS.SYSTEM_WITHHELD]: 0,
      },
      moderationQueue: {
        total: 0,
        queues: {
          unmoderated: 0,
          pending: 0,
          reported: 0,
        },
      },
    },
    createdAt: new Date(),
    settings: {},
  };

  return merge(fixture, defaults) as Story;
};

export const createCommentFixture = (
  defaults: Defaults<Comment> = {}
): Comment => {
  const comment: Comment = {
    tenantID: uuid(),
    id: uuid(),
    authorID: uuid(),
    storyID: uuid(),
    siteID: uuid(),
    ancestorIDs: [],
    parentID: undefined,
    status: GQLCOMMENT_STATUS.NONE,
    revisions: [
      {
        id: uuid(),
        body: `body ${uuid()}`,
        actionCounts: {},
        metadata: {},
        createdAt: new Date(),
      },
    ],
    actionCounts: {},
    childCount: 0,
    childIDs: [],
    tags: [],
    createdAt: new Date(),
  };

  return merge(comment, defaults) as Comment;
};
