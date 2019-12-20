import { Localized } from "@fluent/react/compat";
import { FORM_ERROR } from "final-form";
import React, { useCallback } from "react";
import { Form } from "react-final-form";

import { InvalidRequestError } from "coral-framework/lib/errors";
import { useMutation } from "coral-framework/lib/relay";
import {
  Button,
  CallOut,
  HorizontalGutter,
  Typography,
} from "coral-ui/components";

import UnsubscribeNotificationsMutation from "./UnsubscribeNotificationsMutation";

interface Props {
  token: string;
  disabled?: boolean;
  onSuccess: () => void;
}

const UnsubscribeForm: React.FunctionComponent<Props> = ({
  onSuccess,
  token,
}) => {
  const unsubscribe = useMutation(UnsubscribeNotificationsMutation);
  const onSubmit = useCallback(async () => {
    try {
      await unsubscribe({ token });
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
    <div data-testid="unsubscribe-form">
      <Form onSubmit={onSubmit}>
        {({ handleSubmit, submitting, submitError }) => (
          <form onSubmit={handleSubmit}>
            <HorizontalGutter>
              <Localized id="unsubscribe-clickToConfirm">
                <Typography variant="heading1">
                  Click below to confirm that you want to unsubscribe from all
                  notifications.
                </Typography>
              </Localized>
              {submitError && (
                <CallOut color="error" fullWidth>
                  {submitError}
                </CallOut>
              )}
              <Localized id="unsubscribe-confirm">
                <Button
                  type="submit"
                  variant="filled"
                  color="primary"
                  disabled={submitting}
                  fullWidth
                >
                  Confirm
                </Button>
              </Localized>
            </HorizontalGutter>
          </form>
        )}
      </Form>
    </div>
  );
};

export default UnsubscribeForm;
