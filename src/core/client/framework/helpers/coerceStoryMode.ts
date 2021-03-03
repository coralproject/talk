import { GQLSTORY_MODE } from "coral-common/schema";

import isStoryMode from "./isStoryMode";

function coerceStoryMode(storyMode: any): GQLSTORY_MODE | null {
  if (!storyMode || !isStoryMode(storyMode)) {
    return null;
  }

  return storyMode;
}

export default coerceStoryMode;
