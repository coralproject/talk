import { JSDOM } from "jsdom";
import { memoize } from "lodash";

import removeTrailingEmptyLines from "coral-common/helpers/removeTrailingEmptyLines";
import {
  convertGQLRTEConfigToRTEFeatures,
  createSanitize,
} from "coral-common/helpers/sanitize";
import { defaultRTEConfiguration } from "coral-server/models/settings";
import { hasFeatureFlag, Tenant } from "coral-server/models/tenant";
import {
  IntermediateModerationPhase,
  IntermediatePhaseResult,
} from "coral-server/services/comments/pipeline";

import { GQLFEATURE_FLAG } from "coral-server/graph/schema/__generated__/types";

// Initializing JSDOM and DOMPurify
const window = new JSDOM("", {}).window;

/**
 * config2CacheKey returns a stable cache key from a `GQLRTEConfiguration` object.
 */
function configToCacheKey(tenant: Tenant): string {
  if (!tenant.rte) {
    return "";
  }

  let ret = "";

  if (tenant.rte.enabled) {
    ret += "e";
  }

  if (tenant.rte.spoiler) {
    ret += "sp";
  }

  if (hasFeatureFlag(tenant, GQLFEATURE_FLAG.RTE_SARCASM)) {
    ret += "sm";
  }

  if (tenant.rte.strikethrough) {
    ret += "st";
  }

  return ret;
}

const createSanitizeMemoized = memoize(
  (tenant: Tenant) => {
    // Default the RTE Configuration to the default one.
    const config = tenant.rte || defaultRTEConfiguration;

    return createSanitize(window as any, {
      // Merge in the sarcasm check from the feature flag.
      features: convertGQLRTEConfigToRTEFeatures({
        ...config,
        sarcasm: hasFeatureFlag(tenant, GQLFEATURE_FLAG.RTE_SARCASM),
      }),
    });
  },
  // cache key resolver.
  configToCacheKey
);

function sanitizeCommentBody(tenant: Tenant, source: string) {
  const sanitize = createSanitizeMemoized(tenant);

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
  const { body, linkCount } = sanitizeCommentBody(tenant, comment.body);

  return {
    body,
    metadata: {
      linkCount,
    },
  };
};
