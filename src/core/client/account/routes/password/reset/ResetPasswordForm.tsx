import { FORM_ERROR } from "final-form";
import { Localized } from "fluent-react/compat";
import React, { useCallback } from "react";
import { Field, Form } from "react-final-form";

import { ResetPasswordMutation } from "coral-account/mutations";
import { InvalidRequestError } from "coral-framework/lib/errors";
import { useMutation } from "coral-framework/lib/relay";
import {
  composeValidators,
  required,
  validatePassword,
} from "coral-framework/lib/validation";
import {
  Button,
  CallOut,
  FormField,
  HorizontalGutter,
  InputDescription,
  InputLabel,
  PasswordField,
  Typography,
  ValidationMessage,
} from "coral-ui/components";

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
            <HorizontalGutter size="double">
              <HorizontalGutter>
                <Localized id="resetPassword-resetYourPassword">
                  <Typography variant="heading1">
                    Reset your password
                  </Typography>
                </Localized>
                <Localized id="resetPassword-pleaseEnterNewPassword">
                  <Typography variant="bodyCopy">
                    Please enter a new password to use to sign in to your
                    account. Make sure it is unique and be sure to keep it
                    secure.
                  </Typography>
                </Localized>
              </HorizontalGutter>
              <HorizontalGutter>
                <Field
                  name="password"
                  validate={composeValidators(required, validatePassword)}
                >
                  {({ input, meta }) => (
                    <FormField>
                      <Localized id="resetPassword-passwordLabel">
                        <InputLabel htmlFor={input.name}>Password</InputLabel>
                      </Localized>
                      <Localized
                        id="resetPassword-passwordDescription"
                        $minLength={8}
                      >
                        <InputDescription>
                          {"Must be at least {$minLength} characters"}
                        </InputDescription>
                      </Localized>
                      <Localized
                        id="resetPassword-passwordTextField"
                        attrs={{ placeholder: true }}
                      >
                        <PasswordField
                          id={input.name}
                          name={input.name}
                          onChange={input.onChange}
                          value={input.value}
                          placeholder="Password"
                          color={
                            meta.touched && (meta.error || meta.submitError)
                              ? "error"
                              : "regular"
                          }
                          disabled={disabled}
                          fullWidth
                        />
                      </Localized>
                      {submitError && (
                        <CallOut color="error" fullWidth>
                          {submitError}
                        </CallOut>
                      )}
                      {meta.touched && (meta.error || meta.submitError) && (
                        <ValidationMessage fullWidth>
                          {meta.error || meta.submitError}
                        </ValidationMessage>
                      )}
                    </FormField>
                  )}
                </Field>
                <Localized id="resetPassword-resetPassword">
                  <Button
                    type="submit"
                    variant="filled"
                    color="primary"
                    disabled={submitting}
                    fullWidth
                  >
                    Reset Password
                  </Button>
                </Localized>
              </HorizontalGutter>
            </HorizontalGutter>
          </form>
        )}
      </Form>
    </div>
  );
};

export default ResetPasswordForm;
