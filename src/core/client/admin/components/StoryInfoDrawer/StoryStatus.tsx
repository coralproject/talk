/* eslint-disable */
import React, { FunctionComponent, useState, useCallback } from "react";

import { Option, SelectField } from "coral-ui/components/v2";

import { GQLSTORY_STATUS } from "coral-framework/schema";

// TODO: Should these be moved to a common dir?
import CloseStoryMutation from "coral-admin/routes/Stories/StoryActions/CloseStoryMutation";
import OpenStoryMutation from "coral-admin/routes/Stories/StoryActions/OpenStoryMutation";
import { useMutation } from "coral-framework/lib/relay";
import { STORY_STATUS } from "coral-admin/__generated__/StoryStatusContainer_story.graphql";

export interface Props {
  storyID: string;
  currentStatus: STORY_STATUS;
}

const StoryStatus: FunctionComponent<Props> = ({ storyID, currentStatus }) => {
  const [status, setStatus] = useState(currentStatus);

  const closeStory = useMutation(CloseStoryMutation);
  const openStory = useMutation(OpenStoryMutation);

  const udpateStatus = useCallback(
    async (newStatus: GQLSTORY_STATUS) => {
      if (newStatus === currentStatus) {
        return
      };

      let op = newStatus === GQLSTORY_STATUS.OPEN ? openStory : closeStory;
      const res = await op({ id: storyID });
      const updatedStatus = res.story?.status;

      if (updatedStatus) {
        setStatus(updatedStatus);
      }

    },
    [storyID, currentStatus]
  );

  return (
    <>
      <SelectField
        value={status}
        onChange={(e) => udpateStatus(e.target.value as any)}
      >
        // TODO (marcushaddon): do we need to just hard code these?
        {Object.keys(GQLSTORY_STATUS).map((s) => (
          <Option key={s} value={s}>
            {s}
          </Option>
        ))}
      </SelectField>
    </>
  );
};

export default StoryStatus;
