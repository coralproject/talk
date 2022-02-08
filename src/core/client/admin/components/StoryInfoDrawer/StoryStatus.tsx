import React, { FunctionComponent, useCallback } from "react";

import { GQLSTORY_STATUS } from "coral-framework/schema";

import { STORY_STATUS } from "coral-admin/__generated__/StoryStatusContainer_story.graphql";
import { useMutation } from "coral-framework/lib/relay";
import CloseStoryMutation from "./CloseStoryMutation";
import OpenStoryMutation from "./OpenStoryMutation";
import Select from "./Select";

export interface Props {
  storyID: string;
  currentStatus: STORY_STATUS;
}

const { OPEN, CLOSED } = GQLSTORY_STATUS;

const localizedStoryStatus = (status: GQLSTORY_STATUS): string => {
  switch (status) {
    case OPEN:
      return "storyInfoDrawer-storyStatus-open";
    case CLOSED:
      return "storyInfoDrawer-storyStatus-closed";
  }
};

const StoryStatus: FunctionComponent<Props> = ({ storyID, currentStatus }) => {
  const closeStory = useMutation(CloseStoryMutation);
  const openStory = useMutation(OpenStoryMutation);

  const updateStatus = useCallback(
    async (newStatus: GQLSTORY_STATUS) => {
      if (newStatus === currentStatus) {
        return;
      }

      const op = newStatus === OPEN ? openStory : closeStory;
      await op({ id: storyID });
    },
    [storyID, currentStatus, closeStory, openStory]
  );

  return (
    <Select
      id="storyInfoDrawer-storyStatus"
      label="Status"
      name="status"
      description="A dropdown for setting the status of the story"
      options={Object.keys(GQLSTORY_STATUS).map((s) => ({
        value: s as GQLSTORY_STATUS,
        localizationID: localizedStoryStatus(s as GQLSTORY_STATUS),
      }))}
      selected={{
        value: currentStatus,
        localizationID: localizedStoryStatus(currentStatus as GQLSTORY_STATUS),
      }}
      onSelect={(selected) => updateStatus(selected)}
    />
  );
};

export default StoryStatus;
