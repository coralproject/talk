import {
  IntermediatePhaseResult,
  ModerationPhaseContext,
} from "coral-server/services/comments/pipeline";

export const attachedEmbed = ({
  comment,
  tenant,
  now,
}: Pick<
  ModerationPhaseContext,
  "comment" | "tenant" | "now"
>): IntermediatePhaseResult | void => {
  return {
    embeds: comment.embeds,
  };
};
