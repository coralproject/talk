import { Environment } from "relay-runtime";

import getStory from "./getStory";

export default function getStorySettings(environment: Environment, id: string) {
  const story = getStory(environment, id);
  if (!story) {
    return null;
  }
  const storySettingsRef = story.settings.__ref;
  return environment
    .getStore()
    .getSource()
    .get(storySettingsRef);
}
