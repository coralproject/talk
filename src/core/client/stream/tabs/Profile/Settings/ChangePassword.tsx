import { FORM_ERROR, FormApi } from "final-form";
import { Localized } from "fluent-react/compat";
import React, { FunctionComponent, useCallback, useState } from "react";
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
import FieldValidationMessage from "coral-stream/common/FieldValidationMessage";
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

import styles from "./ChangePassword.css";

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

  const [showForm, setShowForm] = useState(false);
  const toggleForm = useCallback(() => setShowForm(!showForm), [
    showForm,
    setShowForm,
  ]);

  return (
    <div
      data-testid="profile-settings-changePassword"
      className={CLASSES.changePassword.$root}
    >
      {!showForm && (
        <Flex justifyContent="space-between" alignItems="center">
          <Localized id="profile-settings-changePassword-password">
            <Typography variant="heading2">Password</Typography>
          </Localized>

          <Localized id="profile-settings-changePassword-edit">
            <Button
              variant="outlineFilled"
              color="primary"
              size="small"
              onClick={toggleForm}
            >
              Edit
            </Button>
          </Localized>
        </Flex>
      )}
      {showForm && (
        <CallOut color="primary" borderless className={styles.callOut}>
          <HorizontalGutter size="oneAndAHalf">
            <Localized id="profile-settings-changePassword">
              <Typography variant="heading1" color="textDark" gutterBottom>
                Change Password
              </Typography>
            </Localized>
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
                            <FieldValidationMessage fullWidth meta={meta} />

                            <Flex justifyContent="flex-end">
                              <Localized id="profile-settings-changePassword-forgotPassword">
                                <Button
                                  variant="underlined"
                                  color="primary"
                                  onClick={onResetPassword}
                                  className={
                                    CLASSES.changePassword.forgotButton
                                  }
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
                            <FieldValidationMessage fullWidth meta={meta} />
                          </FormField>
                        )}
                      </Field>
                      {submitError && (
                        <CallOut
                          color="error"
                          fullWidth
                          className={CLASSES.changePassword.errorMessage}
                        >
                          {submitError}
                        </CallOut>
                      )}
                      {submitSucceeded && (
                        <Localized id="profile-settings-changePassword-updated">
                          <CallOut
                            color="success"
                            fullWidth
                            className={CLASSES.changePassword.successMessage}
                          >
                            Your password has been updated
                          </CallOut>
                        </Localized>
                      )}
                      <Flex justifyContent="flex-end">
                        <Localized id="profile-settings-chagnePassword-cancel">
                          <Button type="button" onClick={toggleForm}>
                            Cancel
                          </Button>
                        </Localized>
                        <Localized id="profile-settings-changePassword-button">
                          <Button
                            color="primary"
                            variant="filled"
                            className={CLASSES.changePassword.changeButton}
                            type="submit"
                            disabled={submitting || pristine}
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
          </HorizontalGutter>
        </CallOut>
      )}
    </div>
  );
};

export default ChangePassword;
