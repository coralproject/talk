import React, { FunctionComponent, useCallback } from "react";

import { GQLSTORY_STATUS } from "coral-framework/schema";

// TODO (marcushaddon): Should these be moved to a common dir?
import { STORY_STATUS } from "coral-admin/__generated__/StoryStatusContainer_story.graphql";
import CloseStoryMutation from "coral-admin/routes/Stories/StoryActions/CloseStoryMutation";
import OpenStoryMutation from "coral-admin/routes/Stories/StoryActions/OpenStoryMutation";
import { useMutation } from "coral-framework/lib/relay";
import Select from "./Select";

export interface Props {
  storyID: string;
  currentStatus: STORY_STATUS;
}

const StoryStatus: FunctionComponent<Props> = ({ storyID, currentStatus }) => {
  const closeStory = useMutation(CloseStoryMutation);
  const openStory = useMutation(OpenStoryMutation);

  const updateStatus = useCallback(
    async (newStatus: GQLSTORY_STATUS) => {
      if (newStatus === currentStatus) {
        return;
      }

      const op = newStatus === GQLSTORY_STATUS.OPEN ? openStory : closeStory;
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
      options={Object.keys(GQLSTORY_STATUS)}
      selected={currentStatus}
      onSelect={(selected) => updateStatus(selected)}
    />
  );
};

export default StoryStatus;
