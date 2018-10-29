import { Omit, Promiseable } from "talk-common/types";
import { GQLCOMMENT_STATUS } from "talk-server/graph/tenant/schema/__generated__/types";
import { CreateActionInput } from "talk-server/models/action";
import { Comment } from "talk-server/models/comment";
import { Story } from "talk-server/models/story";
import { Tenant } from "talk-server/models/tenant";
import { User } from "talk-server/models/user";
import { Request } from "talk-server/types/express";

import { moderationPhases } from "./phases";

export type ModerationAction = Omit<CreateActionInput, "item_id" | "item_type">;

export interface PhaseResult {
  actions: ModerationAction[];
  status: GQLCOMMENT_STATUS;
  metadata: Record<string, any>;
}

export interface ModerationPhaseContext {
  story: Story;
  tenant: Tenant;
  comment: Partial<Comment>;
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
export const compose = (
  phases: IntermediateModerationPhase[]
): ModerationPhase => async context => {
  const final: PhaseResult = {
    status: GQLCOMMENT_STATUS.NONE,
    actions: [],
    metadata: {},
  };

  // Loop over all the moderation phases and see if we've resolved the status.
  for (const phase of phases) {
    const result = await phase(context);
    if (result) {
      // If this result contained actions, then we should push it into the
      // other actions.
      const { actions } = result;
      if (actions) {
        final.actions.push(...actions);
      }

      // If this result contained metadata, then we should merge it into the
      // other metadata.
      const { metadata } = result;
      if (metadata) {
        final.metadata = {
          ...final.metadata,
          ...metadata,
        };
      }

      // If this result contained a status, then we've finished resolving
      // phases!
      const { status } = result;
      if (status) {
        final.status = status;
        break;
      }
    }
  }

  return final;
};

/**
 * process the comment and return moderation details.
 */
export const processForModeration: ModerationPhase = compose(moderationPhases);
