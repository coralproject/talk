import { FORM_ERROR, FormApi } from "final-form";
import React, { FunctionComponent, useCallback } from "react";
import { Field, Form } from "react-final-form";

import { InvalidRequestError } from "coral-framework/lib/errors";
import { colorFromMeta, ValidationMessage } from "coral-framework/lib/form";
import { useMutation } from "coral-framework/lib/relay";
import {
  composeValidators,
  required,
  validatePassword,
} from "coral-framework/lib/validation";
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
            <Typography variant="heading3">Change Password</Typography>
            <HorizontalGutter container={<FieldSet />}>
              <FormField container={<FieldSet />}>
                <InputLabel>Old Password</InputLabel>
                <Field
                  name="oldPassword"
                  validate={composeValidators(required, validatePassword)}
                >
                  {({ input, meta }) => (
                    <>
                      <PasswordField
                        fullWidth
                        disabled={submitting}
                        color={colorFromMeta(meta)}
                        autoComplete="current-password"
                        {...input}
                      />
                      <ValidationMessage fullWidth meta={meta} />
                    </>
                  )}
                </Field>
                <Flex justifyContent="flex-end">
                  <Typography variant="bodyCopy">
                    <Button
                      variant="underlined"
                      color="primary"
                      onClick={onResetPassword}
                    >
                      Forgot your password?
                    </Button>
                  </Typography>
                </Flex>
              </FormField>
              <FormField container={<FieldSet />}>
                <InputLabel>New Password</InputLabel>
                <Field
                  name="newPassword"
                  validate={composeValidators(required, validatePassword)}
                >
                  {({ input, meta }) => (
                    <>
                      <PasswordField
                        fullWidth
                        disabled={submitting}
                        color={colorFromMeta(meta)}
                        autoComplete="new-password"
                        {...input}
                      />
                      <ValidationMessage fullWidth meta={meta} />
                    </>
                  )}
                </Field>
              </FormField>
              {submitError && (
                <CallOut color="error" fullWidth>
                  {submitError}
                </CallOut>
              )}
              {submitSucceeded && (
                <CallOut color="success" fullWidth>
                  Your password has been updated
                </CallOut>
              )}
              <Flex justifyContent="flex-end">
                <Button
                  color="primary"
                  variant="filled"
                  type="submit"
                  disabled={submitting || pristine}
                >
                  Change Password
                </Button>
              </Flex>
            </HorizontalGutter>
          </HorizontalGutter>
        </form>
      )}
    </Form>
  );
};

export default ChangePassword;
