import { Localized } from "@fluent/react/compat";
import { FORM_ERROR } from "final-form";
import React, { useCallback } from "react";
import { Form } from "react-final-form";

import { InvalidRequestError } from "coral-framework/lib/errors";
import { useMutation } from "coral-framework/lib/relay";
import { Button, CallOut } from "coral-ui/components/v3";

import UnsubscribeNotificationsMutation from "./UnsubscribeNotificationsMutation";

import styles from "./Unsubscribe.css";

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
            <div>
              <Localized id="unsubscribe-unsubscribeFromEmails">
                <div className={styles.title}>
                  Unsubscribe from email notifications
                </div>
              </Localized>
              <Localized id="unsubscribe-clickToConfirm">
                <div className={styles.description}>
                  Click below to confirm that you want to unsubscribe from all
                  notifications.
                </div>
              </Localized>
              {submitError && <CallOut color="error" title={submitError} />}
              <Localized id="unsubscribe-submit-unsubscribe">
                <Button
                  type="submit"
                  variant="filled"
                  paddingSize="medium"
                  color="primary"
                  disabled={submitting}
                  upperCase
                  fullWidth
                  className={styles.submit}
                >
                  Unsubscribe
                </Button>
              </Localized>
            </div>
          </form>
        )}
      </Form>
    </div>
  );
};

export default UnsubscribeForm;
