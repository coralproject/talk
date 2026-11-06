import { Response } from "express";

import { patchTextUtil } from "coral-server/test/textEncoder";
patchTextUtil();

jest.mock("coral-server/models/comment");
jest.mock("coral-server/models/site");

import { commentEmbedWhitelisted } from "coral-server/app/middleware/commentEmbedWhitelisted";
import {
  createCommentFixture,
  createSiteFixture,
  createTenantFixture,
} from "coral-server/test/fixtures";
import { createMockMongoContex } from "coral-server/test/mocks";
import { Request } from "coral-server/types/express";

/* eslint-disable-next-line */
const commentModel = require("coral-server/models/comment");
/* eslint-disable-next-line */
const siteModel = require("coral-server/models/site");

const { ctx: mongo } = createMockMongoContex();

const origin = "https://news.example.com";
const tenant = createTenantFixture({
  embeddedComments: {
    allowReplies: true,
    oEmbedAllowedOrigins: [origin],
  },
});
const site = createSiteFixture({ tenantID: tenant.id });
const comment = createCommentFixture({ tenantID: tenant.id, siteID: site.id });

const createRequest = (
  query: Record<string, unknown>,
  headers: Record<string, string> = {}
) =>
  ({
    query,
    headers,
    header: (name: string) => headers[name.toLowerCase()],
    coral: { tenant },
  } as unknown as Request);

const createResponse = () =>
  ({ sendStatus: jest.fn() } as unknown as Response & {
    sendStatus: jest.Mock;
  });

const run = async (req: Request, oembedAPI = false) => {
  const res = createResponse();
  const next = jest.fn();
  await Promise.resolve(
    commentEmbedWhitelisted({ mongo }, oembedAPI)(req, res, next)
  );
  return { res, next };
};

const commentURL = `https://news.example.com/story?commentID=${comment.id}`;

afterEach(jest.resetAllMocks);

describe("commentEmbedWhitelisted", () => {
  it("responds 400 when neither commentID nor url are provided", async () => {
    const { res, next } = await run(createRequest({}));

    expect(res.sendStatus).toHaveBeenCalledWith(400);
    expect(next).not.toHaveBeenCalled();
    expect(commentModel.retrieveComment).not.toHaveBeenCalled();
  });

  it("responds 400 when the url is not a valid URL", async () => {
    const { res, next } = await run(createRequest({ url: "notaurl" }), true);

    expect(res.sendStatus).toHaveBeenCalledWith(400);
    expect(next).not.toHaveBeenCalled();
  });

  it("responds 400 when the url is provided more than once", async () => {
    const { res, next } = await run(
      createRequest({ url: [commentURL, commentURL] }),
      true
    );

    expect(res.sendStatus).toHaveBeenCalledWith(400);
    expect(next).not.toHaveBeenCalled();
  });

  it("responds 401 when the comment can't be found", async () => {
    commentModel.retrieveComment.mockResolvedValue(null);

    const { res, next } = await run(
      createRequest({ url: commentURL }, { origin }),
      true
    );

    expect(commentModel.retrieveComment).toHaveBeenCalledWith(
      expect.anything(),
      tenant.id,
      comment.id
    );
    expect(res.sendStatus).toHaveBeenCalledWith(401);
    expect(next).not.toHaveBeenCalled();
  });

  it("allows site origins when using the commentID", async () => {
    commentModel.retrieveComment.mockResolvedValue(comment);
    siteModel.retrieveSite.mockResolvedValue({
      ...site,
      allowedOrigins: [origin],
    });

    const { res, next } = await run(
      createRequest({ commentID: comment.id }, { origin })
    );

    expect(next).toHaveBeenCalledWith();
    expect(res.sendStatus).not.toHaveBeenCalled();
  });

  it("allows tenant oEmbed origins when using the oEmbed API", async () => {
    commentModel.retrieveComment.mockResolvedValue(comment);
    siteModel.retrieveSite.mockResolvedValue(site);

    const { res, next } = await run(
      createRequest({ url: commentURL }, { origin }),
      true
    );

    expect(next).toHaveBeenCalledWith();
    expect(res.sendStatus).not.toHaveBeenCalled();
  });

  it("does not allow tenant oEmbed origins outside of the oEmbed API", async () => {
    commentModel.retrieveComment.mockResolvedValue(comment);
    siteModel.retrieveSite.mockResolvedValue(site);

    const { res, next } = await run(
      createRequest({ commentID: comment.id }, { origin })
    );

    expect(res.sendStatus).toHaveBeenCalledWith(401);
    expect(next).not.toHaveBeenCalled();
  });

  it("passes lookup errors to the error handler", async () => {
    const err = new Error("database unavailable");
    commentModel.retrieveComment.mockRejectedValue(err);

    const { res, next } = await run(
      createRequest({ commentID: comment.id }, { origin })
    );

    expect(next).toHaveBeenCalledWith(err);
    expect(res.sendStatus).not.toHaveBeenCalled();
  });
});
