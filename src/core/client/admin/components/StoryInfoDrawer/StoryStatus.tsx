import React, { FunctionComponent, useCallback } from "react";

import TranslatedStoryStatus from "coral-admin/components/TranslatedStoryStatus";

import {
  Button,
  ButtonIcon,
  ClickOutside,
  Dropdown,
  DropdownButton,
  Popover,
} from "coral-ui/components/v2";

import { GQLSTORY_STATUS } from "coral-framework/schema";

import styles from "./StoryStatus.css";

// TODO (marcushaddon): Should these be moved to a common dir?
import { STORY_STATUS } from "coral-admin/__generated__/StoryStatusContainer_story.graphql";
import CloseStoryMutation from "coral-admin/routes/Stories/StoryActions/CloseStoryMutation";
import OpenStoryMutation from "coral-admin/routes/Stories/StoryActions/OpenStoryMutation";
import { useMutation } from "coral-framework/lib/relay";

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
    <>
      <Popover
        id="story-statusChange"
        placement="bottom-start"
        description="A dropdown to change the story status"
        body={({ toggleVisibility }) => (
          <ClickOutside onClickOutside={toggleVisibility}>
            <Dropdown>
              {Object.keys(GQLSTORY_STATUS).map((s) => (
                <DropdownButton
                  className={styles.dropdownButton}
                  key={s}
                  value={s}
                  disabled={currentStatus === s}
                  onClick={() => updateStatus(s as GQLSTORY_STATUS)}
                >
                  {
                    <TranslatedStoryStatus>
                      {s as GQLSTORY_STATUS}
                    </TranslatedStoryStatus>
                  }
                </DropdownButton>
              ))}
            </Dropdown>
          </ClickOutside>
        )}
      >
        {({ toggleVisibility, visible }) => (
          <Button
            className={styles.toggleButton}
            onClick={toggleVisibility}
            color="mono"
            variant="text"
          >
            {<TranslatedStoryStatus>{currentStatus}</TranslatedStoryStatus>}
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
