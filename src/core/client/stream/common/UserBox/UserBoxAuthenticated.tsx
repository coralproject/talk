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
    <Localized
      id="username"
      attrs={{ "aria-label": true }}
      vars={{ username: props.username }}
    >
      <div className={cn(CLASSES.viewerBox.username, styles.username)}>
        {props.username}
      </div>
    </Localized>
  );

  return (
    <Localized
      id="general-authenticationSection"
      attrs={{ "aria-label": true }}
    >
      <section className={CLASSES.viewerBox.$root} aria-label="Authentication">
        <Localized id="general-userBoxAuthenticated-signedIn">
          <div className={styles.text}>Signed in as</div>
        </Localized>
        <Flex alignItems="flex-end" wrap>
          <Username />
          {props.showLogoutButton && (
            <Localized
              id="general-userBoxAuthenticated-notYou"
              button={
                <Button
                  color="primary"
                  fontSize="small"
                  fontWeight="semiBold"
                  paddingSize="none"
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
      </section>
    </Localized>
  );
};

export default UserBoxAuthenticated;
