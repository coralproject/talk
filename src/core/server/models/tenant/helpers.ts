import { FluentBundle } from "@fluent/bundle/compat";

import { translate } from "coral-server/services/i18n";

import {
  GQLAuthIntegrations,
  GQLFEATURE_FLAG,
  GQLReactionConfiguration,
  GQLStaffConfiguration,
} from "coral-server/graph/schema/__generated__/types";

import { Tenant } from "./tenant";

export const getDefaultReactionConfiguration = (
  bundle: FluentBundle
): GQLReactionConfiguration => ({
  // By default, the standard reaction style will use the Respect with the
  // handshake.
  label: translate(bundle, "Respect", "reaction-labelRespect"),
  labelActive: translate(bundle, "Respected", "reaction-labelActiveRespected"),
  sortLabel: translate(
    bundle,
    "Most Respected",
    "reaction-sortLabelMostRespected"
  ),
  icon: "thumb_up",
});

export const getDefaultStaffConfiguration = (
  bundle: FluentBundle
): GQLStaffConfiguration => ({
  label: translate(bundle, "Staff", "staff-label"),
});

/**
 * hasFeatureFlag will check to see if the Tenant has a particular feature flag
 * enabled.
 *
 * @param tenant the Tenant to test for a feature flag
 * @param flag the FEATURE_FLAG to check for
 */
export function hasFeatureFlag(
  tenant: Pick<Tenant, "featureFlags">,
  flag: GQLFEATURE_FLAG
) {
  if (tenant.featureFlags && tenant.featureFlags.includes(flag)) {
    return true;
  }

  return false;
}

export function hasEnabledAuthIntegration(
  tenant: Pick<Tenant, "auth">,
  integration: keyof GQLAuthIntegrations
) {
  return tenant.auth.integrations[integration].enabled;
}

export function linkUsersAvailable(tenant: Pick<Tenant, "auth">) {
  return (
    hasEnabledAuthIntegration(tenant, "local") &&
    (hasEnabledAuthIntegration(tenant, "facebook") ||
      hasEnabledAuthIntegration(tenant, "google"))
  );
}

export function getWebhookEndpoint(
  tenant: Pick<Tenant, "webhooks">,
  endpointID: string
) {
  return tenant.webhooks.endpoints.find((e) => e.id === endpointID) || null;
}
