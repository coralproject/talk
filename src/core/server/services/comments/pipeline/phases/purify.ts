import { JSDOM } from "jsdom";
import { memoize } from "lodash";

import removeTrailingEmptyLines from "coral-common/helpers/removeTrailingEmptyLines";
import {
  convertGQLRTEConfigToRTEFeatures,
  createSanitize,
} from "coral-common/helpers/sanitize";
import { defaultRTEConfiguration } from "coral-server/models/settings";
import {
  IntermediateModerationPhase,
  IntermediatePhaseResult,
} from "coral-server/services/comments/pipeline";

import { GQLRTEConfiguration } from "coral-server/graph/schema/__generated__/types";

// Initializing JSDOM and DOMPurify
const window = new JSDOM("", {}).window;

/**
 * config2CacheKey returns a stable cache key from a `GQLRTEConfiguration` object.
 */
function config2CacheKey(config: GQLRTEConfiguration) {
  let ret = "";
  if (config.enabled) {
    ret += "e";
  }
  if (config.spoiler) {
    ret += "sp";
  }
  if (config.strikethrough) {
    ret += "st";
  }
  return ret;
}

const createSanitizeMemoized = memoize(
  (config: GQLRTEConfiguration) => {
    return createSanitize(window as any, {
      features: convertGQLRTEConfigToRTEFeatures(config),
    });
  },
  // cache key resolver.
  config2CacheKey
);

function sanitizeCommentBody(
  config: GQLRTEConfiguration = defaultRTEConfiguration,
  source: string
) {
  const sanitize = createSanitizeMemoized(config);

  // Sanitize and return the HTMLBodyElement for the parsed source.
  const sanitized = sanitize(source);

  // Count the total number of anchor links in the sanitized output, this is the
  // number of links.
  const linkCount = sanitized.getElementsByTagName("a").length;

  // Remove empty trailing lines.
  removeTrailingEmptyLines(sanitized);

  return {
    body: sanitized.innerHTML,
    linkCount,
  };
}

export const purify: IntermediateModerationPhase = async ({
  comment,
  tenant,
}): Promise<IntermediatePhaseResult | void> => {
  const { body, linkCount } = sanitizeCommentBody(tenant.rte, comment.body);

  return {
    body,
    metadata: {
      linkCount,
    },
  };
};
