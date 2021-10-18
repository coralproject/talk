import { User } from "@sentry/node";
import fetch from "node-fetch";

import { MongoContext } from "coral-server/data/context";
import logger from "coral-server/logger";
import { Comment, getLatestRevision } from "coral-server/models/comment";
import { retrieveStory, Story } from "coral-server/models/story";
import { Tenant } from "coral-server/models/tenant";
import { retrieveUser } from "coral-server/models/user";
import { Request } from "coral-server/types/express";

export interface Parameters {
  apiKey: string;
  comment: Readonly<Comment>;
  story: Readonly<Story>;
  author: Readonly<User>;
  userIP: string | undefined;
  userAgent: string | undefined;
  referrer: string | undefined;
}

const createBody = (params: Parameters) => {
  const { comment, story, author, userIP, userAgent, referrer } = params;
  const latestRevision = getLatestRevision(comment);
  const username = author ? (author.username ? author.username : "") : "";

  return {
    user_ip: userIP,
    user_agent: userAgent,
    referrer,

    permalink: story.url,

    comment_type: "comment",
    comment_author: username,
    comment_content: latestRevision ? latestRevision.body : "",
    comment_date_gmt: latestRevision
      ? latestRevision.createdAt.toISOString()
      : "",

    is_test: false,
  };
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
    comment,
    story,
    author,
    userIP,
    userAgent,
    referrer,
  });
};
