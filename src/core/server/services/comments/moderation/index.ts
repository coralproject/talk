import { Promiseable } from "talk-common/types";
import { GQLCOMMENT_STATUS } from "talk-server/graph/tenant/schema/__generated__/types";
import { Asset } from "talk-server/models/asset";
import { Tenant } from "talk-server/models/tenant";
import { CreateComment } from "talk-server/services/comments";

import { moderationPhases } from "./phases";

export interface PhaseResult {
  actions: any[]; // FIXME: (wyattjoh) replace with an Action.
  status: GQLCOMMENT_STATUS;
}

export type ModerationPhase = (
  asset: Asset,
  tenant: Tenant,
  comment: CreateComment
) => Promiseable<PhaseResult>;

export type IntermediatePhaseResult = Partial<PhaseResult> | undefined | void;

export type IntermediateModerationPhase = (
  asset: Asset,
  tenant: Tenant,
  comment: CreateComment
) => Promiseable<IntermediatePhaseResult>;

/**
 * compose will create a moderation pipeline for which is executable with the
 * passed actions.
 */
const compose = (
  phases: IntermediateModerationPhase[]
): ModerationPhase => async (asset, tenant, comment) => {
  const actions: string[] = [];

  // Loop over all the moderation phases and see if we've resolved the status.
  for (const phase of phases) {
    const result = await phase(asset, tenant, comment);
    if (result) {
      if (result.actions) {
        actions.push(...result.actions);
      }

      // If this result contained a status, then we've finished resolving
      // phases!
      const { status } = result;
      if (status) {
        return { status, actions };
      }
    }
  }

  // If we didn't determine a different comment from a previous itteration, set
  // it to 'NONE'.
  return { status: GQLCOMMENT_STATUS.NONE, actions };
};

/**
 * process the comment and return moderation details.
 */
export const processForModeration: ModerationPhase = async (
  asset,
  tenant,
  comment
) => compose(moderationPhases)(asset, tenant, comment);
