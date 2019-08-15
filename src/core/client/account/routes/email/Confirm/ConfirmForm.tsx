import { FORM_ERROR } from "final-form";
import { Localized } from "fluent-react/compat";
import React, { useCallback } from "react";
import { Form } from "react-final-form";

import { InvalidRequestError } from "coral-framework/lib/errors";
import { useMutation } from "coral-framework/lib/relay";
import { Button, HorizontalGutter, Typography } from "coral-ui/components";

import ConfirmMutation from "./ConfirmMutation";

interface Props {
  token: string;
  disabled?: boolean;
  onSuccess: () => void;
}

const ConfirmForm: React.FunctionComponent<Props> = ({ onSuccess, token }) => {
  const confirm = useMutation(ConfirmMutation);
  const onSubmit = useCallback(async () => {
    try {
      await confirm({ token });
      onSuccess();
    } catch (error) {
      if (error instanceof InvalidRequestError) {
        return error.invalidArgs;
      }
      return { [FORM_ERROR]: error.message };
    }
    return;
  }, [token]);
  return (
    <Form onSubmit={onSubmit}>
      {({ handleSubmit, submitting }) => (
        <form autoComplete="off" onSubmit={handleSubmit}>
          <HorizontalGutter size="double">
            <HorizontalGutter>
              <Localized id="confirmEmail-emailConfirmation">
                <Typography variant="heading1">Email Confirmation</Typography>
              </Localized>
              <Localized id="confirmEmail-pleaseClickToConfirm">
                <Typography variant="bodyCopy">
                  Click below to confirm your email address.
                </Typography>
              </Localized>
            </HorizontalGutter>
            <HorizontalGutter>
              <Localized id="confirmEmail-confirmEmail">
                <Button
                  type="submit"
                  variant="filled"
                  color="primary"
                  disabled={submitting}
                  fullWidth
                >
                  Confirm email
                </Button>
              </Localized>
            </HorizontalGutter>
          </HorizontalGutter>
        </form>
      )}
    </Form>
  );
};

export default ConfirmForm;
