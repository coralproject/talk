import { Localized } from "@fluent/react/compat";
import cn from "classnames";
import React, { FunctionComponent } from "react";

import CLASSES from "coral-stream/classes";
import { Flex } from "coral-ui/components/v2";
import { Button } from "coral-ui/components/v3";

import styles from "./UserBoxAuthenticated.css";

export interface UserBoxAuthenticatedProps {
  onSignOut?: () => void;
  username: string;
  showLogoutButton?: boolean;
}

const UserBoxAuthenticated: FunctionComponent<UserBoxAuthenticatedProps> = (
  props
) => {
  const Username = () => (
    <div className={styles.username}>{props.username}</div>
  );

  return (
    <div className={CLASSES.viewerBox.$root}>
      <Localized id="general-userBoxAuthenticated-signedIn">
        <div className={styles.text}>Signed in as</div>
      </Localized>
      <Flex alignItems="center" wrap>
        <Username />
        {props.showLogoutButton && (
          <Localized
            id="general-userBoxAuthenticated-notYou"
            button={
              <Button
                color="primary"
                textSize="small"
                fontWeight="semiBold"
                marginSize="none"
                onClick={props.onSignOut}
                variant="flat"
                underline
                className={cn(
                  styles.userBoxButton,
                  CLASSES.viewerBox.logoutButton
                )}
              />
            }
          >
            <span className={cn(styles.text, styles.signOut)}>
              {"Not you? <button>Sign Out</button>"}
            </span>
          </Localized>
        )}
      </Flex>
    </div>
  );
};

export default UserBoxAuthenticated;
