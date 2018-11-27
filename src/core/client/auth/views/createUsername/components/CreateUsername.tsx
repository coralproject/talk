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

import UsernameField from "talk-auth/components/UsernameField";

interface FormProps {
  username: string;
}

export interface CreateUsernameForm {
  onSubmit: OnSubmit<FormProps>;
}

const CreateUsername: StatelessComponent<CreateUsernameForm> = props => {
  return (
    <div>
      <Bar>
        <Localized id="createUsername-createUsernameHeader">
          <Title>Create Username</Title>
        </Localized>
      </Bar>
      <Main>
        <Form onSubmit={props.onSubmit}>
          {({ handleSubmit, submitting, submitError }) => (
            <form autoComplete="off" onSubmit={handleSubmit}>
              <AutoHeightContainer />
              <HorizontalGutter size="oneAndAHalf">
                <Localized id="createUsername-whatItIs">
                  <Typography variant="bodyCopy">
                    Your username is a unique identifier that will appear on all
                    of your comments.
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
