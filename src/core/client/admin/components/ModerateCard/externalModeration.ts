import { graphql } from "relay-runtime";

import {
  GQLCOMMENT_FLAG_REASON,
  GQLCOMMENT_STATUS,
} from "coral-framework/schema";

import { externalModeration_comment } from "coral-admin/__generated__/externalModeration_comment.graphql";

// eslint-disable-next-line no-unused-expressions
graphql`
  fragment externalModeration_comment on Comment {
    status
    tags {
      code
    }
    revision {
      actionCounts {
        flag {
          reasons {
            COMMENT_REPORTED_OFFENSIVE
            COMMENT_REPORTED_ABUSIVE
            COMMENT_REPORTED_SPAM
            COMMENT_DETECTED_SPAM
            COMMENT_REPORTED_OTHER
            COMMENT_DETECTED_TOXIC
          }
        }
      }
      metadata {
        externalModeration {
          name
          result {
            status
            tags
            actions {
              reason
            }
          }
        }
      }
    }
  }
`;

const filterValidExternalModItems = (
  comment?: externalModeration_comment | null
) => {
  if (!comment) {
    return [];
  }

  const { status, tags, revision } = comment;

  if (!revision?.metadata?.externalModeration || !revision.actionCounts) {
    return [];
  }

  return revision.metadata?.externalModeration.filter((m) => {
    // Check if our actions match the external moderation phase data
    const toxic = m.result.actions?.filter(
      (a) => a.reason === GQLCOMMENT_FLAG_REASON.COMMENT_DETECTED_TOXIC
    );
    const spam = m.result.actions?.filter(
      (a) => a.reason === GQLCOMMENT_FLAG_REASON.COMMENT_DETECTED_SPAM
    );
    if (
      toxic &&
      revision.actionCounts.flag.reasons.COMMENT_DETECTED_TOXIC >= toxic.length
    ) {
      return true;
    }
    if (
      spam &&
      revision.actionCounts.flag.reasons.COMMENT_DETECTED_SPAM >= spam.length
    ) {
      return true;
    }

    // Check if the status matches the external moderation phase status
    if (
      status === m.result.status &&
      m.result.status !== GQLCOMMENT_STATUS.NONE
    ) {
      return true;
    }

    // Check if the tags match the external moderation phase tags
    if (
      tags &&
      m.result.tags?.every((t) =>
        tags.map((ct: { code: any }) => ct.code).includes(t)
      )
    ) {
      return true;
    }

    return false;
  });
};

export default filterValidExternalModItems;
