import { Localized } from "fluent-react/compat";
import React, { StatelessComponent } from "react";
import { Form } from "react-final-form";
import { OnSubmit } from "talk-framework/lib/form";

import { Bar, Title } from "talk-auth/components//Header";
import ConfirmPasswordField from "talk-auth/components/ConfirmPasswordField";
import Main from "talk-auth/components/Main";
import SetPasswordField from "talk-auth/components/SetPasswordField";
import AutoHeightContainer from "talk-auth/containers/AutoHeightContainer";
import { Button, CallOut, HorizontalGutter } from "talk-ui/components";

interface FormProps {
  password: string;
  confirmPassword: string;
}

export interface ResetPasswordForm {
  onSubmit: OnSubmit<FormProps>;
}

const ResetPassword: StatelessComponent<ResetPasswordForm> = props => {
  return (
    <div data-testid="resetPassword-container">
      <Bar>
        <Localized id="resetPassword-resetPasswordHeader">
          <Title>Reset Password</Title>
        </Localized>
      </Bar>
      <Main data-testid="resetPassword-main">
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
                <SetPasswordField disabled={submitting} />
                <ConfirmPasswordField disabled={submitting} />
                <Localized id="resetPassword-resetPasswordButton">
                  <Button
                    variant="filled"
                    color="primary"
                    size="large"
                    fullWidth
                    disabled={submitting}
                  >
                    Reset Password
                  </Button>
                </Localized>
              </HorizontalGutter>
            </form>
          )}
        </Form>
      </Main>
    </div>
  );
};

export default ResetPassword;
