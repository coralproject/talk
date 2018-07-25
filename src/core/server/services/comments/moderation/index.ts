import { Omit, Promiseable } from "talk-common/types";
import { GQLCOMMENT_STATUS } from "talk-server/graph/tenant/schema/__generated__/types";
import { Action } from "talk-server/models/actions";
import { Asset } from "talk-server/models/asset";
import { Tenant } from "talk-server/models/tenant";
import { CreateComment } from "talk-server/services/comments";

import { User } from "talk-server/models/user";
import { Request } from "talk-server/types/express";
import { moderationPhases } from "./phases";

// TODO: (wyattjoh) move into actions module.
export type CreateAction = Omit<
  Action,
  "id" | "item_type" | "item_id" | "created_at"
>;

export interface PhaseResult {
  actions: CreateAction[];
  status: GQLCOMMENT_STATUS;
}

export interface ModerationPhaseContext {
  asset: Asset;
  tenant: Tenant;
  comment: CreateComment;
  author: User;
  req?: Request;
}

export type ModerationPhase = (
  context: ModerationPhaseContext
) => Promiseable<PhaseResult>;

export type IntermediatePhaseResult = Partial<PhaseResult> | void;

export type IntermediateModerationPhase = (
  context: ModerationPhaseContext
) => Promiseable<IntermediatePhaseResult>;

/**
 * compose will create a moderation pipeline for which is executable with the
 * passed actions.
 */
const compose = (
  phases: IntermediateModerationPhase[]
): ModerationPhase => async context => {
  const actions: CreateAction[] = [];

  // Loop over all the moderation phases and see if we've resolved the status.
  for (const phase of phases) {
    const result = await phase(context);
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
export const processForModeration: ModerationPhase = compose(moderationPhases);
