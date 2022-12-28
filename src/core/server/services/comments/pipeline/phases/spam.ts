import fetch from "node-fetch";

import { SpamCommentError } from "coral-server/errors";
import { ACTION_TYPE } from "coral-server/models/action/comment";
import {
  IntermediateModerationPhase,
  IntermediatePhaseResult,
} from "coral-server/services/comments/pipeline";

import {
  GQLCOMMENT_FLAG_REASON,
  GQLCOMMENT_STATUS,
} from "coral-server/graph/schema/__generated__/types";

interface AkismetParameters {
  api_key: string;
  blog: string;
  user_ip: string;
  user_agent: string;
  referrer: string;
  permalink: string;
  comment_type: string;
  comment_author: string;
  comment_content: string;
  recheck_reason?: string;
}

export const spam: IntermediateModerationPhase = async ({
  story,
  tenant,
  comment,
  author,
  req,
  nudge,
  log,
}): Promise<IntermediatePhaseResult | void> => {
  const integration = tenant.integrations.akismet;

  // We can only check for spam if this comment originated from a graphql
  // request via an HTTP call.
  if (!req) {
    log.debug("request was not available");
    return;
  }

  if (!integration.enabled) {
    log.debug("akismet integration was disabled");
    return;
  }

  if (!integration.key) {
    log.error(
      "akismet integration was enabled but the key configuration was missing"
    );
    return;
  }

  if (!integration.site) {
    log.error(
      "akismet integration was enabled but the site configuration was missing"
    );
    return;
  }

  // If the comment doesn't have a body, it can't be spam!
  if (!comment.body) {
    return;
  }

  // Grab the properties we need.
  let userIP = "";

  // Only use the ip address if ipBased is enabled. This property is by default
  // not set, that's why we're explicitly checking if it is false before using
  // it.
  if (integration.ipBased !== false) {
    if (req.ip) {
      userIP = req.ip;
    } else {
      log.debug(
        "request did not contain ip address, continue spam check with empty ip address"
      );
    }
  } else {
    log.trace("not adding ip address to request due to configuration");
  }

  const userAgent = req.get("User-Agent") || "";

  const referrer = req.get("Referrer") || "";

  try {
    log.trace("checking comment for spam");

    const params: AkismetParameters = {
      api_key: integration.key,
      blog: integration.site,
      user_ip: userIP,
      user_agent: userAgent,
      referrer,
      permalink: story.url,
      comment_type: "comment",
      comment_author: author.username || "",
      comment_content: comment.body,
    };
    if (comment.id) {
      params.recheck_reason = "edit";
    }
    // Check the comment for spam.
    const isSpam = await checkSpam(params);
    if (isSpam) {
      log.trace({ isSpam }, "comment contained spam");

      // Throw an error if we're nudging instead of recording.
      if (nudge) {
        throw new SpamCommentError();
      }

      return {
        status: GQLCOMMENT_STATUS.SYSTEM_WITHHELD,
        actions: [
          {
            actionType: ACTION_TYPE.FLAG,
            reason: GQLCOMMENT_FLAG_REASON.COMMENT_DETECTED_SPAM,
          },
        ],
        metadata: {
          // Store the spam result from Akismet in the Comment metadata.
          akismet: isSpam,
        },
      };
    }

    log.trace({ isSpam }, "comment did not contain spam");
  } catch (err) {
    // Rethrow any SpamCommentError.
    if (err instanceof SpamCommentError) {
      throw err;
    }

    log.error({ err }, "could not determine if comment contained spam");
  }
};

const checkSpam = async (params: AkismetParameters) => {
  const url = "https://rest.akismet.com/1.1/comment-check";

  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams(Object.entries(params)).toString(),
  });

  const body = await response.text();
  if (body === "true") {
    return true;
  }
  if (body === "false") {
    return false;
  }
  if (body === "invalid") {
    throw new Error("Invalid Akismet API key");
  }
  const help = response.headers.get("x-akismet-debug-help");
  if (help) {
    throw new Error(help);
  }
  throw new Error(body);
};
