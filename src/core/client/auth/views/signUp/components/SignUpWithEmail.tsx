import { Localized } from "fluent-react/compat";
import * as React from "react";
import { StatelessComponent } from "react";
import { Form } from "react-final-form";

import EmailField from "talk-auth/components/EmailField";
import SetPasswordField from "talk-auth/components/SetPasswordField";
import UsernameField from "talk-auth/components/UsernameField";
import { OnSubmit } from "talk-framework/lib/form";
import {
  Button,
  ButtonIcon,
  CallOut,
  HorizontalGutter,
} from "talk-ui/components";

import AutoHeightContainer from "talk-auth/containers/AutoHeightContainer";

interface FormProps {
  email: string;
  username: string;
  password: string;
  confirmPassword: string;
}

export interface SignUpForm {
  onSubmit: OnSubmit<FormProps>;
}

const SignUp: StatelessComponent<SignUpForm> = props => {
  return (
    <Form onSubmit={props.onSubmit}>
      {({ handleSubmit, submitting, submitError }) => (
        <form autoComplete="off" onSubmit={handleSubmit}>
          <AutoHeightContainer />
          <HorizontalGutter size="full">
            {submitError && (
              <CallOut color="error" fullWidth>
                {submitError}
              </CallOut>
            )}
            <EmailField disabled={submitting} />
            <UsernameField disabled={submitting} />
            <SetPasswordField disabled={submitting} />
            <Button
              variant="filled"
              color="brand"
              size="large"
              type="submit"
              disabled={submitting}
              fullWidth
            >
              <ButtonIcon size="md">email</ButtonIcon>
              <Localized id="signUp-signUpWithEmail">
                <span>Sign up with Email</span>
              </Localized>
            </Button>
          </HorizontalGutter>
        </form>
      )}
    </Form>
  );
};

export default SignUp;
