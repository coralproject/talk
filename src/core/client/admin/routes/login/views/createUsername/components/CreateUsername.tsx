import { Localized } from "fluent-react/compat";
import React, { StatelessComponent } from "react";
import { Form } from "react-final-form";

import { OnSubmit } from "talk-framework/lib/form";
import {
  Button,
  CallOut,
  HorizontalGutter,
  Typography,
} from "talk-ui/components";

import CompleteAccountBox from "../../../components/CompleteAccountBox";
import UsernameField from "./UsernameField";

interface FormProps {
  username: string;
}

export interface CreateUsernameForm {
  onSubmit: OnSubmit<FormProps>;
}

const CreateUsername: StatelessComponent<CreateUsernameForm> = props => {
  return (
    <CompleteAccountBox
      title={
        <Localized id="createUsername-createUsernameHeader">
          <span>Create Username</span>
        </Localized>
      }
    >
      <Form onSubmit={props.onSubmit}>
        {({ handleSubmit, submitting, submitError }) => (
          <form autoComplete="off" onSubmit={handleSubmit}>
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
    </CompleteAccountBox>
  );
};

export default CreateUsername;
