import { Db } from "mongodb";

import { TOXICITY_ENDPOINT_DEFAULT } from "coral-common/constants";
import { reconstructTenantURL } from "coral-server/app/url";
import { Config } from "coral-server/config";
import logger from "coral-server/logger";
import { Comment } from "coral-server/models/comment";
import { findStory, getURLWithCommentID } from "coral-server/models/story";
import { Tenant } from "coral-server/models/tenant";

import {
  GQLCOMMENT_STATUS,
  GQLPerspectiveExternalIntegration,
} from "coral-server/graph/tenant/schema/__generated__/types";

interface SendResult {
  ok: boolean;
  status: number;
  data: any;
}

async function send(
  endpoint: string,
  apiKey: string,
  method: string,
  body: any
): Promise<SendResult> {
  const result = await fetch(`${endpoint}/${method}?key=${apiKey}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body, null, 2),
  });

  if (!result.ok) {
    return {
      ok: result.ok,
      status: result.status,
      data: null,
    };
  }

  const data = await result.json();

  return {
    ok: result.ok,
    status: result.status,
    data,
  };
}

function computeStatus(status: GQLCOMMENT_STATUS) {
  if (status === GQLCOMMENT_STATUS.APPROVED) {
    return "APPROVED";
  }
  if (status === GQLCOMMENT_STATUS.REJECTED) {
    return "DELETED";
  }

  return null;
}

export async function notifyPerspectiveModerationDecision(
  mongo: Db,
  tenant: Tenant,
  config: Config,
  perspectiveConfig: GQLPerspectiveExternalIntegration,
  comment: Comment,
  status: GQLCOMMENT_STATUS
) {
  if (
    !perspectiveConfig.enabled ||
    !perspectiveConfig.key ||
    !perspectiveConfig.sendFeedback
  ) {
    return;
  }

  const endpoint = perspectiveConfig.endpoint
    ? perspectiveConfig.endpoint
    : TOXICITY_ENDPOINT_DEFAULT;
  const apiKey = perspectiveConfig.key;

  const tenantUrl = reconstructTenantURL(config, tenant, undefined, "/");
  const communityId = `Coral:${tenantUrl}`;
  const clientToken = `comment:${comment.id}`;
  const latestRevision = comment.revisions[comment.revisions.length - 1];

  const story = await findStory(mongo, comment.tenantID, {
    id: comment.storyID,
  });
  if (!story) {
    logger.error({ storyID: comment.storyID }, "could not find story");
    return;
  }

  const url = getURLWithCommentID(story.url, comment.id);

  const commentStatus = computeStatus(status);
  if (!commentStatus) {
    return;
  }

  try {
    const body = {
      comment: {
        text: latestRevision.body,
      },
      context: {
        entries: [
          {
            text: JSON.stringify({
              url,
              reply_to_id_Coral_comment_id: comment.parentID,
              Coral_comment_id: comment.id,
            }),
          },
        ],
      },
      attributeScores: {
        [commentStatus]: {
          summaryScore: {
            value: 1,
          },
        },
      },
      languages: ["EN"],
      communityId,
      clientToken,
    };

    const result = await send(endpoint, apiKey, "comments:suggestscore", body);

    if (!result.ok) {
      logger.error(
        { status: result.status },
        "unable to send moderation feedback to perspective"
      );
    } else if (!result.data || result.data.clientToken !== clientToken) {
      logger.error(
        { data: result.data },
        "result data from perspective did not contain the clientToken we expected"
      );
    }
  } catch (err) {
    logger.error({ err }, "unable to send moderation feedback to perspective");
  }
}
