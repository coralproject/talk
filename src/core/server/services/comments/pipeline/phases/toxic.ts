import { isNil } from "lodash";
import ms from "ms";
import fetch from "node-fetch";
import path from "path";
import { URL } from "url";

import {
  TOXICITY_ENDPOINT_DEFAULT,
  TOXICITY_MODEL_DEFAULT,
  TOXICITY_THRESHOLD_DEFAULT,
} from "coral-common/constants";
import { LanguageCode } from "coral-common/helpers";
import { Omit } from "coral-common/types";
import { ToxicCommentError } from "coral-server/errors";
import logger from "coral-server/logger";
import { ACTION_TYPE } from "coral-server/models/action/comment";
import {
  IntermediateModerationPhase,
  IntermediatePhaseResult,
  ModerationPhaseContext,
} from "coral-server/services/comments/pipeline";

import {
  GQLCOMMENT_FLAG_REASON,
  GQLCOMMENT_STATUS,
  GQLPerspectiveExternalIntegration,
} from "coral-server/graph/tenant/schema/__generated__/types";

export const toxic: IntermediateModerationPhase = async ({
  tenant,
  nudge,
  log,
  htmlStripped,
}: Pick<
  ModerationPhaseContext,
  "tenant" | "nudge" | "log" | "htmlStripped"
>): Promise<IntermediatePhaseResult | void> => {
  if (!htmlStripped) {
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

  let endpoint = integration.endpoint;
  if (isNil(endpoint)) {
    endpoint = TOXICITY_ENDPOINT_DEFAULT;

    log.trace(
      { endpoint },
      "endpoint missing in integration settings, using defaults"
    );
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

  // TODO: (wyattjoh) replace hardcoded default with config.
  const timeout = ms("800ms");

  try {
    logger.trace("checking comment toxicity");

    // Pull the custom model out.
    const model = integration.model || TOXICITY_MODEL_DEFAULT;

    // Get the language from the tenant's set language. This won't be a 1-1
    // mapping because the Perspective API doesn't support all the languages
    // that Coral supports in production.
    const language = convertLanguage(tenant.locale);

    // Call into the Toxic comment API.
    const score = await getScore(
      htmlStripped,
      {
        endpoint,
        key: integration.key,
        doNotStore,
        model,
      },
      language,
      timeout
    );

    const isToxic = score > threshold;
    if (isToxic) {
      log.trace({ score, isToxic, threshold, model }, "comment was toxic");

      // Throw an error if we're nudging instead of recording.
      if (nudge) {
        throw new ToxicCommentError(model, score, threshold);
      }

      return {
        status: GQLCOMMENT_STATUS.SYSTEM_WITHHELD,
        actions: [
          {
            userID: null,
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

    log.trace({ score, isToxic, threshold }, "comment was not toxic");

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

/**
 * Language is the language key that is supported by the Perspective API in the
 * ISO 631-1 format.
 */
type PerspectiveLanguage = "en" | "es" | "fr" | "de";

/**
 * convertLanguage returns the language code for the related Perspective API
 * model in the ISO 631-1 format.
 *
 * @param locale the language on the tenant in the BCP 47 format.
 */
function convertLanguage(locale: LanguageCode): PerspectiveLanguage {
  switch (locale) {
    case "en-US":
      return "en";
    case "es":
      return "es";
    case "de":
      return "de";
    default:
      return "en";
  }
}

/**
 * getScore will return the toxicity score for the comment text.
 *
 * @param text comment text to check for toxicity
 * @param model the specific model to use when storing the toxicity
 * @param settings integration settings used to communicate with the perspective api
 * @param timeout timeout for communicating with the perspective api
 */
async function getScore(
  text: string,
  {
    key,
    endpoint,
    model,
    doNotStore,
  }: Required<Omit<GQLPerspectiveExternalIntegration, "enabled" | "threshold">>,
  language: PerspectiveLanguage,
  timeout: number
): Promise<number> {
  // Prepare the URL to send the command to.
  const url = new URL(endpoint.trim());
  url.pathname = path.join(url.pathname, "/comments:analyze");
  url.searchParams.set("key", key.trim());

  try {
    const response = await fetch(url.toString(), {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      timeout,
      body: JSON.stringify({
        comment: {
          text,
        },
        languages: [language],
        doNotStore,
        requestedAttributes: {
          [model]: {},
        },
      }),
    });

    // Grab the data out of the Perspective API.
    const data = await response.json();

    // Reformat the scores.
    return data.attributeScores[model].summaryScore.value as number;
  } catch (err) {
    // Ensure that the API key doesn't get leaked to the logs by accident.
    if (err.message) {
      err.message = err.message.replace(url.searchParams.toString(), "***");
    }

    // Rethrow the error.
    throw err;
  }
}
