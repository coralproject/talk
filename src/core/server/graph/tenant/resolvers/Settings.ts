import { Tenant } from "coral-server/models/tenant";

import {
  GQLFEATURE_FLAG,
  GQLSettingsTypeResolver,
} from "coral-server/graph/tenant/schema/__generated__/types";

const filterValidFeatureFlags = () => {
  // Compute the valid flags based on this enum.
  const flags = Object.values(GQLFEATURE_FLAG);

  // Return a type guard for the feature flag.
  return (flag: string | GQLFEATURE_FLAG): flag is GQLFEATURE_FLAG =>
    flags.includes(flag);
};

export const Settings: GQLSettingsTypeResolver<Tenant> = {
  slack: ({ slack = {} }) => slack,
  featureFlags: ({ featureFlags = [] }) =>
    featureFlags.filter(filterValidFeatureFlags()),
};
