import { Localized } from "fluent-react/compat";
import React, { StatelessComponent } from "react";

import {
  Button,
  ButtonIcon,
  ClickOutside,
  Dropdown,
  DropdownButton,
  Popover,
} from "talk-ui/components";

import styles from "./UserStatusChange.css";

interface Props {
  onBan: () => void;
  onRemoveBan: () => void;
  onSuspend: () => void;
  onRemoveSuspension: () => void;
  banned: boolean;
  suspended: boolean;
  children: React.ReactNode;
}

const UserStatusChange: StatelessComponent<Props> = props => (
  <Localized id="community-userStatus-popover" attrs={{ description: true }}>
    <Popover
      id="community-statusChange"
      placement="bottom-start"
      description="A dropdown to change the user status"
      body={({ toggleVisibility }) => (
        <ClickOutside onClickOutside={toggleVisibility}>
          <Dropdown>
            {!props.banned && (
              <Localized id="community-userStatus-banUser">
                <DropdownButton
                  className={styles.dropdownButton}
                  onClick={() => {
                    props.onBan();
                    toggleVisibility();
                  }}
                >
                  Ban User
                </DropdownButton>
              </Localized>
            )}
            {props.banned && (
              <Localized id="community-userStatus-removeBan">
                <DropdownButton
                  className={styles.dropdownButton}
                  onClick={() => {
                    props.onRemoveBan();
                    toggleVisibility();
                  }}
                >
                  Remove Ban
                </DropdownButton>
              </Localized>
            )}
            {!props.suspended && (
              <Localized id="community-userStatus-suspendUser">
                <DropdownButton
                  className={styles.dropdownButton}
                  onClick={() => {
                    props.onSuspend();
                    toggleVisibility();
                  }}
                >
                  Suspend User
                </DropdownButton>
              </Localized>
            )}
            {props.suspended && (
              <Localized id="community-userStatus-removeSuspension">
                <DropdownButton
                  className={styles.dropdownButton}
                  onClick={() => {
                    props.onRemoveSuspension();
                    toggleVisibility();
                  }}
                >
                  Remove Suspension
                </DropdownButton>
              </Localized>
            )}
          </Dropdown>
        </ClickOutside>
      )}
    >
      {({ toggleVisibility, ref, visible }) => (
        <Localized
          id="community-userStatus-changeButton"
          attrs={{ "aria-label": true }}
        >
          <Button
            aria-label="Change user status"
            className={styles.button}
            onClick={toggleVisibility}
            ref={ref}
            variant="regular"
            size="small"
          >
            {props.children}
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

export default UserStatusChange;
