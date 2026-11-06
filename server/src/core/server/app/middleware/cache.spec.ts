import { Response } from "express";
import { Redis } from "ioredis";

import cacheMiddleware from "coral-server/app/middleware/cache";
import { Request } from "coral-server/types/express";

const run = async (
  redis: { get: jest.Mock },
  jsonpType: "count" | "commentEmbed",
  hostname: string,
  originalUrl: string
) => {
  const req = { hostname, originalUrl } as unknown as Request;
  const res = {
    send: jest.fn(),
    set: jest.fn(),
    status: jest.fn(),
    getHeaders: jest.fn(() => ({})),
  } as unknown as Response;
  const next = jest.fn();

  await Promise.resolve(
    cacheMiddleware(redis as unknown as Redis, 60000, jsonpType)(req, res, next)
  );

  return { res, next };
};

describe("cacheMiddleware", () => {
  it("looks up count requests made to a bare IP hostname", async () => {
    const redis = { get: jest.fn().mockResolvedValue(null) };

    const { next } = await run(
      redis,
      "count",
      "127.0.0.1",
      "/api/story/count.js?url=https%3A%2F%2Fexample.com%2Fstory%3Fid%3D1"
    );

    expect(redis.get).toHaveBeenCalledWith(
      "rmc:CoralCount&url=https://example.com/story?id=1"
    );
    expect(next).toHaveBeenCalledWith();
  });

  it("skips the cache when the lookup fails", async () => {
    const redis = { get: jest.fn().mockRejectedValue(new Error("down")) };

    const { res, next } = await run(
      redis,
      "commentEmbed",
      "example.com",
      "/api/comment/commentEmbed.js?commentID=1"
    );

    expect(next).toHaveBeenCalledWith();
    expect(res.send).not.toHaveBeenCalled();
  });
});
