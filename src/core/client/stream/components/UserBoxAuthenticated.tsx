import { Localized } from "fluent-react/compat";
import React, { StatelessComponent } from "react";

import { Button, Flex, Typography } from "talk-ui/components";

export interface UserBoxAuthenticatedProps {
  onSignOut: () => void;
  username: string;
}

const UserBoxAuthenticated: StatelessComponent<
  UserBoxAuthenticatedProps
> = props => {
  return (
    <Flex itemGutter="half" wrap>
      <Localized
        id="comments-userBoxAuthenticated-signedInAs"
        username={<Typography variant="bodyCopyBold" container="span" />}
      >
        <Typography variant="bodyCopy" container="div">
          {"Signed in as <username>Username</username>."}
        </Typography>
      </Localized>
      <Localized
        id="comments-userBoxAuthenticated-notYou"
        button={
          <Button
            color="primary"
            size="small"
            variant="underlined"
            onClick={props.onSignOut}
          />
        }
      >
        <Typography variant="bodyCopy" container={<Flex inline wrap />}>
          {"Not you? <button>Sign Out</button>"}
        </Typography>
      </Localized>
    </Flex>
  );
};

export default UserBoxAuthenticated;
