import { Localized } from "@fluent/react/compat";
import cn from "classnames";
import React, { FunctionComponent } from "react";

import {
  Button,
  ButtonIcon,
  ClickOutside,
  Dropdown,
  DropdownButton,
  Popover,
} from "coral-ui/components/v2";

import styles from "./UserStatusChange.css";

interface Props {
  /**
   * onBan when set to false disables the controls associated with banning a
   * user. Otherwise the provided function is called when the control is
   * clicked.
   */
  onBan: false | (() => void);

  /**
   * onRemoveBan when set to false disables the controls associated with
   * banning a user. Otherwise the provided function is called when the control
   * is clicked.
   */
  onRemoveBan: false | (() => void);

  onSuspend: () => void;
  onRemoveSuspension: () => void;
  onPremod: () => void;
  onRemovePremod: () => void;
  onWarn: () => void;
  onRemoveWarning: () => void;
  banned: boolean;
  suspended: boolean;
  premod: boolean;
  warned: boolean;
  children: React.ReactNode;
  fullWidth?: boolean;
  bordered?: boolean;
  isMultisite?: boolean;
}

const UserStatusChange: FunctionComponent<Props> = ({
  onBan,
  onRemoveBan,
  onSuspend,
  onRemoveSuspension,
  onPremod,
  onRemovePremod,
  onWarn,
  onRemoveWarning,
  warned,
  banned,
  suspended,
  premod,
  children,
  fullWidth = true,
  bordered = false,
  isMultisite = false,
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
                  disabled={!onRemoveBan}
                  onClick={() => {
                    if (onRemoveBan) {
                      onRemoveBan();
                      toggleVisibility();
                    }
                  }}
                >
                  Remove ban
                </DropdownButton>
              </Localized>
            ) : (
              <Localized id="community-userStatus-ban">
                <DropdownButton
                  className={styles.dropdownButton}
                  disabled={!onBan}
                  onClick={() => {
                    if (onBan) {
                      onBan();
                      toggleVisibility();
                    }
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
              <Localized
                id={
                  isMultisite
                    ? "community-userStatus-suspendEverywhere"
                    : "community-userStatus-suspend"
                }
              >
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
            {warned ? (
              <Localized id="community-userStatus-removeWarning">
                <DropdownButton
                  className={styles.dropdownButton}
                  disabled={!onRemoveWarning}
                  onClick={() => {
                    if (onRemoveWarning) {
                      onRemoveWarning();
                      toggleVisibility();
                    }
                  }}
                >
                  Remove warning
                </DropdownButton>
              </Localized>
            ) : (
              <Localized
                id={
                  isMultisite
                    ? "community-userStatus-warnEverywhere"
                    : "community-userStatus-warn"
                }
              >
                <DropdownButton
                  className={styles.dropdownButton}
                  disabled={!onWarn}
                  onClick={() => {
                    if (onWarn) {
                      onWarn();
                      toggleVisibility();
                    }
                  }}
                >
                  Warn
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
            className={cn(styles.button, {
              [styles.fullWidth]: fullWidth,
              [styles.bordered]: bordered,
            })}
            onClick={toggleVisibility}
            ref={ref}
            color="mono"
            uppercase={false}
            variant="text"
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
