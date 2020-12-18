import { Form, Formik } from "formik";
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

import EmailField from "./EmailField";
import SetPasswordField from "./SetPasswordField";
import SignupError from "./SignupError";
import SignUpSubmit from "./SignUpSubmit";
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
      <Form autoComplete="off">
        <SignupError />
        <div className={styles.field}>
          <EmailField />
        </div>
        <div className={styles.field}>
          <UsernameField />
        </div>
        <div className={styles.field}>
          <SetPasswordField />
        </div>
        <SignUpSubmit />
      </Form>
    </Formik>
  );
};

export default SignUp;
