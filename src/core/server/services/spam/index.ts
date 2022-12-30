import { User } from "@sentry/node";
import fetch from "node-fetch";

import { MongoContext } from "coral-server/data/context";
import logger from "coral-server/logger";
import { Comment, getLatestRevision } from "coral-server/models/comment";
import { retrieveStory, Story } from "coral-server/models/story";
import { Tenant } from "coral-server/models/tenant";
import { retrieveUser } from "coral-server/models/user";
import { Request } from "coral-server/types/express";

interface PartialComment {
  // An in-flight comment has a pretty ugly type, but this is the important bit
  body: string;
}

export interface Parameters {
  apiKey: string;
  blog: string;
  comment: Readonly<Comment> | PartialComment;
  story: Readonly<Story>;
  author: Readonly<User>;
  userIP: string | undefined;
  userAgent: string | undefined;
  referrer: string | undefined;
  recheckReason?: string | undefined;
}

const createBody = (params: Parameters) => {
  const {
    apiKey,
    blog,
    comment,
    story,
    author,
    userIP,
    userAgent,
    referrer,
    recheckReason,
  } = params;
  let body = "";
  let date;
  if ("revisions" in comment) {
    const latestRevision = getLatestRevision(comment);
    body = latestRevision.body;
    date = latestRevision.createdAt.toISOString();
  } else {
    body = comment.body;
  }

  const res: Record<string, string> = {
    api_key: apiKey,
    blog,
    user_ip: userIP || "",
    user_agent: userAgent || "",
    referrer: referrer || "",

    permalink: story.url,

    comment_type: "comment",
    comment_author: author.username || "",
    comment_content: body,

    // is_test: "true", // set this if testing to avoid the test account ending
    // up on the naughty list...
  };
  // current time will be used if this is missing
  if (date) {
    res.comment_date_gmt = date;
  }
  // This key has to be missing if it's not a recheck, we can't just leave it blank
  if (recheckReason) {
    res.recheck_reason = recheckReason;
  }
  return new URLSearchParams(res);
};

const makeAkismetRequest = async (
  params: Parameters,
  url: string,
  expect: string[]
) => {
  const body = createBody(params);
  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: body.toString(),
  });

  const content = await response.text();
  if (!expect.includes(content)) {
    const help = response.headers.get("x-akismet-debug-help");
    throw new Error(`Akismet API error: ${content}, ${help}`);
  }
  return content;
};

const submitSpam = async (params: Parameters) => {
  try {
    await makeAkismetRequest(
      params,
      "https://rest.akismet.com/1.1/submit-spam",
      ["Thanks for making the web a better place."]
    );
  } catch (err) {
    logger.error({ err }, "unable to submit spam to Akismet");
    return false;
  }
  return true;
};

const submitNotSpam = async (params: Parameters) => {
  try {
    await makeAkismetRequest(
      params,
      "https://rest.akismet.com/1.1/submit-ham",
      ["Thanks for making the web a better place."]
    );
  } catch (err) {
    logger.error({ err }, "unable to submit not-spam to Akismet");
    return false;
  }
  return true;
};

const checkSpam = async (params: Parameters) => {
  try {
    const res = await makeAkismetRequest(
      params,
      "https://rest.akismet.com/1.1/comment-check",
      ["true", "false"]
    );
    if (res === "true") {
      return true;
    }
    return false;
  } catch (err) {
    logger.error({ err }, "unable to check Akismet for spam");
    return false;
  }
};

const prepareParamsMongo = async (
  mongo: MongoContext,
  tenant: Tenant,
  comment: Readonly<Comment>
) => {
  // this is checked in prepareParams as well, but it saves some DB hits here
  if (!tenant.integrations.akismet.enabled) {
    return;
  }
  const story = await retrieveStory(mongo, tenant.id, comment.storyID);
  if (!story) {
    return;
  }
  const author = comment.authorID
    ? await retrieveUser(mongo, tenant.id, comment.authorID)
    : undefined;
  if (!author) {
    return;
  }

  return prepareParams(tenant, comment, story, author);
};

const prepareParams = (
  tenant: Tenant,
  comment: Readonly<Comment> | PartialComment,
  story: Readonly<Story>,
  author: Readonly<User>,
  request?: Readonly<Request> | undefined
): Parameters | undefined => {
  if (!tenant.integrations.akismet.enabled) {
    return;
  }
  const apiKey = tenant.integrations.akismet.key;
  const blog = tenant.integrations.akismet.site;
  if (!apiKey || !blog) {
    logger.error("Akismet not configured");
    return;
  }

  // Only use the ip address if ipBased is enabled. This property is by default
  // not set, that's why we're explicitly checking if it is false before using
  // it.
  let userIP = "";
  if (tenant.integrations.akismet.ipBased !== false) {
    userIP = request?.ip || "";
  }
  const userAgent = request?.get("User-Agent") || "";
  const referrer = request?.get("Referrer") || "";

  return {
    apiKey,
    blog,
    comment,
    story,
    author,
    userIP,
    userAgent,
    referrer,
  };
};

export const submitCommentAsNotSpam = async (
  mongo: MongoContext,
  tenant: Tenant,
  comment: Readonly<Comment>
) => {
  const params = await prepareParamsMongo(mongo, tenant, comment);
  if (params) {
    await submitNotSpam(params);
  }
};

export const submitCommentAsSpam = async (
  mongo: MongoContext,
  tenant: Tenant,
  comment: Readonly<Comment>
) => {
  const params = await prepareParamsMongo(mongo, tenant, comment);
  if (params) {
    await submitSpam(params);
  }
};

export const checkCommentIsSpam = async (
  tenant: Tenant,
  comment: PartialComment,
  request: Readonly<Request> | undefined,
  story: Readonly<Story>,
  author: Readonly<User>,
  recheck: string | undefined
) => {
  const params = prepareParams(tenant, comment, story, author, request);
  if (params) {
    params.recheckReason = recheck;
    return await checkSpam(params);
  }
  return false;
};
