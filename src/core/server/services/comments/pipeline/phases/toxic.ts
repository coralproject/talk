import { isNil } from "lodash";

import {
  TOXICITY_MODEL_DEFAULT,
  TOXICITY_THRESHOLD_DEFAULT,
} from "coral-common/constants";
import { ToxicCommentError } from "coral-server/errors";
import { ACTION_TYPE } from "coral-server/models/action/comment";
import { hasFeatureFlag } from "coral-server/models/tenant";
import {
  IntermediateModerationPhase,
  IntermediatePhaseResult,
  ModerationPhaseContext,
} from "coral-server/services/comments/pipeline";
import { sendToPerspective } from "coral-server/services/perspective";

import {
  GQLCOMMENT_FLAG_REASON,
  GQLCOMMENT_STATUS,
  GQLFEATURE_FLAG,
} from "coral-server/graph/schema/__generated__/types";

export const toxic: IntermediateModerationPhase = async ({
  tenant,
  nudge,
  log,
  bodyText,
  config,
  // FEATURE_FLAG:DISABLE_WARN_USER_OF_TOXIC_COMMENT
  comment: { body },
}: Pick<
  ModerationPhaseContext,
  // FEATURE_FLAG:DISABLE_WARN_USER_OF_TOXIC_COMMENT
  "tenant" | "nudge" | "log" | "bodyText" | "comment" | "config"
>): Promise<IntermediatePhaseResult | void> => {
  if (!bodyText) {
    return;
  }

  const integration = tenant.integrations.perspective;

  if (!integration.enabled) {
    // The Toxic comment plugin is not enabled.
    log.debug("perspective integration was disabled");
    return;
  }

  if (!integration.key) {
    // The Toxic comment requires a key in order to communicate with the API.
    log.error(
      "perspective integration was enabled but the key configuration was missing"
    );
    return;
  }

  let threshold = integration.threshold;
  if (isNil(threshold)) {
    threshold = TOXICITY_THRESHOLD_DEFAULT / 100;

    log.trace(
      { threshold },
      "threshold missing in integration settings, using defaults"
    );
  }

  let doNotStore = integration.doNotStore;
  if (isNil(doNotStore)) {
    doNotStore = true;

    log.trace(
      { doNotStore },
      "doNotStore missing in integration settings, using defaults"
    );
  }

  // Get the timeout value.
  const timeout = config.get("perspective_timeout");

  try {
    // FEATURE_FLAG:DISABLE_WARN_USER_OF_TOXIC_COMMENT
    log.info({ body }, "checking comment toxicity");
    // log.trace("checking comment toxicity");

    // Pull the custom model out.
    const model = integration.model || TOXICITY_MODEL_DEFAULT;

    // Get the response from perspective.
    const result = await sendToPerspective(
      { key: integration.key, endpoint: integration.endpoint, timeout },
      {
        operation: "comments:analyze",
        locale: tenant.locale,
        body: {
          text: bodyText,
          doNotStore,
          model,
        },
      }
    );

    // Reformat the scores.
    const score = result.data.attributeScores[model].summaryScore
      .value as number;

    const isToxic = score > threshold;
    if (isToxic) {
      // FEATURE_FLAG:DISABLE_WARN_USER_OF_TOXIC_COMMENT
      log.info({ score, isToxic, threshold, model }, "comment was toxic");
      // log.trace({ score, isToxic, threshold, model }, "comment was toxic");

      // Throw an error if we're nudging instead of recording.
      if (nudge) {
        // FEATURE_FLAG:DISABLE_WARN_USER_OF_TOXIC_COMMENT
        if (
          !hasFeatureFlag(
            tenant,
            GQLFEATURE_FLAG.DISABLE_WARN_USER_OF_TOXIC_COMMENT
          )
        ) {
          throw new ToxicCommentError(model, score, threshold);
        } else {
          log.trace(
            { flag: GQLFEATURE_FLAG.DISABLE_WARN_USER_OF_TOXIC_COMMENT },
            "not nudging because of feature experiment"
          );
        }
      }

      return {
        status: GQLCOMMENT_STATUS.SYSTEM_WITHHELD,
        actions: [
          {
            actionType: ACTION_TYPE.FLAG,
            reason: GQLCOMMENT_FLAG_REASON.COMMENT_DETECTED_TOXIC,
          },
        ],
        metadata: {
          // Store the scores from perspective in the Comment metadata.
          perspective: { model, score },
        },
      };
    }

    // FEATURE_FLAG:DISABLE_WARN_USER_OF_TOXIC_COMMENT
    log.info({ score, isToxic, threshold }, "comment was not toxic");
    // log.trace({ score, isToxic, threshold }, "comment was not toxic");

    return {
      metadata: {
        // Store the scores from perspective in the Comment metadata.
        perspective: { model, score },
      },
    };
  } catch (err) {
    // Rethrow any ToxicCommentError.
    if (err instanceof ToxicCommentError) {
      throw err;
    }

    log.error({ err }, "could not determine comment toxicity");
  }
};
