import { FORM_ERROR } from "final-form";
import { Localized } from "fluent-react/compat";
import React, { FunctionComponent, useCallback } from "react";
import { Form } from "react-final-form";

import { Bar, Title } from "coral-auth/components//Header";
import Main from "coral-auth/components/Main";
import UsernameField from "coral-auth/components/UsernameField";
import useResizePopup from "coral-auth/hooks/useResizePopup";
import { OnSubmit } from "coral-framework/lib/form";
import { useMutation } from "coral-framework/lib/relay";
import {
  Button,
  CallOut,
  HorizontalGutter,
  Typography,
} from "coral-ui/components";

import SetUsernameMutation from "./SetUsernameMutation";

interface FormProps {
  username: string;
}

const CreateUsernameContainer: FunctionComponent = () => {
  const setUsername = useMutation(SetUsernameMutation);
  const onSubmit: OnSubmit<FormProps> = useCallback(
    async (input, form) => {
      try {
        await setUsername({ username: input.username });
        return form.reset();
      } catch (error) {
        return { [FORM_ERROR]: error.message };
      }
    },
    [setUsername]
  );
  const ref = useResizePopup();

  return (
    <div ref={ref} data-testid="createUsername-container">
      <Bar>
        <Localized id="createUsername-createUsernameHeader">
          <Title>Create Username</Title>
        </Localized>
      </Bar>
      <Main data-testid="createUsername-main">
        <Form onSubmit={onSubmit}>
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
};

export default CreateUsernameContainer;
