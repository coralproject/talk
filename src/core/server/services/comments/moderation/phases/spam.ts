import { Client } from "akismet-api";

import {
  GQLCOMMENT_FLAG_REASON,
  GQLCOMMENT_STATUS,
} from "talk-server/graph/tenant/schema/__generated__/types";
import logger from "talk-server/logger";
import { ACTION_TYPE } from "talk-server/models/action/comment";
import {
  IntermediateModerationPhase,
  IntermediatePhaseResult,
} from "talk-server/services/comments/moderation";

export const spam: IntermediateModerationPhase = async ({
  story,
  tenant,
  comment,
  author,
  req,
}): Promise<IntermediatePhaseResult | void> => {
  const integration = tenant.integrations.akismet;

  const log = logger.child({
    tenantID: tenant.id,
  });

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

  // Create the Akismet client.
  const client = new Client({
    key: integration.key,
    blog: integration.site,
  });

  // Grab the properties we need.
  const userIP = req.ip;
  if (!userIP) {
    log.debug("request did not contain ip address, aborting spam check");
    return;
  }

  const userAgent = req.get("User-Agent");
  if (!userAgent || userAgent.length === 0) {
    log.debug("request did not contain User-Agent header, aborting spam check");
    return;
  }

  const referrer = req.get("Referrer");
  if (!referrer || referrer.length === 0) {
    log.debug("request did not contain Referrer header, aborting spam check");
    return;
  }

  try {
    log.trace("checking comment for spam");

    // Check the comment for spam.
    const isSpam = await client.checkSpam({
      user_ip: userIP, // REQUIRED
      referrer, // REQUIRED
      user_agent: userAgent, // REQUIRED
      comment_content: comment.body,
      permalink: story.url,
      comment_author: author.displayName || author.username || "",
      comment_type: "comment",
      is_test: false,
    });
    if (isSpam) {
      log.trace({ isSpam }, "comment contained spam");
      return {
        status: GQLCOMMENT_STATUS.SYSTEM_WITHHELD,
        actions: [
          {
            userID: null,
            actionType: ACTION_TYPE.FLAG,
            reason: GQLCOMMENT_FLAG_REASON.COMMENT_DETECTED_SPAM,
          },
        ],
        metadata: {
          // Store the spam result from Akismet in the Comment metadata.
          akismet: spam,
        },
      };
    }

    log.trace({ isSpam }, "comment did not contain spam");
  } catch (err) {
    log.error({ err }, "could not determine if comment contained spam");
  }
};
