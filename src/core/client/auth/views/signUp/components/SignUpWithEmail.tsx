import { Localized } from "fluent-react/compat";
import * as React from "react";
import { FunctionComponent } from "react";
import { Form } from "react-final-form";

import EmailField from "coral-auth/components/EmailField";
import SetPasswordField from "coral-auth/components/SetPasswordField";
import UsernameField from "coral-auth/components/UsernameField";
import { OnSubmit } from "coral-framework/lib/form";
import {
  Button,
  ButtonIcon,
  CallOut,
  HorizontalGutter,
} from "coral-ui/components";

import AutoHeightContainer from "coral-auth/containers/AutoHeightContainer";

interface FormProps {
  email: string;
  username: string;
  password: string;
  confirmPassword: string;
}

interface Props {
  onSubmit: OnSubmit<FormProps>;
}

const SignUp: FunctionComponent<Props> = props => {
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
