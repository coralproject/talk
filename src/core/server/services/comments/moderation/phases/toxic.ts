import { isNil } from "lodash";
import ms from "ms";
import fetch from "node-fetch";

import { Omit } from "talk-common/types";
import {
  GQLCOMMENT_FLAG_REASON,
  GQLCOMMENT_STATUS,
  GQLPerspectiveExternalIntegration,
} from "talk-server/graph/tenant/schema/__generated__/types";
import logger from "talk-server/logger";
import { ACTION_TYPE } from "talk-server/models/action";
import {
  IntermediateModerationPhase,
  IntermediatePhaseResult,
} from "talk-server/services/comments/moderation";

export const toxic: IntermediateModerationPhase = async ({
  tenant,
  comment,
}): Promise<IntermediatePhaseResult | void> => {
  if (!comment.body) {
    return;
  }

  const integration = tenant.integrations.perspective;

  if (!integration.enabled) {
    // The Toxic comment plugin is not enabled.
    logger.debug(
      { tenant_id: tenant.id },
      "perspective integration was disabled"
    );
    return;
  }

  if (!integration.key) {
    // The Toxic comment requires a key in order to communicate with the API.
    logger.error(
      { tenant_id: tenant.id },
      "perspective integration was enabled but the key configuration was missing"
    );
    return;
  }

  let endpoint = integration.endpoint;
  if (isNil(endpoint)) {
    // TODO: (wyattjoh) replace hardcoded default with config.
    endpoint = "https://commentanalyzer.googleapis.com/v1alpha1";

    logger.trace(
      { tenant_id: tenant.id, endpoint },
      "endpoint missing in integration settings, using defaults"
    );
  }

  let threshold = integration.threshold;
  if (isNil(threshold)) {
    // TODO: (wyattjoh) replace hardcoded default with config.
    threshold = 0.8;

    logger.trace(
      { tenant_id: tenant.id, threshold },
      "threshold missing in integration settings, using defaults"
    );
  }

  let doNotStore = integration.doNotStore;
  if (isNil(doNotStore)) {
    doNotStore = true;

    logger.trace(
      { tenant_id: tenant.id, do_not_store: doNotStore },
      "doNotStore missing in integration settings, using defaults"
    );
  }

  // TODO: (wyattjoh) replace hardcoded default with config.
  const timeout = ms("300ms");

  try {
    logger.trace({ tenant_id: tenant.id }, "checking comment toxicity");

    // Call into the Toxic comment API.
    const scores = await getScores(
      comment.body,
      {
        endpoint,
        key: integration.key,
        doNotStore,
      },
      timeout
    );

    const score = scores.SEVERE_TOXICITY.summaryScore;
    const isToxic = score > threshold;
    if (isToxic) {
      logger.trace(
        { tenant_id: tenant.id, score, is_toxic: isToxic, threshold },
        "comment was toxic"
      );
      return {
        status: GQLCOMMENT_STATUS.SYSTEM_WITHHELD,
        actions: [
          {
            action_type: ACTION_TYPE.FLAG,
            reason: GQLCOMMENT_FLAG_REASON.COMMENT_DETECTED_TOXIC,
          },
        ],
        metadata: {
          // Store the scores from perspective in the Comment metadata.
          perspective: scores,
        },
      };
    }

    logger.trace(
      { tenant_id: tenant.id, score, is_toxic: isToxic, threshold },
      "comment was not toxic"
    );
  } catch (err) {
    logger.error(
      { tenant_id: tenant.id, err },
      "could not determine comment toxicity"
    );
  }
};

/**
 * getScores will return the toxicity scores for the comment text.
 *
 * @param text comment text to check for toxicity
 * @param settings integration settings used to communicate with the perspective api
 * @param timeout timeout for communicating with the perspective api
 */
async function getScores(
  text: string,
  {
    key,
    endpoint,
    doNotStore,
  }: Required<Omit<GQLPerspectiveExternalIntegration, "enabled" | "threshold">>,
  timeout: number
) {
  try {
    const response = await fetch(`${endpoint}/comments:analyze?key=${key}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      timeout,
      body: JSON.stringify({
        comment: {
          text,
        },
        // TODO: (wyattjoh) support other languages.
        languages: ["en"],
        doNotStore,
        requestedAttributes: {
          TOXICITY: {},
          SEVERE_TOXICITY: {},
        },
      }),
    });

    // Grab the data out of the Perspective API.
    const data = await response.json();

    // Reformat the scores.
    return {
      TOXICITY: {
        summaryScore: data.attributeScores.TOXICITY.summaryScore.value,
      },
      SEVERE_TOXICITY: {
        summaryScore: data.attributeScores.SEVERE_TOXICITY.summaryScore.value,
      },
    };
  } catch (err) {
    // Ensure that the API key doesn't get leaked to the logs by accident.
    if (err.message) {
      err.message = err.message.replace(key, "***");
    }

    // Rethrow the error.
    throw err;
  }
}
