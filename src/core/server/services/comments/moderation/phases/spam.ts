import { Client } from "akismet-api";

import {
  GQLACTION_TYPE,
  GQLCOMMENT_STATUS,
} from "talk-server/graph/tenant/schema/__generated__/types";
import { IntermediateModerationPhase } from "talk-server/services/comments/moderation";

export const spam: IntermediateModerationPhase = async ({
  asset,
  tenant,
  comment,
  author,
  req,
}) => {
  const integration = tenant.integrations.akismet;

  // We can only check for spam if this comment originated from a graphql
  // request via an HTTP call.
  if (!req || !integration.enabled) {
    return;
  }

  if (!integration.key || !integration.site) {
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
    return;
  }

  const userAgent = req.get("User-Agent");
  if (!userAgent || userAgent.length === 0) {
    return;
  }

  const referrer = req.get("Referrer");
  if (!referrer || referrer.length === 0) {
    return;
  }

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
    return {
      status: GQLCOMMENT_STATUS.SYSTEM_WITHHELD,
      actions: [
        {
          action_type: GQLACTION_TYPE.FLAG,
          group_id: "SPAM_COMMENT",
        },
      ],
    };
  }

  return;
};
