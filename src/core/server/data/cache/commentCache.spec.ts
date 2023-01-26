import RedisClient from "ioredis";

import { waitFor } from "coral-common/helpers";
import { CommentCache } from "coral-server/data/cache/commentCache";
import { MongoContext, MongoContextImpl } from "coral-server/data/context";
import logger from "coral-server/logger";
import { Comment } from "coral-server/models/comment";
import { createMongoDB } from "coral-server/services/mongodb";
import { AugmentedRedis } from "coral-server/services/redis";
import {
  createCommentFixture,
  createStoryFixture,
} from "coral-server/test/fixtures";

import { GQLCOMMENT_SORT } from "coral-server/graph/schema/__generated__/types";

const createRedis = (): AugmentedRedis => {
  const uri = "redis://127.0.0.1:6379";
  const redis = new RedisClient(uri, { lazyConnect: false });

  return redis as AugmentedRedis;
};

const createMongo = async (): Promise<MongoContext> => {
  const uri = "mongodb://127.0.0.1:27017/coral";
  const live = await createMongoDB(uri);
  const archive = await createMongoDB(uri);

  const context = new MongoContextImpl(live, archive);

  return context;
};

interface FixtureOptions {
  expirySeconds?: number;
}

const createFixtures = async (
  options: FixtureOptions = { expirySeconds: 5 * 60 }
) => {
  const redis = createRedis();
  const mongo = await createMongo();

  const commentCache = new CommentCache(
    mongo,
    redis,
    null,
    logger,
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
    replies.push(
      createCommentFixture({
        storyID: story.id,
        tenantID: story.tenantID,
        parentID: rootComment.id,
        ancestorIDs: [rootComment.id],
      })
    );
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
