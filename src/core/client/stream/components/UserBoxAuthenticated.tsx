import { Localized } from "fluent-react/compat";
import React, { StatelessComponent } from "react";

import { Button, Flex, Typography } from "talk-ui/components";

import MatchMedia from "talk-ui/components/MatchMedia";
// import * as styles from "./UserBoxUnauthenticated.css";

export interface UserBoxUnauthenticatedProps {
  onSignOut: () => void;
}

const UserBoxAuthenticated: StatelessComponent<
  UserBoxUnauthenticatedProps
> = props => {
  return (
    <Flex itemGutter>
      <Flex itemGutter="half">
        <MatchMedia gteWidth="sm">
          <Localized id="comments-userBoxAuthenticated-signedInAs">
            <Typography variant="bodyCopy" component="span">
              Signed in as
            </Typography>
          </Localized>
          <Typography variant="bodyCopyBold" component="span">
            okbel
          </Typography>
        </MatchMedia>
      </Flex>
      <Flex itemGutter="half">
        <Localized id="comments-userBoxUnauthenticated-notYou">
          <Typography variant="bodyCopy" component="span">
            Not you?
          </Typography>
        </Localized>
        <Localized id="comments-userBoxUnauthenticated-register">
          <Button
            color="primary"
            size="small"
            variant="underlined"
            onClick={props.onSignOut}
          >
            Sign Out
          </Button>
        </Localized>
      </Flex>
    </Flex>
  );
};

export default UserBoxAuthenticated;
