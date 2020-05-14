import { Db } from "mongodb";
import striptags from "striptags";

import { Promiseable, RequireProperty } from "coral-common/types";
import { Config } from "coral-server/config";
import { Logger } from "coral-server/logger";
import { CreateActionInput } from "coral-server/models/action/comment";
import {
  CreateCommentInput,
  RevisionMetadata
} from "coral-server/models/comment";
import { Story } from "coral-server/models/story";
import { Tenant } from "coral-server/models/tenant";
import { User } from "coral-server/models/user";
import { AugmentedRedis } from "coral-server/services/redis";
import { Request } from "coral-server/types/express";

import {
  GQLCOMMENT_STATUS,
  GQLTAG
} from "coral-server/graph/schema/__generated__/types";

import { mergePhaseResult } from "./helpers";
import { moderationPhases } from "./phases";

export type ModerationAction = Omit<
  CreateActionInput,
  "commentID" | "commentRevisionID" | "storyID" | "siteID" | "userID"
>;

export interface PhaseResult {
  actions: ModerationAction[];
  status: GQLCOMMENT_STATUS;

  /**
   * metadata should be added to the comment revision when it is created/edited.
   */
  metadata: RevisionMetadata;

  /**
   * body when returned should replace the comment body as it is currently.
   */
  body: string;

  /**
   * tags should be added to the comment when it is created. Tags are not added
   * when a comment is edited.
   */
  tags: GQLTAG[];
}

export interface ModerationPhaseContextInput {
  mongo: Db;
  redis: AugmentedRedis;
  config: Config;
  log: Logger;
  story: Story;
  tenant: Tenant;
  comment: RequireProperty<Partial<CreateCommentInput>, "body" | "ancestorIDs">;
  author: User;
  now: Date;
  action: "NEW" | "EDIT";
  nudge?: boolean;
  req?: Request;
}

export interface ModerationPhaseContext extends ModerationPhaseContextInput {
  /**
   * htmlStripped is the HTML stripped version of the comment body.
   */
  htmlStripped: string;
}

export type RootModerationPhase = (
  context: ModerationPhaseContextInput
) => Promiseable<PhaseResult>;

export type IntermediatePhaseResult = Partial<PhaseResult> | void;

export interface IntermediateModerationPhaseContext
  extends ModerationPhaseContext {
  metadata: RevisionMetadata;
  tags: GQLTAG[];
}

export type IntermediateModerationPhase = (
  context: IntermediateModerationPhaseContext
) => Promiseable<IntermediatePhaseResult>;

/**
 * compose will create a moderation pipeline for which is executable with the
 * passed actions.
 */
export const compose = (
  phases: IntermediateModerationPhase[]
): RootModerationPhase => async context => {
  const final: PhaseResult = {
    status: GQLCOMMENT_STATUS.NONE,
    body: context.comment.body,
    actions: [],
    metadata: {
      // Merge in the passed comment metadata.
      ...(context.comment.metadata || {}),

      // Add the nudge to the comment metadata.
      nudge: context.nudge
    },
    tags: []
  };

  // Strip the tags from the comment body so that filters that can't process
  // HTML can reuse it.
  const htmlStripped = striptags(final.body);

  // Loop over all the moderation phases and see if we've resolved the status.
  for (const phase of phases) {
    const result = await phase({
      ...context,
      comment: {
        ...context.comment,
        body: final.body
      },
      tags: final.tags,
      htmlStripped,
      metadata: final.metadata
    });
    if (result) {
      // Merge the results in. If we're finished, break now!
      const finished = mergePhaseResult(result, final);
      if (finished) {
        return final;
      }
    }
  }

  return final;
};

/**
 * process the comment and return moderation details.
 */
export const processForModeration: RootModerationPhase = compose(
  moderationPhases
);
