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
  onManageBan: () => void;

  onSuspend: () => void;
  onRemoveSuspension: () => void;
  onPremod: () => void;
  onRemovePremod: () => void;
  onWarn: () => void;
  onRemoveWarning: () => void;
  onModMessage: () => void;
  banned: boolean;
  suspended: boolean;
  premod: boolean;
  warned: boolean;
  children: React.ReactNode;
  fullWidth?: boolean;
  bordered?: boolean;
  moderationScopesEnabled?: boolean;
  viewerIsScoped?: boolean;
  userIsOrgModerator: boolean;
}

const UserStatusChange: FunctionComponent<Props> = ({
  onManageBan,
  onSuspend,
  onRemoveSuspension,
  onPremod,
  onRemovePremod,
  onWarn,
  onRemoveWarning,
  onModMessage,
  warned,
  banned,
  suspended,
  premod,
  children,
  fullWidth = true,
  bordered = false,
  moderationScopesEnabled = false,
  viewerIsScoped = false,
  userIsOrgModerator,
}) => (
  <Localized id="community-userStatus-popover" attrs={{ description: true }}>
    <Popover
      id="community-statusChange"
      placement="bottom-start"
      description="A dropdown to change the user status"
      body={({ toggleVisibility }) => (
        <ClickOutside onClickOutside={toggleVisibility}>
          <Dropdown>
            {
              <Localized id="community-userStatus-manageBan">
                <DropdownButton
                  className={styles.dropdownButton}
                  disabled={(banned && viewerIsScoped) || userIsOrgModerator}
                  onClick={() => {
                    onManageBan();
                    toggleVisibility();
                  }}
                >
                  Manage Ban
                </DropdownButton>
              </Localized>
            }
            {suspended ? (
              <Localized id="community-userStatus-removeUserSuspension">
                <DropdownButton
                  className={styles.dropdownButton}
                  onClick={() => {
                    onRemoveSuspension();
                    toggleVisibility();
                  }}
                  disabled={viewerIsScoped && userIsOrgModerator}
                >
                  Remove suspension
                </DropdownButton>
              </Localized>
            ) : (
              <Localized
                id={
                  moderationScopesEnabled
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
                  disabled={viewerIsScoped && userIsOrgModerator}
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
                  disabled={viewerIsScoped && userIsOrgModerator}
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
                  disabled={viewerIsScoped && userIsOrgModerator}
                >
                  Always pre-moderate
                </DropdownButton>
              </Localized>
            )}
            {warned ? (
              <Localized id="community-userStatus-removeWarning">
                <DropdownButton
                  className={styles.dropdownButton}
                  disabled={
                    !onRemoveWarning || (viewerIsScoped && userIsOrgModerator)
                  }
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
                  moderationScopesEnabled
                    ? "community-userStatus-warnEverywhere"
                    : "community-userStatus-warn"
                }
              >
                <DropdownButton
                  className={styles.dropdownButton}
                  disabled={!onWarn || (viewerIsScoped && userIsOrgModerator)}
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
            <Localized id="community-userStatus-message">
              <DropdownButton
                className={styles.dropdownButton}
                onClick={() => {
                  if (onModMessage) {
                    onModMessage();
                    toggleVisibility();
                  }
                }}
              >
                Message
              </DropdownButton>
            </Localized>
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
