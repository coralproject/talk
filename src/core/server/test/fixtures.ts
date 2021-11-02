import { v4 as uuid } from "uuid";

import TIME from "coral-common/time";
import {
  GQLCOMMENT_STATUS,
  GQLDIGEST_FREQUENCY,
  GQLMODERATION_MODE,
  GQLUSER_ROLE,
} from "coral-server/graph/schema/__generated__/types";
import { Site } from "coral-server/models/site";
import { Story } from "coral-server/models/story";
import { Tenant } from "coral-server/models/tenant";
import { Token, User } from "coral-server/models/user";

export const createTenantFixture = (): Tenant => {
  const now = new Date();
  return {
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
    staff: {
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
  };
};

export interface CreateTokenFixtureInput {
  name?: string;
}

export const createTokenFixture = (
  input: CreateUserFixtureInput = {}
): Token => ({
  id: uuid(),
  name: input.name || "test-token",
  createdAt: new Date(),
});

export interface CreateUserFixtureInput {
  name?: string;
  tenantID?: string;
}

export const createUserFixture = (input: CreateUserFixtureInput = {}): User => {
  const { name, tenantID } = { name: "test-user", tenantID: uuid(), ...input };
  const id = uuid();
  return {
    id,
    tenantID,
    username: name,
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
            username: name,
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
};

export interface CreateSiteFixtureInput {
  name?: string;
  tenantID?: string;
}

export const createSiteFixture = (input: CreateUserFixtureInput = {}): Site => {
  const { tenantID, name } = { tenantID: uuid(), name: "test-site", ...input };

  return {
    id: uuid(),
    tenantID,
    name,
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
};

export const createStoryFixture = (
  siteID = uuid(),
  tenantID = uuid()
): Story => {
  return {
    id: uuid(),
    url: "https://www.site.com/story",
    siteID,
    tenantID,
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
};
