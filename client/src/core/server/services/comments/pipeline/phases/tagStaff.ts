import { isSiteModerationScoped } from "coral-common/permissions";
import { canModerate } from "coral-server/models/user/helpers";
import {
  IntermediateModerationPhase,
  IntermediatePhaseResult,
} from "coral-server/services/comments/pipeline";

import {
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
}): IntermediatePhaseResult | void => {
  const isSiteMod = isSiteModerationScoped(author.moderationScopes);
  const isModForSite = canModerate(author, story);

  if (isSiteMod && !isModForSite) {
    return;
  }

  const tag = roleAsTag(author.role);
  if (!tag) {
    return;
  }

  return { tags: [tag] };
};
