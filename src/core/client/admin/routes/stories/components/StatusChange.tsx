import { Localized } from "fluent-react/compat";
import React, { StatelessComponent } from "react";

import TranslatedStoryStatus from "talk-admin/components/TranslatedStoryStatus";
import { GQLSTORY_STATUS, GQLSTORY_STATUS_RL } from "talk-framework/schema";
import {
  Button,
  ButtonIcon,
  ClickOutside,
  Dropdown,
  DropdownButton,
  Popover,
} from "talk-ui/components";

import styles from "./StatusChange.css";
import StatusText from "./StatusText";

interface Props {
  onChangeStatus: (status: GQLSTORY_STATUS_RL) => void;
  status: GQLSTORY_STATUS_RL;
}

const StatusChange: StatelessComponent<Props> = props => (
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
            variant="regular"
            size="small"
          >
            <StatusText>{props.status}</StatusText>
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

export default StatusChange;
