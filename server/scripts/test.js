#!/usr/bin/env node

"use strict";
// Set timezone to UTC for stable tests.
process.env.TZ = "UTC";

// Allow importing typescript files.
require("ts-node/register");

// Apply all the configuration provided in the .env file.
require("dotenv").config();

// Do this as the first thing so that any code reading it knows the right env.
process.env.BABEL_ENV = "test";
process.env.NODE_ENV = "test";

// Makes the script crash on unhandled rejections instead of silently
// ignoring them. In the future, promise rejections that are not handled will
// terminate the Node.js process with a non-zero exit code.
process.on("unhandledRejection", (err) => {
  throw err;
});

const paths = require("../config/paths.ts").default;

const jest = require("jest");

const argv = process.argv.slice(2);

argv.push("--env=jsdom");
argv.push("--config", paths.appJestConfig);

const createMongo = async () => {
  const { MongoMemoryServer } = require("mongodb-memory-server");

  const host = "127.0.0.1";
  const port = 27019;
  const uri = `mongodb://${host}:${port}`;

  process.env.MONGO_TEST_URI = uri;

  return await MongoMemoryServer.create({
    instance: {
      port,
      ip: host,
    },
  });
};

const createRedis = async () => {
  const { RedisMemoryServer } = require("redis-memory-server");

  const host = "127.0.0.1";
  const port = 6381;
  const uri = `redis://${host}:${port}`;

  process.env.REDIS_TEST_URI = uri;

  const redis = await RedisMemoryServer.create({
    instance: {
      port: 6381,
      ip: "0.0.0.0",
    },
  });

  await redis.start();

  return redis;
};

const run = async () => {
  const mongo = await createMongo();
  const redis = await createRedis();

  await jest.run(argv);

  await mongo.stop();
  await redis.stop();
};

run();
