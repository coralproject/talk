import cn from "classnames";
import { Localized } from "fluent-react/compat";
import React, { FunctionComponent } from "react";

import CLASSES from "coral-stream/classes";
import { Button, Flex, Typography } from "coral-ui/components";

import styles from "./UserBoxAuthenticated.css";

export interface UserBoxAuthenticatedProps {
  onSignOut?: () => void;
  username: string;
  showLogoutButton?: boolean;
}

const UserBoxAuthenticated: FunctionComponent<
  UserBoxAuthenticatedProps
> = props => {
  const Username = () => (
    <Typography variant="heading3" container="span">
      {props.username}
    </Typography>
  );

  return (
    <Flex itemGutter="half" className={CLASSES.viewerBox.$root} wrap>
      <Localized
        id="general-userBoxAuthenticated-signedInAs"
        Username={<Username />}
      >
        <Typography
          className={styles.userBoxText}
          variant="bodyCopy"
          container="div"
        >
          {"Signed in as <Username></Username>."}
        </Typography>
      </Localized>
      {props.showLogoutButton && (
        <Localized
          id="general-userBoxAuthenticated-notYou"
          button={
            <Button
              color="primary"
              size="small"
              onClick={props.onSignOut}
              variant="regular"
              className={cn(
                styles.userBoxButton,
                CLASSES.viewerBox.logoutButton
              )}
            />
          }
        >
          <Typography
            variant="bodyCopy"
            className={styles.userBoxText}
            container={Flex}
          >
            {"Not you? <button>Sign Out</button>"}
          </Typography>
        </Localized>
      )}
    </Flex>
  );
};

export default UserBoxAuthenticated;
