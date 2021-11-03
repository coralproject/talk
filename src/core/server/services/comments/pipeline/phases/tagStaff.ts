// import { hasFeatureFlag } from "coral-server/models/tenant";
// import {
//   canModerate,
//   isSiteModerationScoped,
//   roleIsStaff,
// } from "coral-server/models/user/helpers";
import {
  IntermediateModerationPhase,
  IntermediatePhaseResult,
} from "coral-server/services/comments/pipeline";

import {
  // GQLFEATURE_FLAG,
  GQLTAG,
  GQLUSER_ROLE,
} from "coral-server/graph/schema/__generated__/types";

function roleAsTag(role: GQLUSER_ROLE) {
  switch (role) {
    case GQLUSER_ROLE.ADMIN:
      return GQLTAG.ADMIN;
    case GQLUSER_ROLE.MODERATOR:
      return GQLTAG.MODERATOR;
    case GQLUSER_ROLE.STAFF:
      return GQLTAG.STAFF;
    default:
      return null;
  }
}

export const tagStaff: IntermediateModerationPhase = ({
  author,
  story,
  tenant,
}): IntermediatePhaseResult | void => {
  // If user is staff, admin, or org mod, tag
  /* eslint-disable */
  // const isStaff = roleIsStaff(author.role);
  // const siteModEnabled = hasFeatureFlag(tenant, GQLFEATURE_FLAG.SITE_MODERATOR);
  // const isSiteMod = isSiteModerationScoped(author.moderationScopes)
  // const isModForSite = canModerate(author, story);

  // if (siteModEnabled && isSiteMod && !isModForSite)

  const tag = roleAsTag(author.role);
  if (!tag) {
    return;
  }

  return { tags: [tag] };
};
