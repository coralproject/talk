import { Client } from "akismet-api";

import {
  GQLACTION_GROUP,
  GQLACTION_TYPE,
  GQLCOMMENT_STATUS,
} from "talk-server/graph/tenant/schema/__generated__/types";
import logger from "talk-server/logger";
import {
  IntermediateModerationPhase,
  IntermediatePhaseResult,
} from "talk-server/services/comments/moderation";

export const spam: IntermediateModerationPhase = async ({
  asset,
  tenant,
  comment,
  author,
  req,
}): Promise<IntermediatePhaseResult | void> => {
  const integration = tenant.integrations.akismet;

  // We can only check for spam if this comment originated from a graphql
  // request via an HTTP call.
  if (!req) {
    logger.debug({ tenant_id: tenant.id }, "request was not available");
    return;
  }

  if (!integration.enabled) {
    logger.debug({ tenant_id: tenant.id }, "akismet integration was disabled");
    return;
  }

  if (!integration.key) {
    logger.error(
      { tenant_id: tenant.id },
      "akismet integration was enabled but the key configuration was missing"
    );
    return;
  }

  if (!integration.site) {
    logger.error(
      { tenant_id: tenant.id },
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
    logger.debug(
      { tenant_id: tenant.id },
      "request did not contain ip address, aborting spam check"
    );
    return;
  }

  const userAgent = req.get("User-Agent");
  if (!userAgent || userAgent.length === 0) {
    logger.debug(
      { tenant_id: tenant.id },
      "request did not contain User-Agent header, aborting spam check"
    );
    return;
  }

  const referrer = req.get("Referrer");
  if (!referrer || referrer.length === 0) {
    logger.debug(
      { tenant_id: tenant.id },
      "request did not contain Referrer header, aborting spam check"
    );
    return;
  }

  try {
    logger.trace({ tenant_id: tenant.id }, "checking comment for spam");

    // Check the comment for spam.
    const isSpam = await client.checkSpam({
      user_ip: userIP, // REQUIRED
      referrer, // REQUIRED
      user_agent: userAgent, // REQUIRED
      comment_content: comment.body,
      permalink: asset.url,
      comment_author: author.displayName || author.username || "",
      comment_type: "comment",
      is_test: false,
    });
    if (isSpam) {
      logger.trace(
        { tenant_id: tenant.id, is_spam: isSpam },
        "comment contained spam"
      );
      return {
        status: GQLCOMMENT_STATUS.SYSTEM_WITHHELD,
        actions: [
          {
            action_type: GQLACTION_TYPE.FLAG,
            group_id: GQLACTION_GROUP.SPAM_COMMENT,
          },
        ],
        metadata: {
          // Store the spam result from Akismet in the Comment metadata.
          akismet: spam,
        },
      };
    }

    logger.trace(
      { tenant_id: tenant.id, is_spam: isSpam },
      "comment did not contain spam"
    );
  } catch (err) {
    logger.error(
      { tenant_id: tenant.id, err },
      "could not determine if comment contained spam"
    );
  }
};
