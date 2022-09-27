import { Localized } from "@fluent/react/compat";
import { FORM_ERROR } from "final-form";
import React, { useCallback } from "react";
import { Field, Form } from "react-final-form";

import { InvalidRequestError } from "coral-framework/lib/errors";
import { colorFromMeta } from "coral-framework/lib/form";
import { useMutation } from "coral-framework/lib/relay";
import {
  composeValidators,
  required,
  validatePassword,
} from "coral-framework/lib/validation";
import { FormField, PasswordField } from "coral-ui/components/v2";
import { Button, CallOut, ValidationMessage } from "coral-ui/components/v3";

import ResetPasswordMutation from "./ResetPasswordMutation";

import styles from "./Reset.css";

interface Props {
  token: string;
  disabled?: boolean;
  onSuccess: () => void;
}

interface FormProps {
  password: string;
}

const ResetPasswordForm: React.FunctionComponent<Props> = ({
  onSuccess,
  token,
  disabled,
}) => {
  const resetPassword = useMutation(ResetPasswordMutation);
  const onSubmit = useCallback(
    async ({ password }: FormProps) => {
      try {
        await resetPassword({ token, password });
        onSuccess();
      } catch (error) {
        if (error instanceof InvalidRequestError) {
          return error.invalidArgs;
        }
        return { [FORM_ERROR]: error.message };
      }
      return;
    },
    [token]
  );
  return (
    <div>
      <Form onSubmit={onSubmit}>
        {({ handleSubmit, submitting, submitError }) => (
          <form autoComplete="off" onSubmit={handleSubmit}>
            <div>
              <div>
                <Localized id="resetPassword-resetYourPassword">
                  <div className={styles.title}>Reset your password</div>
                </Localized>
                <Localized id="resetPassword-pleaseEnterNewPassword">
                  <div className={styles.description}>
                    Please enter a new password to use to sign in to your
                    account. Make sure it is unique and be sure to keep it
                    secure.
                  </div>
                </Localized>
              </div>
              <div>
                <Field
                  name="password"
                  validate={composeValidators(required, validatePassword)}
                >
                  {({ input, meta }) => (
                    <FormField>
                      <Localized id="resetPassword-passwordLabel">
                        <label className={styles.label} htmlFor={input.name}>
                          Password
                        </label>
                      </Localized>
                      <Localized
                        id="resetPassword-passwordDescription"
                        vars={{ minLength: 8 }}
                      >
                        <div className={styles.labelDescription}>
                          {"Must be at least {$minLength} characters"}
                        </div>
                      </Localized>
                      <Localized
                        id="resetPassword-passwordTextField"
                        attrs={{ placeholder: true }}
                      >
                        <PasswordField
                          id={input.name}
                          placeholder="Password"
                          color={colorFromMeta(meta)}
                          autoComplete="new-password"
                          disabled={disabled || meta.submitting}
                          fullWidth
                          {...input}
                        />
                      </Localized>
                      <ValidationMessage meta={meta} />
                    </FormField>
                  )}
                </Field>
                {submitError && <CallOut color="error" title={submitError} />}
                <Localized id="resetPassword-resetPassword">
                  <Button
                    type="submit"
                    variant="filled"
                    color="primary"
                    paddingSize="medium"
                    disabled={submitting}
                    upperCase
                    fullWidth
                    className={styles.submit}
                  >
                    Reset Password
                  </Button>
                </Localized>
              </div>
            </div>
          </form>
        )}
      </Form>
    </div>
  );
};

export default ResetPasswordForm;
