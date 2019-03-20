import { Localized } from "fluent-react/compat";
import React, { StatelessComponent } from "react";

import {
  Button,
  ButtonIcon,
  ClickOutside,
  Dropdown,
  DropdownButton,
  DropdownDivider,
  Popover,
} from "talk-ui/components";

import styles from "./UserMenu.css";

interface Props {
  username: string;
  onSignOut: React.EventHandler<React.MouseEvent>;
}

const UserMenu: StatelessComponent<Props> = props => (
  <Localized id="userMenu-popover" attrs={{ description: true }}>
    <Popover
      id="userMenu"
      placement="bottom-end"
      description="A dialog of the user menu with related links and actions"
      body={({ toggleVisibility }) => (
        <ClickOutside onClickOutside={toggleVisibility}>
          <Dropdown>
            <Localized id="userMenu-viewLatestRelease">
              <DropdownButton
                href="https://github.com/coralproject/talk/releases/latest"
                target="_blank"
                rel="noopener"
              >
                View Latest Release
              </DropdownButton>
            </Localized>
            <Localized id="userMenu-reportBug">
              <DropdownButton
                href="https://github.com/coralproject/talk/issues/new"
                target="_blank"
                rel="noopener"
              >
                Report a Bug or Give Feedback
              </DropdownButton>
            </Localized>
            <DropdownDivider />
            <Localized id="userMenu-signOut">
              <DropdownButton onClick={props.onSignOut} blankAdornment>
                Sign Out
              </DropdownButton>
            </Localized>
          </Dropdown>
        </ClickOutside>
      )}
    >
      {({ toggleVisibility, ref, visible }) => (
        <Button
          className={styles.button}
          onClick={toggleVisibility}
          ref={ref}
          variant="regular"
          size="small"
        >
          <ButtonIcon size="lg">account_circle</ButtonIcon>
          <span className={styles.buttonText}>{props.username}</span>
          {
            <ButtonIcon size="lg">
              {visible ? "arrow_drop_up" : "arrow_drop_down"}
            </ButtonIcon>
          }
        </Button>
      )}
    </Popover>
  </Localized>
);

export default UserMenu;
