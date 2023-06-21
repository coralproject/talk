import { Localized } from "@fluent/react/compat";
import React, { FunctionComponent } from "react";

import {
  ArrowsDownIcon,
  ArrowsUpIcon,
  ButtonSvgIcon,
  ProfileCircleIcon,
} from "coral-ui/components/icons";
import {
  Button,
  ClickOutside,
  Dropdown,
  DropdownButton,
  DropdownDivider,
  Popover,
} from "coral-ui/components/v2";

import styles from "./UserMenu.css";

interface Props {
  username: string;
  onSignOut: React.EventHandler<React.MouseEvent>;
}

const UserMenu: FunctionComponent<Props> = (props) => (
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
          variant="text"
          uppercase={false}
        >
          <ButtonSvgIcon
            className={styles.icon}
            size="lg"
            Icon={ProfileCircleIcon}
          />
          <span className={styles.buttonText}>{props.username}</span>
          {
            <ButtonSvgIcon
              className={styles.icon}
              Icon={visible ? ArrowsUpIcon : ArrowsDownIcon}
              size="xs"
            />
          }
        </Button>
      )}
    </Popover>
  </Localized>
);

export default UserMenu;
