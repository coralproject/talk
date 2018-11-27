import { Localized } from "fluent-react/compat";
import React, { StatelessComponent } from "react";
import { Form } from "react-final-form";

import { Bar, Title } from "talk-auth/components//Header";
import Main from "talk-auth/components/Main";
import AutoHeightContainer from "talk-auth/containers/AutoHeightContainer";
import { OnSubmit } from "talk-framework/lib/form";
import {
  Button,
  CallOut,
  HorizontalGutter,
  Typography,
} from "talk-ui/components";

import SetPasswordField from "talk-auth/components/SetPasswordField";

interface FormProps {
  password: string;
}

export interface CreatePasswordForm {
  onSubmit: OnSubmit<FormProps>;
}

const CreatePassword: StatelessComponent<CreatePasswordForm> = props => {
  return (
    <div>
      <Bar>
        <Localized id="createPassword-createPasswordHeader">
          <Title>Create Password</Title>
        </Localized>
      </Bar>
      <Main>
        <Form onSubmit={props.onSubmit}>
          {({ handleSubmit, submitting, submitError }) => (
            <form autoComplete="off" onSubmit={handleSubmit}>
              <AutoHeightContainer />
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
      </Main>
    </div>
  );
};

export default CreatePassword;
