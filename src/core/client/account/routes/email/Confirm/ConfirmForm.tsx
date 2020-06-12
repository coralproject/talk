import { Localized } from "@fluent/react/compat";
import { FORM_ERROR } from "final-form";
import React, { useCallback } from "react";
import { Form } from "react-final-form";

import { InvalidRequestError } from "coral-framework/lib/errors";
import { useMutation } from "coral-framework/lib/relay";
import { Button } from "coral-ui/components/v3";

import ConfirmMutation from "./ConfirmMutation";

import styles from "./Confirm.css";

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
          <div>
            <div>
              <Localized id="confirmEmail-confirmYourEmailAddress">
                <div className={styles.title}>Confirm your email address</div>
              </Localized>
              <Localized id="confirmEmail-pleaseClickToConfirm">
                <div className={styles.description}>
                  Click below to confirm your email address.
                </div>
              </Localized>
            </div>
            <div>
              <Localized id="confirmEmail-confirmEmail">
                <Button
                  type="submit"
                  variant="filled"
                  color="primary"
                  disabled={submitting}
                  fullWidth
                  upperCase
                  className={styles.submit}
                >
                  Confirm email
                </Button>
              </Localized>
            </div>
          </div>
        </form>
      )}
    </Form>
  );
};

export default ConfirmForm;
