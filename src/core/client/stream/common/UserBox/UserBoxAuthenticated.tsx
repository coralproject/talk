import { Localized } from "fluent-react/compat";
import React, { FunctionComponent } from "react";

import CLASSES from "coral-stream/classes";
import { Button, Flex, Typography } from "coral-ui/components";

export interface UserBoxAuthenticatedProps {
  onSignOut?: () => void;
  username: string;
  showLogoutButton?: boolean;
}

const UserBoxAuthenticated: FunctionComponent<
  UserBoxAuthenticatedProps
> = props => {
  const Username = () => (
    <Typography variant="bodyCopyBold" container="span">
      {props.username}
    </Typography>
  );

  return (
    <Flex itemGutter="half" className={CLASSES.viewerBox.$root} wrap>
      <Localized
        id="general-userBoxAuthenticated-signedInAs"
        Username={<Username />}
      >
        <Typography variant="bodyCopy" container="div">
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
              variant="underlined"
              onClick={props.onSignOut}
              className={CLASSES.viewerBox.logoutButton}
            />
          }
        >
          <Typography variant="bodyCopy" container={Flex}>
            {"Not you? <button>Sign Out</button>"}
          </Typography>
        </Localized>
      )}
    </Flex>
  );
};

export default UserBoxAuthenticated;
