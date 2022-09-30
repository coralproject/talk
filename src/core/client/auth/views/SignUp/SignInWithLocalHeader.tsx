import { Localized } from "@fluent/react/compat";
import cn from "classnames";
import React, { FunctionComponent } from "react";

import CLASSES from "coral-stream/classes";
import { Button } from "coral-ui/components/v3";

import styles from "./SignInWithLocalHeader.css";

interface Props {
  onSignIn: () => void;
}

const SignInWithLocalHeader: FunctionComponent<Props> = ({ onSignIn }) => {
  return (
    <div role="contentinfo" className={cn(CLASSES.login.subBar, styles.root)}>
      <Localized
        id="signUp-accountAvailableSignIn"
        elems={{
          textlink: (
            <Button
              color="primary"
              variant="flat"
              paddingSize="none"
              fontSize="small"
              fontFamily="secondary"
              fontWeight="semiBold"
              underline
              onClick={onSignIn}
              className={styles.signIn}
            />
          ),
        }}
      >
        <div
          className={cn(
            CLASSES.login.signUp.alreadyHaveAccount,
            styles.alreadyHaveAccount
          )}
        >
          Already have an account?{" "}
          <Button
            color="primary"
            variant="flat"
            paddingSize="none"
            fontSize="small"
            fontFamily="secondary"
            fontWeight="bold"
            underline
            onClick={onSignIn}
            className={styles.signIn}
          >
            Sign In
          </Button>
        </div>
      </Localized>
    </div>
  );
};

export default SignInWithLocalHeader;
