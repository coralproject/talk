import { Localized } from "@fluent/react/compat";
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
import UsernameField from "./UsernameField";

interface FormProps {
  username: string;
}

interface FormSubmitProps extends FormProps, FormError {}

export interface CreateUsernameForm {
  onSubmit: OnSubmit<FormSubmitProps>;
}

const CreateUsername: FunctionComponent<CreateUsernameForm> = (props) => {
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
                  Your username is an identifier that will appear on all of your
                  comments.
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
