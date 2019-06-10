import { FORM_ERROR } from "final-form";
import { Localized } from "fluent-react/compat";
import React, { Component } from "react";
import { Form } from "react-final-form";

import { Bar, Title } from "coral-auth/components//Header";
import AutoHeight from "coral-auth/components/AutoHeight";
import Main from "coral-auth/components/Main";
import SetPasswordField from "coral-auth/components/SetPasswordField";
import { OnSubmit } from "coral-framework/lib/form";
import {
  Button,
  CallOut,
  HorizontalGutter,
  Typography,
} from "coral-ui/components";

import {
  SetPasswordMutation,
  withSetPasswordMutation,
} from "./SetPasswordMutation";

interface FormProps {
  password: string;
}

interface Props {
  setPassword: SetPasswordMutation;
}

class CreatePasswordContainer extends Component<Props> {
  private handleSubmit: OnSubmit<FormProps> = async (input, form) => {
    try {
      await this.props.setPassword({ password: input.password });
      return form.reset();
    } catch (error) {
      return { [FORM_ERROR]: error.message };
    }
  };

  public render() {
    return (
      <div data-testid="createPassword-container">
        <Bar>
          <Localized id="createPassword-createPasswordHeader">
            <Title>Create Password</Title>
          </Localized>
        </Bar>
        <Main data-testid="createPassword-main">
          <Form onSubmit={this.handleSubmit}>
            {({ handleSubmit, submitting, submitError }) => (
              <form autoComplete="off" onSubmit={handleSubmit}>
                <AutoHeight />
                <HorizontalGutter size="oneAndAHalf">
                  <Localized id="createPassword-whatItIs">
                    <Typography variant="bodyCopy">
                      To protect against unauthorized changes to your account,
                      we require users to create a password.
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
  }
}

const enhanced = withSetPasswordMutation(CreatePasswordContainer);
export default enhanced;
