import { User } from "@sentry/node";
import fetch from "node-fetch";

import { MongoContext } from "coral-server/data/context";
import logger from "coral-server/logger";
import { Comment, getLatestRevision } from "coral-server/models/comment";
import { retrieveStory, Story } from "coral-server/models/story";
import { Tenant } from "coral-server/models/tenant";
import { retrieveUser } from "coral-server/models/user";
import { Request } from "coral-server/types/express";

import { Comment as AkismetComment } from "akismet-api";

export interface Parameters {
  apiKey: string;
  blog: string;
  comment: Readonly<Comment>;
  story: Readonly<Story>;
  author: Readonly<User>;
  userIP: string | undefined;
  userAgent: string | undefined;
  referrer: string | undefined;
  recheckReason?: string | undefined;
}

export type AkismetSpamCheckPayload = AkismetComment & {
  recheck_reason?: string;
};

const createBody = (params: Parameters): AkismetSpamCheckPayload => {
  const { comment, story, author, userIP, userAgent, referrer, recheckReason } =
    params;
  const latestRevision = getLatestRevision(comment);

  const body: AkismetSpamCheckPayload = {
    user_ip: userIP || "",
    user_agent: userAgent || "",
    referrer: referrer || "",

    permalink: story.url,

    comment_type: "comment",
    comment_author: author?.username || "",
    comment_content: latestRevision ? latestRevision.body : "",

    is_test: false,

    comment_date_gmt: latestRevision
      ? latestRevision.createdAt.toISOString()
      : new Date().toISOString(),
  };

  if (recheckReason) {
    body.recheck_reason = recheckReason;
  }

  return body;
};

const submitSpam = async (params: Parameters) => {
  const { apiKey } = params;
  const url = `https://${apiKey}.rest.akismet.com/1.1/submit-spam`;
  const body = createBody(params);

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    return response.ok;
  } catch (err) {
    logger.error({ err }, "unable to submit spam to Akismet");
    return false;
  }
};

const submitNotSpam = async (params: Parameters) => {
  const { apiKey } = params;
  const url = `https://${apiKey}.rest.akismet.com/1.1/submit-ham`;
  const body = createBody(params);

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    return response.ok;
  } catch (err) {
    logger.error({ err }, "unable to submit non-spam to Akismet");
    return false;
  }
};

export const submitCommentAsNotSpam = async (
  mongo: MongoContext,
  tenant: Tenant,
  comment: Readonly<Comment>,
  request?: Request | undefined
) => {
  const story = await retrieveStory(mongo, tenant.id, comment.storyID);
  if (!story) {
    return;
  }

  const author = comment.authorID
    ? await retrieveUser(mongo, tenant.id, comment.authorID)
    : null;
  if (!author) {
    return;
  }

  const userIP = request?.ip || "";

  const userAgent = request?.get("User-Agent");
  if (!userAgent || userAgent.length === 0) {
    return;
  }

  const referrer = request?.get("Referrer");
  if (!referrer || referrer.length === 0) {
    return;
  }

  await submitNotSpam({
    apiKey: tenant.integrations.akismet.key
      ? tenant.integrations.akismet.key
      : "",
    blog: tenant.integrations.akismet.site || "",
    comment,
    story,
    author,
    userIP,
    userAgent,
    referrer,
  });
};

export const submitCommentAsSpam = async (
  mongo: MongoContext,
  tenant: Tenant,
  comment: Readonly<Comment>,
  request?: Request | undefined
) => {
  const story = await retrieveStory(mongo, tenant.id, comment.storyID);
  if (!story) {
    return;
  }

  const author = comment.authorID
    ? await retrieveUser(mongo, tenant.id, comment.authorID)
    : null;
  if (!author) {
    return;
  }

  const userIP = request?.ip || "";

  const userAgent = request?.get("User-Agent");
  if (!userAgent || userAgent.length === 0) {
    return;
  }

  const referrer = request?.get("Referrer");
  if (!referrer || referrer.length === 0) {
    return;
  }

  await submitSpam({
    apiKey: tenant.integrations.akismet.key
      ? tenant.integrations.akismet.key
      : "",
    blog: tenant.integrations.akismet.site || "",
    comment,
    story,
    author,
    userIP,
    userAgent,
    referrer,
    recheckReason: comment.revisions.length > 1 ? "edit" : undefined,
  });
};
