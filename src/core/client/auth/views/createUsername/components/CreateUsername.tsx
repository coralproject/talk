import { Localized } from "fluent-react/compat";
import React, { FunctionComponent } from "react";
import { Form } from "react-final-form";

import { Bar, Title } from "coral-auth/components//Header";
import Main from "coral-auth/components/Main";
import AutoHeightContainer from "coral-auth/containers/AutoHeightContainer";
import { OnSubmit } from "coral-framework/lib/form";
import {
  Button,
  CallOut,
  HorizontalGutter,
  Typography,
} from "coral-ui/components";

import UsernameField from "coral-auth/components/UsernameField";

interface FormProps {
  username: string;
}

export interface CreateUsernameForm {
  onSubmit: OnSubmit<FormProps>;
}

const CreateUsername: FunctionComponent<CreateUsernameForm> = props => {
  return (
    <div data-testid="createUsername-container">
      <Bar>
        <Localized id="createUsername-createUsernameHeader">
          <Title>Create Username</Title>
        </Localized>
      </Bar>
      <Main data-testid="createUsername-main">
        <Form onSubmit={props.onSubmit}>
          {({ handleSubmit, submitting, submitError }) => (
            <form autoComplete="off" onSubmit={handleSubmit}>
              <AutoHeightContainer />
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
};

export default CreateUsername;
