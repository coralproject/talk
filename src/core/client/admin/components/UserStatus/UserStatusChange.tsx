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
            {banned ? (
              <Localized id="community-userStatus-removeUserBan">
                <DropdownButton
                  className={styles.dropdownButton}
                  onClick={() => {
                    onRemoveBan();
                    toggleVisibility();
                  }}
                >
                  Remove ban
                </DropdownButton>
              </Localized>
            ) : (
              <Localized id="community-userStatus-ban">
                <DropdownButton
                  className={styles.dropdownButton}
                  onClick={() => {
                    onBan();
                    toggleVisibility();
                  }}
                >
                  Ban
                </DropdownButton>
              </Localized>
            )}
            {suspended ? (
              <Localized id="community-userStatus-removeUserSuspension">
                <DropdownButton
                  className={styles.dropdownButton}
                  onClick={() => {
                    onRemoveSuspension();
                    toggleVisibility();
                  }}
                >
                  Remove suspension
                </DropdownButton>
              </Localized>
            ) : (
              <Localized id="community-userStatus-suspend">
                <DropdownButton
                  className={styles.dropdownButton}
                  onClick={() => {
                    onSuspend();
                    toggleVisibility();
                  }}
                >
                  Suspend
                </DropdownButton>
              </Localized>
            )}
            {premod ? (
              <Localized id="community-userStatus-removePremod">
                <DropdownButton
                  className={styles.dropdownButton}
                  onClick={() => {
                    onRemovePremod();
                    toggleVisibility();
                  }}
                >
                  Remove always pre-moderate
                </DropdownButton>
              </Localized>
            ) : (
              <Localized id="community-userStatus-premodUser">
                <DropdownButton
                  className={styles.dropdownButton}
                  onClick={() => {
                    onPremod();
                    toggleVisibility();
                  }}
                >
                  Always pre-moderate
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
