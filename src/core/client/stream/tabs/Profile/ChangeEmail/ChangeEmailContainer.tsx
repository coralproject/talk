import { Localized } from "fluent-react/compat";
import React, { FunctionComponent, useCallback, useState } from "react";
import { FormApi, FORM_ERROR } from "final-form";
import { Field, Form } from "react-final-form";

import {
  graphql,
  useMutation,
  withFragmentContainer,
} from "coral-framework/lib/relay";
import { PasswordField } from "coral-framework/components";
import {
  composeValidators,
  validateEmail,
  required,
} from "coral-framework/lib/validation";
import {
  Button,
  ButtonIcon,
  CallOut,
  Flex,
  FormField,
  HorizontalGutter,
  InputLabel,
  TextField,
  Typography,
} from "coral-ui/components";
import { colorFromMeta, ValidationMessage } from "coral-framework/lib/form";
import { InvalidRequestError } from "coral-framework/lib/errors";

import { ChangeEmailContainer_viewer as ViewerData } from "coral-stream/__generated__/ChangeEmailContainer_viewer.graphql";

import styles from "./ChangeEmail.css";

interface Props {
  viewer: ViewerData;
}

interface FormProps {
  email: string;
  password: string;
}

const changeEmailContainer: FunctionComponent<Props> = ({ viewer }) => {
  const updateEmail = () => {};
  const [showEditForm, setShowEditForm] = useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const toggleEditForm = useCallback(() => {
    setShowEditForm(!showEditForm);
  }, [setShowEditForm, showEditForm]);
  const onSubmit = useCallback(
    async (input: FormProps, form: FormApi) => {
      try {
        await updateEmail({
          email: input.email,
          password: input.password,
        });
      } catch (err) {
        if (err instanceof InvalidRequestError) {
          return err.invalidArgs;
        }

        return {
          [FORM_ERROR]: err.message,
        };
      }

      form.reset();
      setShowEditForm(false);
      setShowSuccessMessage(true);

      return;
    },
    [updateEmail]
  );
  return (
    <HorizontalGutter spacing={5} data-testid="profile-changeEmail">
      {!showEditForm && (
        <Flex alignItems="center">
          <Typography>{viewer.email}</Typography>
          <Localized id="profile-changeEmail-edit">
            <Button size="small" color="primary" onClick={toggleEditForm}>
              Edit
            </Button>
          </Localized>
        </Flex>
      )}
      {showEditForm && (
        <CallOut className={styles.callOut} color="primary">
          <HorizontalGutter spacing={4}>
            <div>
              <Localized id="profile-changeEmail-heading">
                <Typography variant="heading2" gutterBottom>
                  Edit your email address
                </Typography>
              </Localized>
              <Localized id="profile-changeEmail-desc">
                <Typography>
                  Change the email address used for signing in and for receiving
                  communication about your account.
                </Typography>
              </Localized>
            </div>
            <div>
              <Localized id="profile-changeEmail-current">
                <Typography
                  className={styles.currentEmail}
                  variant="bodyCopyBold"
                >
                  Current email
                </Typography>
              </Localized>
              <Typography variant="heading2">{viewer.email}</Typography>
            </div>
            <Form onSubmit={onSubmit}>
              {({
                handleSubmit,
                submitError,
                pristine,
                invalid,
                submitting,
              }) => (
                <form
                  onSubmit={handleSubmit}
                  data-testid="profile-changeEmail-form"
                >
                  <HorizontalGutter spacing={4}>
                    <FormField>
                      <HorizontalGutter>
                        <Localized id="profile-changeEmail-newEmail-label">
                          <InputLabel htmlFor="profile-changeEmail-Email">
                            New email address
                          </InputLabel>
                        </Localized>
                        <Field
                          name="email"
                          validate={composeValidators(required, validateEmail)}
                          id="profile-changeEmail-email"
                        >
                          {({ input, meta }) => (
                            <>
                              <TextField
                                {...input}
                                fullWidth
                                id="profile-changeEmail-email"
                              />
                              <ValidationMessage meta={meta} />
                            </>
                          )}
                        </Field>
                      </HorizontalGutter>
                    </FormField>
                    <FormField>
                      <HorizontalGutter>
                        <Field
                          name="password"
                          validate={composeValidators(required)}
                        >
                          {({ input, meta }) => (
                            <FormField>
                              <Localized id="profile-changeEmail-password">
                                <InputLabel htmlFor={input.name}>
                                  Password
                                </InputLabel>
                              </Localized>
                              <Localized
                                id="profile-changeEmail-password-input"
                                attrs={{ placeholder: true }}
                              >
                                <PasswordField
                                  id={input.name}
                                  placeholder="Password"
                                  color={colorFromMeta(meta)}
                                  disabled={submitting}
                                  fullWidth
                                  {...input}
                                />
                              </Localized>
                              <ValidationMessage meta={meta} fullWidth />
                            </FormField>
                          )}
                        </Field>
                      </HorizontalGutter>
                    </FormField>
                    {submitError && (
                      <CallOut color="error" fullWidth>
                        {submitError}
                      </CallOut>
                    )}
                  </HorizontalGutter>
                  <Flex justifyContent="flex-end" className={styles.footer}>
                    <Localized id="profile-changeEmail-cancel">
                      <Button type="button" onClick={toggleEditForm}>
                        Cancel
                      </Button>
                    </Localized>
                    <Localized id="profile-changeEmail-submit">
                      <Button
                        variant={pristine || invalid ? "outlined" : "filled"}
                        type="submit"
                        color={pristine || invalid ? "regular" : "primary"}
                        disabled={pristine || invalid}
                      >
                        <ButtonIcon>save</ButtonIcon>
                        <span>Save</span>
                      </Button>
                    </Localized>
                  </Flex>
                </form>
              )}
            </Form>
          </HorizontalGutter>
        </CallOut>
      )}
    </HorizontalGutter>
  );
};

const enhanced = withFragmentContainer<Props>({
  viewer: graphql`
    fragment ChangeEmailContainer_viewer on User {
      email
      emailVerified
    }
  `,
})(changeEmailContainer);

export default enhanced;
