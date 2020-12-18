import { Localized } from "@fluent/react/compat";
import { Formik } from "formik";
import React, { FunctionComponent } from "react";
import * as Yup from "yup";

import {
  PASSWORD_MIN_LENGTH,
  USERNAME_MAX_LENGTH,
  USERNAME_MIN_LENGTH,
  USERNAME_REGEX,
} from "coral-common/helpers/validate";
import {
  INVALID_CHARACTERS,
  PASSWORD_TOO_SHORT,
  USERNAME_TOO_LONG,
  USERNAME_TOO_SHORT,
  VALIDATION_REQUIRED,
} from "coral-framework/lib/messages";
import { Flex, Icon } from "coral-ui/components/v2";
import { Button, CallOut } from "coral-ui/components/v3";

import EmailField from "./EmailField";
import SetPasswordField from "./SetPasswordField";
import UsernameField from "./UsernameField";

import styles from "./SignUpWithEmail.css";

interface FormValues {
  email: string;
  username: string;
  password: string;
}

interface Props {
  onSubmit: (input: any) => void;
}

const SignupValidationSchema = Yup.object().shape({
  email: Yup.string().email(INVALID_CHARACTERS).required(VALIDATION_REQUIRED),
  username: Yup.string()
    .matches(USERNAME_REGEX, INVALID_CHARACTERS)
    .min(USERNAME_MIN_LENGTH, ({ min }) => USERNAME_TOO_SHORT(min))
    .max(USERNAME_MAX_LENGTH, ({ max }) => USERNAME_TOO_LONG(max))
    .required(VALIDATION_REQUIRED),
  password: Yup.string()
    .min(PASSWORD_MIN_LENGTH, ({ min }) => PASSWORD_TOO_SHORT(min))
    .required(VALIDATION_REQUIRED),
});

const SignUp: FunctionComponent<Props> = (props) => {
  return (
    <Formik<FormValues>
      onSubmit={props.onSubmit}
      initialValues={{
        email: "",
        username: "",
        password: "",
      }}
      validationSchema={SignupValidationSchema}
    >
      {({ handleSubmit, isSubmitting, status }) => (
        <form autoComplete="off" onSubmit={handleSubmit}>
          {status && status.error && (
            <CallOut color="error" title={status.error} />
          )}
          <div className={styles.field}>
            <EmailField disabled={isSubmitting} />
          </div>
          <div className={styles.field}>
            <UsernameField disabled={isSubmitting} />
          </div>
          <div className={styles.field}>
            <SetPasswordField disabled={isSubmitting} />
          </div>
          <div className={styles.actions}>
            <Button
              variant="filled"
              color="primary"
              fontSize="small"
              paddingSize="small"
              type="submit"
              disabled={isSubmitting}
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
    </Formik>
  );
};

export default SignUp;
