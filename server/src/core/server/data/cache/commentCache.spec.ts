import { waitFor } from "coral-common/common/lib/helpers";
import { CommentCache } from "coral-server/data/cache/commentCache";
import { UnableToPrimeCachedCommentsForStory } from "coral-server/errors";
import logger from "coral-server/logger";
import { Comment } from "coral-server/models/comment";
import {
  createCommentFixture,
  createStoryFixture,
} from "coral-server/test/fixtures";

import { GQLCOMMENT_SORT } from "coral-server/graph/schema/__generated__/types";
import {
  createTestMongoContext,
  createTestRedis,
} from "coral-server/test/helpers";

interface FixtureOptions {
  expirySeconds?: number;
}

const createFixtures = async (
  options: FixtureOptions = { expirySeconds: 5 * 60 }
) => {
  const redis = await createTestRedis();
  const mongo = await createTestMongoContext();

  const commentCache = new CommentCache(
    mongo,
    redis,
    null,
    logger,
    false,
    options?.expirySeconds ? options.expirySeconds : 5 * 60
  );

  return {
    redis,
    mongo,
    cache: {
      comments: commentCache,
    },
  };
};

it("can load root comments from commentCache", async () => {
  const {
    cache: { comments },
    redis,
    mongo,
  } = await createFixtures();

  const story = createStoryFixture();
  const storyComments: Comment[] = [];
  for (let i = 0; i < 3; i++) {
    storyComments.push(
      createCommentFixture({ storyID: story.id, tenantID: story.tenantID })
    );
  }

  await mongo.stories().insertOne(story);
  await mongo.comments().insertMany(storyComments);

  const now = new Date();
  await comments.populateCommentsInCache(story.tenantID, story.id, false, now);
  const primeResult = await comments.primeCommentsForStory(
    story.tenantID,
    story.id,
    false
  );
  if (!primeResult) {
    throw new UnableToPrimeCachedCommentsForStory(story.tenantID, story.id);
  }

  const results = await comments.rootComments(
    story.tenantID,
    story.id,
    false,
    GQLCOMMENT_SORT.CREATED_AT_DESC
  );

  expect(primeResult.retrievedFrom).toEqual("redis");
  storyComments.forEach((c) => {
    const found = results.nodes.find((r) => r.id === c.id);
    expect(found.id).toBeDefined();
  });

  // clean up
  await redis.flushall();
  await mongo.stories().deleteOne({ tenantID: story.tenantID, id: story.id });
  await mongo
    .comments()
    .deleteMany({ tenantID: story.tenantID, storyID: story.id });
});

it("can load replies from commentCache", async () => {
  const {
    cache: { comments },
    redis,
    mongo,
  } = await createFixtures();

  const story = createStoryFixture();

  const rootComment = createCommentFixture({
    storyID: story.id,
    tenantID: story.tenantID,
  });

  const replies: Comment[] = [];
  for (let i = 0; i < 3; i++) {
    const reply = createCommentFixture({
      storyID: story.id,
      tenantID: story.tenantID,
      parentID: rootComment.id,
      ancestorIDs: [rootComment.id],
    });
    replies.push(reply);
  }

  rootComment.childCount = replies.length;
  rootComment.childIDs = replies.map((r) => r.id);

  await mongo.stories().insertOne(story);
  await mongo.comments().insertOne(rootComment);
  await mongo.comments().insertMany(replies);

  const now = new Date();
  await comments.populateCommentsInCache(story.tenantID, story.id, false, now);
  const primeResult = await comments.primeCommentsForStory(
    story.tenantID,
    story.id,
    false
  );
  if (!primeResult) {
    throw new UnableToPrimeCachedCommentsForStory(story.tenantID, story.id);
  }

  const rootResults = await comments.rootComments(
    story.tenantID,
    story.id,
    false,
    GQLCOMMENT_SORT.CREATED_AT_DESC
  );

  const replyResults = await comments.replies(
    story.tenantID,
    story.id,
    rootComment.id,
    false,
    GQLCOMMENT_SORT.CREATED_AT_DESC
  );

  expect(primeResult.retrievedFrom).toEqual("redis");
  expect(rootResults.nodes.length).toEqual(1);
  expect(rootResults.nodes[0].id).toEqual(rootComment.id);

  expect(replyResults.nodes.length).toEqual(replies.length);
  replies.forEach((c) => {
    const found = replyResults.nodes.find((r) => r.id === c.id);
    expect(found.id).toBeDefined();
    expect(found.parentID).toEqual(rootComment.id);
  });

  // clean up
  await redis.flushall();
  await mongo.stories().deleteOne({ tenantID: story.tenantID, id: story.id });
  await mongo
    .comments()
    .deleteOne({ tenantID: story.tenantID, id: rootComment.id });
  await mongo
    .comments()
    .deleteMany({ tenantID: story.tenantID, storyID: story.id });
});

it("cache expires appropriately", async () => {
  const {
    cache: { comments },
    redis,
    mongo,
  } = await createFixtures({ expirySeconds: 5 });

  const story = createStoryFixture();
  const storyComments: Comment[] = [];
  for (let i = 0; i < 3; i++) {
    storyComments.push(
      createCommentFixture({ storyID: story.id, tenantID: story.tenantID })
    );
  }

  await mongo.stories().insertOne(story);
  await mongo.comments().insertMany(storyComments);

  const lockKey = comments.computeLockKey(story.tenantID, story.id);
  expect(await redis.exists(lockKey)).toEqual(0);

  const now = new Date();
  await comments.populateCommentsInCache(story.tenantID, story.id, false, now);
  expect(await redis.exists(lockKey)).toEqual(1);

  const primeResult = await comments.primeCommentsForStory(
    story.tenantID,
    story.id,
    false
  );
  if (!primeResult) {
    throw new UnableToPrimeCachedCommentsForStory(story.tenantID, story.id);
  }
  expect(primeResult.retrievedFrom).toEqual("redis");

  let lockExists = await redis.exists(lockKey);
  while (lockExists) {
    await waitFor(100);
    lockExists = await redis.exists(lockKey);
  }

  const allKey = comments.computeStoryAllCommentsKey(story.tenantID, story.id);
  expect(await redis.exists(lockKey)).toEqual(0);
  expect(await redis.exists(allKey)).toEqual(0);
}, 30000);
