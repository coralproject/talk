import { StoryClosedError } from "coral-server/errors";
import { isStoryClosed } from "coral-server/models/story";
import {
  IntermediatePhaseResult,
  ModerationPhaseContext,
} from "coral-server/services/comments/pipeline";

// This phase checks to see if the story being processed is closed or not.
export const storyClosed = ({
  story,
  tenant,
  now,
}: Pick<
  ModerationPhaseContext,
  "story" | "tenant" | "now"
>): IntermediatePhaseResult | void => {
  if (isStoryClosed(tenant, story, now)) {
    throw new StoryClosedError();
  }
};
