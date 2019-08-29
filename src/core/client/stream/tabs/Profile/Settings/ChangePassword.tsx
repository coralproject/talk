import { FORM_ERROR, FormApi } from "final-form";
import { Localized } from "fluent-react/compat";
import React, { FunctionComponent, useCallback } from "react";
import { Field, Form } from "react-final-form";

import { InvalidRequestError } from "coral-framework/lib/errors";
import { colorFromMeta } from "coral-framework/lib/form";
import { useMutation } from "coral-framework/lib/relay";
import {
  composeValidators,
  required,
  validatePassword,
} from "coral-framework/lib/validation";
import CLASSES from "coral-stream/classes";
import ValidationMessageHelper from "coral-stream/common/ValidationMessageHelper";
import {
  Button,
  CallOut,
  FieldSet,
  Flex,
  FormField,
  HorizontalGutter,
  InputLabel,
  PasswordField,
  Typography,
} from "coral-ui/components";

import UpdatePasswordMutation from "./UpdatePasswordMutation";

interface Props {
  onResetPassword: () => void;
}

interface FormProps {
  oldPassword: string;
  newPassword: string;
}

const ChangePassword: FunctionComponent<Props> = ({ onResetPassword }) => {
  const updatePassword = useMutation(UpdatePasswordMutation);
  const onSubmit = useCallback(
    async (input: FormProps, form: FormApi) => {
      try {
        await updatePassword(input);
      } catch (err) {
        if (err instanceof InvalidRequestError) {
          return err.invalidArgs;
        }

        return {
          [FORM_ERROR]: err.message,
        };
      }

      // Reset the form now that we're done.
      form.reset();

      return;
    },
    [updatePassword]
  );

  return (
    <div
      className={CLASSES.changePassword.$root}
      data-testid="profile-settings-changePassword"
    >
      <Form onSubmit={onSubmit}>
        {({
          handleSubmit,
          submitting,
          submitError,
          pristine,
          submitSucceeded,
        }) => (
          <form autoComplete="off" onSubmit={handleSubmit}>
            <HorizontalGutter size="oneAndAHalf">
              <Localized id="profile-settings-changePassword">
                <Typography variant="heading3">Change Password</Typography>
              </Localized>
              <HorizontalGutter container={<FieldSet />}>
                <Field
                  name="oldPassword"
                  validate={composeValidators(required, validatePassword)}
                >
                  {({ input, meta }) => (
                    <FormField container={<FieldSet />}>
                      <Localized id="profile-settings-changePassword-oldPassword">
                        <InputLabel htmlFor={input.name}>
                          Old Password
                        </InputLabel>
                      </Localized>
                      <PasswordField
                        fullWidth
                        id={input.name}
                        disabled={submitting}
                        color={colorFromMeta(meta)}
                        autoComplete="current-password"
                        {...input}
                      />
                      <ValidationMessageHelper fullWidth meta={meta} />

                      <Flex justifyContent="flex-end">
                        <Localized id="profile-settings-changePassword-forgotPassword">
                          <Button
                            variant="underlined"
                            color="primary"
                            onClick={onResetPassword}
                            className={CLASSES.changePassword.forgotButton}
                          >
                            Forgot your password?
                          </Button>
                        </Localized>
                      </Flex>
                    </FormField>
                  )}
                </Field>
                <Field
                  name="newPassword"
                  validate={composeValidators(required, validatePassword)}
                >
                  {({ input, meta }) => (
                    <FormField container={<FieldSet />}>
                      <Localized id="profile-settings-changePassword-newPassword">
                        <InputLabel htmlFor={input.name}>
                          New Password
                        </InputLabel>
                      </Localized>
                      <PasswordField
                        fullWidth
                        id={input.name}
                        disabled={submitting}
                        color={colorFromMeta(meta)}
                        autoComplete="new-password"
                        {...input}
                      />
                      <ValidationMessageHelper fullWidth meta={meta} />
                    </FormField>
                  )}
                </Field>
                {submitError && (
                  <CallOut
                    className={CLASSES.changePassword.errorMessage}
                    color="error"
                    fullWidth
                  >
                    {submitError}
                  </CallOut>
                )}
                {submitSucceeded && (
                  <Localized id="profile-settings-changePassword-updated">
                    <CallOut
                      className={CLASSES.changePassword.successMessage}
                      color="success"
                      fullWidth
                    >
                      Your password has been updated
                    </CallOut>
                  </Localized>
                )}
                <Flex justifyContent="flex-end">
                  <Localized id="profile-settings-changePassword-button">
                    <Button
                      color="primary"
                      variant="filled"
                      type="submit"
                      disabled={submitting || pristine}
                      className={CLASSES.changePassword.changeButton}
                    >
                      Change Password
                    </Button>
                  </Localized>
                </Flex>
              </HorizontalGutter>
            </HorizontalGutter>
          </form>
        )}
      </Form>
    </div>
  );
};

export default ChangePassword;
