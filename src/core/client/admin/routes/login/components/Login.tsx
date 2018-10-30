import { Localized } from "fluent-react/compat";
import React, { StatelessComponent } from "react";

import AppBar from "talk-admin/components/AppBar";
import BrandName from "talk-admin/components/BrandName";
import { Flex, HorizontalGutter, Typography } from "talk-ui/components";

import BrandIcon from "talk-admin/components/BrandIcon";
import SignInFormContainer from "../containers/SignInFormContainer";
import styles from "./Login.css";

const Login: StatelessComponent = () => (
  <div>
    <AppBar />
    <Flex justifyContent="center">
      <HorizontalGutter className={styles.loginContainer} size="double">
        <Flex justifyContent="center">
          <div className={styles.brandIcon}>
            <BrandIcon size="lg" />
          </div>
        </Flex>
        <div>
          <Localized id="login-login-signInTo">
            <Typography align="center" variant="heading3">
              Sign in to
            </Typography>
          </Localized>
          <BrandName size="lg" align="center" />
        </div>
        <Localized id="login-login-enterAccountDetailsBelow">
          <Typography align="center">
            Enter your account details below
          </Typography>
        </Localized>
        <SignInFormContainer />
      </HorizontalGutter>
    </Flex>
  </div>
);

export default Login;
