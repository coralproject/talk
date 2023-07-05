import { Localized } from "@fluent/react/compat";
import { Link } from "found";
import React, { FunctionComponent, useState } from "react";

import { Bar, SubBar, Title } from "coral-auth/components/Header";
import { Flex, Typography } from "coral-ui/components/v2";

import CheckEmail from "./CheckEmail";
import ForgotPasswordForm from "./ForgotPasswordForm";

import styles from "./ForgotPasswordContainer.css";

const ForgotPasswordContainer: FunctionComponent = () => {
  const [checkEmail, setCheckEmail] = useState<string | null>(null);
  return (
    <Flex justifyContent="center">
      <div className={styles.container}>
        <Bar>
          {!checkEmail ? (
            <Localized id="forgotPassword-forgotPasswordHeader">
              <Title>Forgot Password?</Title>
            </Localized>
          ) : (
            <Localized id="forgotPassword-checkEmailHeader">
              <Title>Check Email</Title>
            </Localized>
          )}
        </Bar>
        <SubBar>
          <Typography variant="bodyCopy" container={Flex}>
            <Localized id="forgotPassword-gotBackToSignIn">
              <Link className={styles.textLink} to="/admin/login">
                Go back to sign in page
              </Link>
            </Localized>
          </Typography>
        </SubBar>
        {checkEmail ? (
          <CheckEmail email={checkEmail} />
        ) : (
          <ForgotPasswordForm onCheckEmail={setCheckEmail} />
        )}
      </div>
    </Flex>
  );
};

export default ForgotPasswordContainer;
