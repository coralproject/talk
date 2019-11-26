import { Localized } from "fluent-react/compat";
import React, { FunctionComponent } from "react";

import TranslatedStoryStatus from "coral-admin/components/TranslatedStoryStatus";
import { GQLSTORY_STATUS, GQLSTORY_STATUS_RL } from "coral-framework/schema";
import {
  Button,
  ButtonIcon,
  ClickOutside,
  Dropdown,
  DropdownButton,
  Popover,
} from "coral-ui/components/v2";

import StoryStatusText from "./StoryStatusText";

import styles from "./StoryStatusChange.css";

interface Props {
  onChangeStatus: (status: GQLSTORY_STATUS_RL) => void;
  status: GQLSTORY_STATUS_RL;
}

const StoryStatusChange: FunctionComponent<Props> = props => (
  <Localized id="stories-status-popover" attrs={{ description: true }}>
    <Popover
      id="stories-statusChange"
      placement="bottom-start"
      description="A dropdown to change the user status"
      body={({ toggleVisibility }) => (
        <ClickOutside onClickOutside={toggleVisibility}>
          <Dropdown>
            {Object.keys(GQLSTORY_STATUS).map((r: GQLSTORY_STATUS_RL) => (
              <TranslatedStoryStatus
                key={r}
                container={
                  <DropdownButton
                    className={styles.dropdownButton}
                    onClick={() => {
                      props.onChangeStatus(r);
                      toggleVisibility();
                    }}
                  >
                    dummy
                  </DropdownButton>
                }
              >
                {r}
              </TranslatedStoryStatus>
            ))}
          </Dropdown>
        </ClickOutside>
      )}
    >
      {({ toggleVisibility, ref, visible }) => (
        <Localized
          id="stories-changeStatusButton"
          attrs={{ "aria-label": true }}
        >
          <Button
            aria-label="Change status"
            className={styles.button}
            onClick={toggleVisibility}
            ref={ref}
            color="mono"
            uppercase={false}
            variant="plain"
            size="small"
          >
            <StoryStatusText>{props.status}</StoryStatusText>
            {
              <ButtonIcon size="lg">
                {visible ? "arrow_drop_up" : "arrow_drop_down"}
              </ButtonIcon>
            }
          </Button>
        </Localized>
      )}
    </Popover>
  </Localized>
);

export default StoryStatusChange;
