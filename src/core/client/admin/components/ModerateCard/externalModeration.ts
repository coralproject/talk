import {
  GQLCOMMENT_FLAG_REASON,
  GQLCOMMENT_FLAG_REASON_RL,
  GQLCOMMENT_STATUS,
  GQLCOMMENT_STATUS_RL,
  GQLTAG_RL,
} from "coral-framework/schema";

interface CODED_TAG {
  code: GQLTAG_RL;
}

interface Comment {
  readonly revision: {
    readonly actionCounts: {
      readonly flag: {
        readonly reasons: {
          readonly COMMENT_REPORTED_OFFENSIVE: number;
          readonly COMMENT_REPORTED_ABUSIVE: number;
          readonly COMMENT_REPORTED_SPAM: number;
          readonly COMMENT_DETECTED_SPAM: number;
          readonly COMMENT_REPORTED_OTHER: number;
          readonly COMMENT_DETECTED_TOXIC: number;
        };
      };
    };
    readonly metadata?: {
      readonly externalModeration: ReadonlyArray<{
        readonly name: string;
        readonly result: {
          readonly status: GQLCOMMENT_STATUS_RL | null;
          readonly tags: ReadonlyArray<GQLTAG_RL> | null;
          readonly actions: ReadonlyArray<{
            readonly reason: GQLCOMMENT_FLAG_REASON_RL | null;
          }> | null;
        };
      }> | null;
    };
  } | null;
  readonly status: GQLCOMMENT_STATUS_RL;
  tags: ReadonlyArray<CODED_TAG>;
}

const filterValidExternalModItems = (comment?: Comment | null) => {
  if (!comment) {
    return [];
  }

  const { status, tags, revision } = comment;

  if (!revision?.metadata?.externalModeration || !revision.actionCounts) {
    return [];
  }

  return revision.metadata?.externalModeration.filter(
    (m: {
      name: string;
      result: {
        actions: ReadonlyArray<{
          readonly reason: GQLCOMMENT_FLAG_REASON_RL | null;
        }> | null;
        status: GQLCOMMENT_STATUS_RL | null;
        tags: GQLTAG_RL[];
      };
    }) => {
      // Check if our actions match the external moderation phase data
      const toxic = m.result.actions?.filter(
        (a) => a.reason === GQLCOMMENT_FLAG_REASON.COMMENT_DETECTED_TOXIC
      );
      const spam = m.result.actions?.filter(
        (a) => a.reason === GQLCOMMENT_FLAG_REASON.COMMENT_DETECTED_SPAM
      );
      if (
        toxic &&
        revision.actionCounts.flag.reasons.COMMENT_DETECTED_TOXIC >=
          toxic.length
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
        m.result.tags?.every((t: GQLTAG_RL) =>
          tags.map((ct: { code: GQLTAG_RL }) => ct.code).includes(t)
        )
      ) {
        return true;
      }

      return false;
    }
  );
};

export default filterValidExternalModItems;
