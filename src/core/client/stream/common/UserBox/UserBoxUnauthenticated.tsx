import { Localized } from "@fluent/react/compat";
import cn from "classnames";
import React, { FunctionComponent } from "react";

import CLASSES from "coral-stream/classes";
import { Flex } from "coral-ui/components/v2";
import { Button } from "coral-ui/components/v3";

import styles from "./UserBoxUnauthenticated.css";

export interface UserBoxUnauthenticatedProps {
  onSignIn: () => void;
  onRegister?: () => void;
  showRegisterButton?: boolean;
}

const UserBoxUnauthenticated: FunctionComponent<UserBoxUnauthenticatedProps> = (
  props
) => {
  return (
    <Flex alignItems="center" className={CLASSES.viewerBox.$root} wrap>
      <Localized id="general-userBoxUnauthenticated-joinTheConversation">
        <span className={styles.joinText}>Join the conversation</span>
      </Localized>
      <div className={styles.actions}>
        {props.showRegisterButton && (
          <Localized id="general-userBoxUnauthenticated-register">
            <Button
              color="primary"
              textSize="extraSmall"
              marginSize="extraSmall"
              variant="filled"
              onClick={props.onRegister}
              className={cn(styles.register, CLASSES.viewerBox.registerButton)}
              upperCase
            >
              Register
            </Button>
          </Localized>
        )}
        <Localized id="general-userBoxUnauthenticated-signIn">
          <Button
            color="primary"
            textSize="extraSmall"
            marginSize="extraSmall"
            variant="outlined"
            onClick={props.onSignIn}
            className={CLASSES.viewerBox.signInButton}
            upperCase
          >
            Sign in
          </Button>
        </Localized>
      </div>
    </Flex>
  );
};

export default UserBoxUnauthenticated;
