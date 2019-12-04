import { Localized } from "fluent-react/compat";
import React, { FunctionComponent } from "react";
import { Form } from "react-final-form";

import { FormError, OnSubmit } from "coral-framework/lib/form";
import {
  Button,
  CallOut,
  HorizontalGutter,
  Typography,
} from "coral-ui/components";

import CompleteAccountBox from "../../CompleteAccountBox";
import SetPasswordField from "./SetPasswordField";

interface FormProps {
  password: string;
}

interface FormSubmitProps extends FormProps, FormError {}

export interface CreatePasswordForm {
  onSubmit: OnSubmit<FormSubmitProps>;
}

const CreatePassword: FunctionComponent<CreatePasswordForm> = props => {
  return (
    <CompleteAccountBox
      title={
        <Localized id="createPassword-createPasswordHeader">
          <span>Create Password</span>
        </Localized>
      }
    >
      <Form onSubmit={props.onSubmit}>
        {({ handleSubmit, submitting, submitError }) => (
          <form autoComplete="off" onSubmit={handleSubmit}>
            <HorizontalGutter size="oneAndAHalf">
              <Localized id="createPassword-whatItIs">
                <Typography variant="bodyCopy">
                  To protect against unauthorized changes to your account, we
                  require users to create a password.
                </Typography>
              </Localized>
              {submitError && (
                <CallOut color="error" fullWidth>
                  {submitError}
                </CallOut>
              )}
              <SetPasswordField disabled={submitting} />
              <Localized id="createPassword-createPasswordButton">
                <Button
                  variant="filled"
                  color="primary"
                  size="large"
                  type="submit"
                  fullWidth
                  disabled={submitting}
                >
                  Create Password
                </Button>
              </Localized>
            </HorizontalGutter>
          </form>
        )}
      </Form>
    </CompleteAccountBox>
  );
};

export default CreatePassword;
