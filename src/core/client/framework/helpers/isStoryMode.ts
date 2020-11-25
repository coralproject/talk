import { GQLSTORY_MODE } from "coral-framework/schema";

function isStoryMode(storyMode: any): storyMode is GQLSTORY_MODE {
  if (!storyMode) {
    return false;
  }

  return Object.values(GQLSTORY_MODE).includes(storyMode as GQLSTORY_MODE);
}

export default isStoryMode;
