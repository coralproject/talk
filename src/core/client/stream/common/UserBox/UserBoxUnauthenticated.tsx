import { Localized } from "@fluent/react/compat";
import React, { FunctionComponent } from "react";

import CLASSES from "coral-stream/classes";
import { Button, Flex, Typography } from "coral-ui/components";
import MatchMedia from "coral-ui/components/MatchMedia";

import styles from "./UserBoxUnauthenticated.css";

export interface UserBoxUnauthenticatedProps {
  onSignIn: () => void;
  onRegister?: () => void;
  showRegisterButton?: boolean;
}

const UserBoxUnauthenticated: FunctionComponent<
  UserBoxUnauthenticatedProps
> = props => {
  return (
    <Flex itemGutter alignItems="center" className={CLASSES.viewerBox.$root}>
      <MatchMedia gteWidth="sm">
        <Localized id="general-userBoxUnauthenticated-joinTheConversation">
          <Typography
            className={styles.joinText}
            variant="bodyCopyBold"
            container="span"
          >
            Join the conversation
          </Typography>
        </Localized>
        <Typography variant="bodyCopyBold" container="span">
          |
        </Typography>
      </MatchMedia>
      <Localized id="general-userBoxUnauthenticated-signIn">
        <Button
          color="primary"
          size="small"
          variant="underlined"
          onClick={props.onSignIn}
          className={CLASSES.viewerBox.signInButton}
        >
          Sign in
        </Button>
      </Localized>
      {props.showRegisterButton && (
        <Localized id="general-userBoxUnauthenticated-register">
          <Button
            color="primary"
            size="small"
            variant="outlined"
            onClick={props.onRegister}
            className={CLASSES.viewerBox.registerButton}
          >
            Register
          </Button>
        </Localized>
      )}
    </Flex>
  );
};

export default UserBoxUnauthenticated;
