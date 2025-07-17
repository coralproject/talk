import { FluentBundle } from "@fluent/bundle/compat";

import { Config } from "coral-server/config";
import { InternalError } from "coral-server/errors";
import { translate } from "coral-server/services/i18n";

import {
  GQLFEATURE_FLAG,
  GQLGIF_MEDIA_SOURCE,
} from "coral-server/graph/schema/__generated__/types";

import { AuthIntegrations } from "../settings";
import { LEGACY_FEATURE_FLAGS, Tenant } from "./tenant";

export const getDefaultReactionConfiguration = (
  bundle?: FluentBundle
): Tenant["reaction"] => {
  return {
    // By default, the standard reaction style will use the Respect with the
    // handshake.
    label: bundle
      ? translate(bundle, "Respect", "reaction-labelRespect")
      : "Respect",
    labelActive: bundle
      ? translate(bundle, "Respected", "reaction-labelActiveRespected")
      : "Respected",
    sortLabel: bundle
      ? translate(bundle, "Most Respected", "reaction-sortLabelMostRespected")
      : "Most Respected",
    icon: "thumb_up",
  };
};

export const getDefaultBadgeConfiguration = (
  bundle?: FluentBundle
): Tenant["badges"] => {
  return {
    label: bundle ? translate(bundle, "Staff", "staff-label") : "Staff",
    adminLabel: bundle ? translate(bundle, "Staff", "staff-label") : "Staff",
    staffLabel: bundle ? translate(bundle, "Staff", "staff-label") : "Staff",
    moderatorLabel: bundle
      ? translate(bundle, "Staff", "staff-label")
      : "Staff",
    memberLabel: bundle
      ? translate(bundle, "Member", "member-label")
      : "Member",
  };
};

/**
 * hasFeatureFlag will check to see if the Tenant has a particular feature flag
 * enabled.
 * @param tenant the Tenant to test for a feature flag
 * @param flag the FEATURE_FLAG to check for
 */
export function hasFeatureFlag(
  tenant: Pick<Tenant, "featureFlags">,
  flag: GQLFEATURE_FLAG | LEGACY_FEATURE_FLAGS
) {
  if (tenant.featureFlags?.includes(flag)) {
    return true;
  }

  return false;
}

export function ensureFeatureFlag(
  tenant: Pick<Tenant, "featureFlags">,
  flag: GQLFEATURE_FLAG | LEGACY_FEATURE_FLAGS
) {
  if (!hasFeatureFlag(tenant, flag)) {
    throw new InternalError("tenant does not have feature flag enabled", {
      flag,
    });
  }
}

export function hasEnabledAuthIntegration(
  config: Config,
  tenant: Pick<Tenant, "auth" | "featureFlags">,
  integration: keyof AuthIntegrations
) {
  const forceAdminLocalAuth = config.get("force_admin_local_auth");
  if (integration === "local" && forceAdminLocalAuth) {
    return true;
  }

  return tenant.auth.integrations[integration].enabled;
}

export function linkUsersAvailable(
  config: Config,
  tenant: Pick<Tenant, "auth">
) {
  return (
    hasEnabledAuthIntegration(config, tenant, "local") &&
    (hasEnabledAuthIntegration(config, tenant, "bsky") ||
      hasEnabledAuthIntegration(config, tenant, "facebook") ||
      hasEnabledAuthIntegration(config, tenant, "google"))
  );
}

export function getWebhookEndpoint(
  tenant: Pick<Tenant, "webhooks">,
  endpointID: string
) {
  return tenant.webhooks?.endpoints.find((e) => e.id === endpointID) || null;
}

export function supportsMediaType(
  tenant: Pick<Tenant, "media" | "featureFlags">,
  type: "twitter" | "bluesky" | "youtube" | "giphy" | "tenor" | "external"
): tenant is Omit<Tenant, "media"> & Required<Pick<Tenant, "media">> {
  switch (type) {
    case "external":
      return hasFeatureFlag(tenant, GQLFEATURE_FLAG.EXTERNAL_MEDIA);
    case "twitter":
      return !!tenant.media?.twitter.enabled;
    case "bluesky":
      return !!tenant.media?.bluesky.enabled;
    case "youtube":
      return !!tenant.media?.youtube.enabled;
    case "giphy":
      return (
        !!tenant.media?.gifs?.enabled &&
        !!tenant.media.gifs.key &&
        tenant.media.gifs.provider === GQLGIF_MEDIA_SOURCE.GIPHY
      );
    case "tenor":
      return (
        !!tenant.media?.gifs?.enabled &&
        !!tenant.media.gifs.key &&
        tenant.media.gifs.provider === GQLGIF_MEDIA_SOURCE.TENOR
      );
  }
}

export function isAMPEnabled(tenant: Pick<Tenant, "featureFlags" | "amp">) {
  if (typeof tenant.amp === "boolean") {
    return tenant.amp;
  }
  return hasFeatureFlag(tenant, LEGACY_FEATURE_FLAGS.ENABLE_AMP);
}

export function areRepliesFlattened(
  tenant: Pick<Tenant, "featureFlags" | "flattenReplies">
) {
  if (typeof tenant.flattenReplies === "boolean") {
    return tenant.flattenReplies;
  }

  return hasFeatureFlag(tenant, LEGACY_FEATURE_FLAGS.FLATTEN_REPLIES);
}

export function isForReviewQueueEnabled(
  tenant: Pick<Tenant, "featureFlags" | "forReviewQueue">
) {
  if (typeof tenant.forReviewQueue === "boolean") {
    return tenant.forReviewQueue;
  }
  return hasFeatureFlag(tenant, LEGACY_FEATURE_FLAGS.FOR_REVIEW);
}
