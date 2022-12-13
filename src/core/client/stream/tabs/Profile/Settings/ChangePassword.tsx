import { Localized } from "@fluent/react/compat";
import cn from "classnames";
import { FORM_ERROR, FormApi } from "final-form";
import React, {
  FunctionComponent,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { Field, Form } from "react-final-form";

import { InvalidRequestError } from "coral-framework/lib/errors";
import { useViewerEvent } from "coral-framework/lib/events";
import { hasError } from "coral-framework/lib/form";
import { useMutation } from "coral-framework/lib/relay";
import {
  composeValidators,
  required,
  validatePassword,
} from "coral-framework/lib/validation";
import CLASSES from "coral-stream/classes";
import { ShowEditPasswordDialogEvent } from "coral-stream/events";
import {
  FieldSet,
  Flex,
  FormField,
  HorizontalGutter,
  Icon,
  InputLabel,
  PasswordField,
} from "coral-ui/components/v2";
import { Button, CallOut, ValidationMessage } from "coral-ui/components/v3";

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
  const oldPasswordRef = useRef<HTMLInputElement>(null);
  const emitShowEvent = useViewerEvent(ShowEditPasswordDialogEvent);
  const updatePassword = useMutation(UpdatePasswordMutation);
  const [showForm, setShowForm] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const toggleForm = useCallback(() => {
    if (!showForm) {
      emitShowEvent();
    }
    setShowForm(!showForm);
  }, [showForm, setShowForm]);
  const onSubmit = useCallback(
    async (input: FormProps, form: FormApi) => {
      try {
        await updatePassword(input);
        toggleForm();
        setShowSuccess(true);
      } catch (err) {
        if (err instanceof InvalidRequestError) {
          return err.invalidArgs;
        }

        return {
          [FORM_ERROR]: err.message,
        };
      }

      // Reset the form now that we're done.
      form.initialize({});

      return;
    },
    [updatePassword, setShowSuccess, toggleForm]
  );
  const onCloseSuccess = useCallback(() => {
    setShowSuccess(false);
  }, [setShowSuccess]);

  useEffect(() => {
    if (oldPasswordRef.current) {
      oldPasswordRef.current.focus();
    }
  }, [oldPasswordRef.current, showForm]);

  return (
    <section
      data-testid="profile-account-changePassword"
      className={CLASSES.myPassword.$root}
      aria-labelledby="profile-account-changePassword-title"
    >
      <Localized id="profile-account-changePassword-password">
        <div
          className={cn(styles.title, CLASSES.myPassword.title)}
          id="profile-account-changePassword-title"
        >
          Password
        </div>
      </Localized>
      {!showForm && (
        <Localized id="profile-account-changePassword-change">
          <Button
            variant="flat"
            color="primary"
            paddingSize="none"
            onClick={toggleForm}
            className={cn(
              {
                [styles.changeButton]: !showSuccess,
                [styles.changeButtonMessage]: showSuccess,
              },
              CLASSES.myPassword.editButton
            )}
          >
            Change
          </Button>
        </Localized>
      )}
      {showSuccess && !showForm && (
        <div
          className={cn(
            styles.successContainer,
            CLASSES.myPassword.form.successMessageContainer
          )}
        >
          <CallOut
            color="success"
            onClose={onCloseSuccess}
            className={CLASSES.myPassword.form.successMessage}
            icon={<Icon size="sm">check_circle</Icon>}
            titleWeight="semiBold"
            title={
              <Localized id="profile-account-changePassword-updated">
                <span>Your password has been updated</span>
              </Localized>
            }
            aria-live="polite"
          />
        </div>
      )}
      {showForm && (
        <HorizontalGutter size="oneAndAHalf">
          <Localized id="profile-account-changePassword">
            <div className={cn(styles.header)}>Change Password</div>
          </Localized>
          <Form onSubmit={onSubmit}>
            {({ handleSubmit, submitting, submitError, pristine }) => (
              <form autoComplete="off" onSubmit={handleSubmit}>
                <HorizontalGutter size="oneAndAHalf">
                  <HorizontalGutter container={<FieldSet />}>
                    <Field
                      name="oldPassword"
                      validate={composeValidators(required, validatePassword)}
                    >
                      {({ input, meta }) => (
                        <FormField container={<FieldSet />}>
                          <Localized id="profile-account-changePassword-oldPassword">
                            <InputLabel htmlFor={input.name}>
                              Old Password
                            </InputLabel>
                          </Localized>
                          <PasswordField
                            {...input}
                            fullWidth
                            id={input.name}
                            disabled={submitting}
                            color={hasError(meta) ? "error" : "streamBlue"}
                            autoComplete="current-password"
                            ref={oldPasswordRef}
                          />
                          <ValidationMessage
                            meta={meta}
                            className={CLASSES.validationMessage}
                          />

                          <Flex justifyContent="flex-end">
                            <Localized id="profile-account-changePassword-forgotPassword">
                              <Button
                                variant="flat"
                                color="primary"
                                paddingSize="none"
                                underline
                                onClick={onResetPassword}
                                className={CLASSES.myPassword.form.forgotButton}
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
                          <Localized id="profile-account-changePassword-newPassword">
                            <InputLabel htmlFor={input.name}>
                              New Password
                            </InputLabel>
                          </Localized>
                          <PasswordField
                            {...input}
                            fullWidth
                            id={input.name}
                            disabled={submitting}
                            color={hasError(meta) ? "error" : "streamBlue"}
                            autoComplete="new-password"
                          />
                          <ValidationMessage
                            meta={meta}
                            className={CLASSES.validationMessage}
                          />
                        </FormField>
                      )}
                    </Field>
                    {submitError && (
                      <CallOut
                        color="error"
                        className={CLASSES.myPassword.form.errorMessage}
                        icon={<Icon size="sm">error</Icon>}
                        titleWeight="semiBold"
                        title={submitError}
                        role="alert"
                      />
                    )}
                    <div
                      className={cn(
                        styles.footer,
                        CLASSES.myPassword.form.footer
                      )}
                    >
                      <Localized id="profile-account-changePassword-cancel">
                        <Button
                          type="button"
                          variant="outlined"
                          color="secondary"
                          onClick={toggleForm}
                          className={cn(
                            styles.footerButton,
                            CLASSES.myPassword.form.cancelButton
                          )}
                        >
                          Cancel
                        </Button>
                      </Localized>
                      <Localized id="profile-account-changePassword-button">
                        <Button
                          type="submit"
                          variant="filled"
                          color="primary"
                          className={cn(
                            styles.footerButton,
                            CLASSES.myPassword.form.changeButton
                          )}
                          disabled={submitting || pristine}
                        >
                          Change Password
                        </Button>
                      </Localized>
                    </div>
                  </HorizontalGutter>
                </HorizontalGutter>
              </form>
            )}
          </Form>
        </HorizontalGutter>
      )}
    </section>
  );
};

export default ChangePassword;
