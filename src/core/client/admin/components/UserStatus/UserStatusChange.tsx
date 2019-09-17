import cn from "classnames";
import { Localized } from "fluent-react/compat";
import React, { FunctionComponent } from "react";

import {
  Button,
  ButtonIcon,
  ClickOutside,
  Dropdown,
  DropdownButton,
  Popover,
} from "coral-ui/components";

import styles from "./UserStatusChange.css";

interface Props {
  onBan: () => void;
  onRemoveBan: () => void;
  onSuspend: () => void;
  onRemoveSuspension: () => void;
  onPremod: () => void;
  onRemovePremod: () => void;
  banned: boolean;
  suspended: boolean;
  premod: boolean;
  children: React.ReactNode;
  fullWidth?: boolean;
}

const UserStatusChange: FunctionComponent<Props> = ({
  onBan,
  onRemoveBan,
  onSuspend,
  onRemoveSuspension,
  onPremod,
  onRemovePremod,
  banned,
  suspended,
  premod,
  children,
  fullWidth = true,
}) => (
  <Localized id="community-userStatus-popover" attrs={{ description: true }}>
    <Popover
      id="community-statusChange"
      placement="bottom-start"
      description="A dropdown to change the user status"
      body={({ toggleVisibility }) => (
        <ClickOutside onClickOutside={toggleVisibility}>
          <Dropdown>
            {!banned && (
              <Localized id="community-userStatus-banUser">
                <DropdownButton
                  className={styles.dropdownButton}
                  onClick={() => {
                    onBan();
                    toggleVisibility();
                  }}
                >
                  Ban User
                </DropdownButton>
              </Localized>
            )}
            {banned && (
              <Localized id="community-userStatus-removeBan">
                <DropdownButton
                  className={styles.dropdownButton}
                  onClick={() => {
                    onRemoveBan();
                    toggleVisibility();
                  }}
                >
                  Remove Ban
                </DropdownButton>
              </Localized>
            )}
            {!suspended && (
              <Localized id="community-userStatus-suspendUser">
                <DropdownButton
                  className={styles.dropdownButton}
                  onClick={() => {
                    onSuspend();
                    toggleVisibility();
                  }}
                >
                  Suspend User
                </DropdownButton>
              </Localized>
            )}
            {suspended && (
              <Localized id="community-userStatus-removeSuspension">
                <DropdownButton
                  className={styles.dropdownButton}
                  onClick={() => {
                    onRemoveSuspension();
                    toggleVisibility();
                  }}
                >
                  Remove Suspension
                </DropdownButton>
              </Localized>
            )}
            {!premod && (
              <Localized id="community-userStatus-premodUser">
                <DropdownButton
                  className={styles.dropdownButton}
                  onClick={() => {
                    onPremod();
                    toggleVisibility();
                  }}
                >
                  Always Premod User
                </DropdownButton>
              </Localized>
            )}
            {premod && (
              <Localized id="community-userStatus-removePremod">
                <DropdownButton
                  className={styles.dropdownButton}
                  onClick={() => {
                    onRemovePremod();
                    toggleVisibility();
                  }}
                >
                  Remove Always Premoderate
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
            className={cn(styles.button, { [styles.fullWidth]: fullWidth })}
            onClick={toggleVisibility}
            ref={ref}
            variant="regular"
            size="small"
          >
            {children}
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
