import { FORM_ERROR } from "final-form";
import { Localized } from "fluent-react/compat";
import React, { Component } from "react";
import { Form } from "react-final-form";

import { Bar, Title } from "coral-auth/components//Header";
import Main from "coral-auth/components/Main";
import UsernameField from "coral-auth/components/UsernameField";
import { OnSubmit } from "coral-framework/lib/form";
import {
  Button,
  CallOut,
  HorizontalGutter,
  Typography,
} from "coral-ui/components";

import {
  SetUsernameMutation,
  withSetUsernameMutation,
} from "./SetUsernameMutation";

interface FormProps {
  username: string;
}

interface Props {
  setUsername: SetUsernameMutation;
}

class CreateUsernameContainer extends Component<Props> {
  private handleSubmit: OnSubmit<FormProps> = async (input, form) => {
    try {
      await this.props.setUsername({ username: input.username });
      return form.reset();
    } catch (error) {
      return { [FORM_ERROR]: error.message };
    }
  };

  public render() {
    // tslint:disable-next-line:no-empty
    return (
      <div data-testid="createUsername-container">
        <Bar>
          <Localized id="createUsername-createUsernameHeader">
            <Title>Create Username</Title>
          </Localized>
        </Bar>
        <Main data-testid="createUsername-main">
          <Form onSubmit={this.handleSubmit}>
            {({ handleSubmit, submitting, submitError }) => (
              <form autoComplete="off" onSubmit={handleSubmit}>
                <HorizontalGutter size="oneAndAHalf">
                  <Localized id="createUsername-whatItIs">
                    <Typography variant="bodyCopy">
                      Your username is an identifier that will appear on all of
                      your comments.
                    </Typography>
                  </Localized>
                  {submitError && (
                    <CallOut color="error" fullWidth>
                      {submitError}
                    </CallOut>
                  )}
                  <UsernameField disabled={submitting} />
                  <Localized id="createUsername-createUsernameButton">
                    <Button
                      variant="filled"
                      color="primary"
                      size="large"
                      type="submit"
                      fullWidth
                      disabled={submitting}
                    >
                      Create Username
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

const enhanced = withSetUsernameMutation(CreateUsernameContainer);
export default enhanced;
