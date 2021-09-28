/* eslint-disable */
import React, { FunctionComponent, useState, useCallback } from "react";

import {
  Button,
  ButtonIcon,
  ClickOutside,
  Dropdown,
  DropdownButton,
  Popover
} from "coral-ui/components/v2";

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
      <Popover
        id="story-statusChange"
        placement="bottom-start"
        description="A dropdown to change the story status"
        body={({ toggleVisibility, ...rest }) => {
          console.log('BODY FUNC', rest)
          return <div>fuck you</div>
        }}
      >
        {({ toggleVisibility, visible }) => (
          // TODO: Localize
          <Button
            onClick={toggleVisibility}
            color="mono"
          >
            {currentStatus}
            {
              <ButtonIcon size="lg">
                {visible ? "arrow_drop_up" : "arrow_drop_down"}
              </ButtonIcon>
            }
          </Button>
        )}
      </Popover>
    </>
  );
};

export default StoryStatus;
