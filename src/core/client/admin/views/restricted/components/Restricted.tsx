import { Localized } from "fluent-react/compat";
import React, { FunctionComponent } from "react";

import AuthBox from "talk-admin/components/AuthBox";
import {
  Button,
  Flex,
  HorizontalGutter,
  Icon,
  Typography,
} from "talk-ui/components";

import styles from "./Restricted.css";

interface Props {
  username: string;
  onSignInAs: React.MouseEventHandler;
}

const SignIn: FunctionComponent<Props> = ({ username, onSignInAs }) => {
  const Username = () => (
    <Typography variant="heading1" align="center">
      {username}
    </Typography>
  );
  return (
    <AuthBox
      title={
        <Localized id="restricted-currentlySignedInTo">
          <span>Currently signed in to</span>
        </Localized>
      }
    >
      <HorizontalGutter size="double">
        <div>
          <Flex justifyContent="center">
            <Icon size="lg" className={styles.lockIcon}>
              lock
            </Icon>
          </Flex>
          <Localized id="restricted-noPermissionInfo">
            <Typography
              variant="heading3"
              align="center"
              className={styles.noPermission}
            >
              You do not have permission to access this page.
            </Typography>
          </Localized>
        </div>
        <div>
          <Localized id="restricted-signedInAs" username={<Username />}>
            <Typography variant="bodyCopy" align="center" container="div">
              {"You are signed in as: <username></username>"}
            </Typography>
          </Localized>
        </div>
        <Flex justifyContent="center">
          <Localized id="restricted-signInWithADifferentAccount">
            <Button variant="filled" color="primary" onClick={onSignInAs}>
              Sign in with a different account
            </Button>
          </Localized>
        </Flex>
        <Localized id="restricted-contactAdmin">
          <Typography
            variant="bodyCopy"
            align="center"
            className={styles.contactAdmin}
          >
            If you think this is an error, please contact your administrator for
            assistance.
          </Typography>
        </Localized>
      </HorizontalGutter>
    </AuthBox>
  );
};

export default SignIn;
