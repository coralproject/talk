import { Localized } from "fluent-react/compat";
import React, { StatelessComponent } from "react";

import { Button, Flex, Typography } from "talk-ui/components";
import MatchMedia from "talk-ui/components/MatchMedia";

import styles from "./UserBoxUnauthenticated.css";

export interface UserBoxUnauthenticatedProps {
  onSignIn: () => void;
  onRegister?: () => void;
  showRegisterButton?: boolean;
}

const UserBoxUnauthenticated: StatelessComponent<
  UserBoxUnauthenticatedProps
> = props => {
  return (
    <Flex itemGutter alignItems="center">
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
          >
            Register
          </Button>
        </Localized>
      )}
    </Flex>
  );
};

export default UserBoxUnauthenticated;
