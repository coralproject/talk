import { v4 as uuid } from "uuid";

import {
  GQLComment,
  GQLCOMMENT_STATUS,
  GQLMODERATION_MODE,
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
    comments: {
      edges: [],
      pageInfo: {
        hasNextPage: false,
      },
    },
    ignoreable: true,
  });
}

export function createComment() {
  const revision = uuid();
  const createdAt = randomDate();
  const editableUntil = new Date(createdAt.getTime() + 30 * 60000);
  const author = createUser();
  author.createdAt = new Date(createdAt.getTime() - 60 * 60000).toISOString();

  return denormalizeComment(
    createFixture<GQLComment>({
      id: uuid(),
      author,
      body: uuid(),
      revision: {
        id: revision,
      },
      status: GQLCOMMENT_STATUS.NONE,
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
      },
      tags: [],
    })
  );
}

export function createStory(createComments = true) {
  const id = uuid();
  const comments = [createComment(), createComment()];

  return denormalizeStory(
    createFixture<GQLStory>({
      id,
      url: `http://localhost/stories/story-${id}`,
      comments: {
        edges: [
          { node: comments[0], cursor: comments[0].createdAt },
          { node: comments[1], cursor: comments[1].createdAt },
        ],
        pageInfo: {
          hasNextPage: false,
        },
      },
      metadata: {
        title: uuid(),
      },
      canModerate: true,
      isClosed: false,
      commentCounts: {
        totalPublished: 0,
        tags: {
          FEATURED: 0,
          UNANSWERED: 0,
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
    })
  );
}
