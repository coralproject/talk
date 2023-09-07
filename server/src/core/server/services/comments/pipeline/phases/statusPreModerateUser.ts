import {
  IntermediateModerationPhase,
  IntermediatePhaseResult,
} from "coral-server/services/comments/pipeline";

import {
  GQLCOMMENT_STATUS,
  GQLTAG,
} from "coral-server/graph/schema/__generated__/types";

// If a given user is set to always premod, set to premod.
export const statusPreModerateUser: IntermediateModerationPhase = ({
  author,
}): IntermediatePhaseResult | void => {
  if (!author.status.premod.active) {
    return;
  }

  // if they have an active pre-mod and have the premoderated
  // because of email date set, this comment is being pre-modded
  // due to their email being caught by the email pre-mod filter.
  // tag it so moderators can see this.
  if (author.premoderatedBecauseOfEmailAt) {
    return {
      status: GQLCOMMENT_STATUS.PREMOD,
      tags: [GQLTAG.USER_EMAIL],
    };
  }

  return {
    status: GQLCOMMENT_STATUS.PREMOD,
  };
};
