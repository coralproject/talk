import { FORM_ERROR } from "final-form";
import { Localized } from "fluent-react/compat";
import React, { FunctionComponent, useCallback } from "react";
import { Form } from "react-final-form";

import { Bar, Title } from "coral-auth/components//Header";
import Main from "coral-auth/components/Main";
import SetPasswordField from "coral-auth/components/SetPasswordField";
import useResizePopup from "coral-auth/hooks/useResizePopup";
import { OnSubmit } from "coral-framework/lib/form";
import {
  Button,
  CallOut,
  HorizontalGutter,
  Typography,
} from "coral-ui/components";

import { useMutation } from "coral-framework/lib/relay";
import SetPasswordMutation from "./SetPasswordMutation";

interface FormProps {
  password: string;
}

const CreatePasswordContainer: FunctionComponent = () => {
  const setPassword = useMutation(SetPasswordMutation);
  const onSubmit: OnSubmit<FormProps> = useCallback(
    async (input, form) => {
      try {
        await setPassword({ password: input.password });
        return form.reset();
      } catch (error) {
        return { [FORM_ERROR]: error.message };
      }
    },
    [setPassword]
  );
  const ref = useResizePopup();

  return (
    <div ref={ref} data-testid="createPassword-container">
      <Bar>
        <Localized id="createPassword-createPasswordHeader">
          <Title>Create Password</Title>
        </Localized>
      </Bar>
      <Main data-testid="createPassword-main">
        <Form onSubmit={onSubmit}>
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
      </Main>
    </div>
  );
};

export default CreatePasswordContainer;
