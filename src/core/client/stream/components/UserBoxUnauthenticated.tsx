import { Localized } from "fluent-react/compat";
import React, { StatelessComponent } from "react";

import { Button, Flex, Typography } from "talk-ui/components";

import * as styles from "./UserBoxUnauthenticated.css";

export interface UserBoxUnauthenticatedProps {
  onSignIn: () => void;
  onRegister: () => void;
}

const UserBoxUnauthenticated: StatelessComponent<
  UserBoxUnauthenticatedProps
> = props => {
  return (
    <Flex itemGutter>
      <Localized id="comments-userBoxUnauthenticated-joinTheConversation">
        <Typography
          className={styles.joinText}
          variant="bodyCopyBold"
          component="span"
        >
          Join the conversation
        </Typography>
      </Localized>
      <Typography variant="bodyCopyBold" component="span">
        |
      </Typography>
      <Localized id="comments-userBoxUnauthenticated-signIn">
        <Button
          color="primary"
          size="small"
          variant="underlined"
          onClick={props.onSignIn}
        >
          Sign in
        </Button>
      </Localized>
      <Localized id="comments-userBoxUnauthenticated-register">
        <Button
          color="primary"
          size="small"
          variant="outlined"
          onClick={props.onRegister}
        >
          Register
        </Button>
      </Localized>
    </Flex>
  );
};

export default UserBoxUnauthenticated;
