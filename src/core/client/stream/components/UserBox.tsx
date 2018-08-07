import React, { StatelessComponent } from "react";

import { Button, Flex, Typography } from "talk-ui/components";

import * as styles from "./UserBox.css";

export interface UserBoxProps {
  onSignIn: () => void;
  onRegister: () => void;
}

const UserBox: StatelessComponent<UserBoxProps> = props => {
  return (
    <Flex>
      <Typography
        className={styles.joinText}
        variant="bodyCopyBold"
        component="span"
      >
        Join the conversation
      </Typography>
      <Typography variant="bodyCopyBold" component="span">
        |
      </Typography>
      <Button color="primary" size="small" onClick={props.onSignIn}>
        Sign In
      </Button>
      <Button
        color="primary"
        size="small"
        variant="outlined"
        onClick={props.onRegister}
      >
        Register
      </Button>
    </Flex>
  );
};

export default UserBox;
