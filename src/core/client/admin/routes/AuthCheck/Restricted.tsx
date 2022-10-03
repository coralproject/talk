import { Localized } from "@fluent/react/compat";
import cn from "classnames";
import React, { FunctionComponent } from "react";

import AuthBox from "coral-admin/components/AuthBox";
import { Button, Flex, HorizontalGutter, Icon } from "coral-ui/components/v2";

import styles from "./Restricted.css";

interface Props {
  username: string | null;
  onSignInAs: React.MouseEventHandler;
}

const SignIn: FunctionComponent<Props> = ({ username, onSignInAs }) => {
  return (
    <AuthBox
      title={
        <div className={styles.title}>
          <Localized id="restricted-currentlySignedInTo">
            <span>Currently signed in to</span>
          </Localized>
        </div>
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
            <div className={styles.noPermission}>
              You do not have permission to access this page.
            </div>
          </Localized>
        </div>
        {username && (
          <div>
            <Localized
              id="restricted-signedInAs"
              elems={{ strong: <div className={styles.username} /> }}
              vars={{ username }}
            >
              <div className={styles.copy}>
                You are signed in as:{" "}
                <div className={styles.username}>{username}</div>
              </div>
            </Localized>
          </div>
        )}
        <Flex justifyContent="center">
          <Localized id="restricted-signInWithADifferentAccount">
            <Button
              variant="regular"
              color="regular"
              size="large"
              onClick={onSignInAs}
            >
              Sign in with a different account
            </Button>
          </Localized>
        </Flex>
        <Localized id="restricted-contactAdmin">
          <div className={cn(styles.copy, styles.contactAdmin)}>
            If you think this is an error, please contact your administrator for
            assistance.
          </div>
        </Localized>
      </HorizontalGutter>
    </AuthBox>
  );
};

export default SignIn;
