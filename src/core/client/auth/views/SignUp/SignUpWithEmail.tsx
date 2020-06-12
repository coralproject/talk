import { Localized } from "@fluent/react/compat";
import React, { FunctionComponent } from "react";
import { Form } from "react-final-form";

import EmailField from "coral-auth/components/EmailField";
import SetPasswordField from "coral-auth/components/SetPasswordField";
import UsernameField from "coral-auth/components/UsernameField";
import { FormError, OnSubmit } from "coral-framework/lib/form";
import { Flex, Icon } from "coral-ui/components/v2";
import { Button, CallOut } from "coral-ui/components/v3";

import styles from "./SignUpWithEmail.css";

interface FormProps {
  email: string;
  username: string;
  password: string;
  confirmPassword: string;
}

interface FormSubmitProps extends FormProps, FormError {}

interface Props {
  onSubmit: OnSubmit<FormSubmitProps>;
}

const SignUp: FunctionComponent<Props> = (props) => {
  return (
    <Form onSubmit={props.onSubmit}>
      {({ handleSubmit, submitting, submitError }) => (
        <form autoComplete="off" onSubmit={handleSubmit}>
          {submitError && <CallOut color="negative" title={submitError} />}
          <div className={styles.field}>
            <EmailField disabled={submitting} />
          </div>
          <div className={styles.field}>
            <UsernameField disabled={submitting} />
          </div>
          <div className={styles.field}>
            <SetPasswordField disabled={submitting} />
          </div>
          <div className={styles.actions}>
            <Button
              variant="filled"
              color="primary"
              textSize="small"
              marginSize="small"
              type="submit"
              disabled={submitting}
              fullWidth
              upperCase
            >
              <Flex alignItems="center" justifyContent="center">
                <Icon size="md" className={styles.icon}>
                  email
                </Icon>
                <Localized id="signUp-signUpWithEmail">
                  <span>Sign up with Email</span>
                </Localized>
              </Flex>
            </Button>
          </div>
        </form>
      )}
    </Form>
  );
};

export default SignUp;
