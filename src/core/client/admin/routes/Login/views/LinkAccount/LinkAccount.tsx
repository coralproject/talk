import { Localized } from "@fluent/react/compat";
import { FORM_ERROR } from "final-form";
import React, { FunctionComponent, useCallback } from "react";
import { Field, Form } from "react-final-form";

import {
  colorFromMeta,
  FormError,
  OnSubmit,
  ValidationMessage,
} from "coral-framework/lib/form";
import { graphql, useLocal, useMutation } from "coral-framework/lib/relay";
import { required } from "coral-framework/lib/validation";
import {
  Button,
  CallOut,
  FormField,
  HorizontalGutter,
  InputLabel,
  PasswordField,
  Typography,
} from "coral-ui/components";

import { LinkAccountLocal } from "coral-admin/__generated__/LinkAccountLocal.graphql";

import CompleteAccountBox from "../../CompleteAccountBox";
import SetDuplicateEmailMutation from "../../SetDuplicateEmailMutation";
import LinkAccountMutation from "./LinkAccountMutation";
import OrSeparator from "./OrSeparator";

interface FormProps {
  password: string;
}

interface FormErrorProps extends FormProps, FormError {}

const LinkAccountContainer: FunctionComponent = () => {
  const [local] = useLocal<LinkAccountLocal>(graphql`
    fragment LinkAccountLocal on Local {
      authDuplicateEmail
    }
  `);
  const setDuplicateEmail = useMutation(SetDuplicateEmailMutation);
  const linkAccount = useMutation(LinkAccountMutation);
  const onSubmit: OnSubmit<FormErrorProps> = useCallback(
    async (input, form) => {
      if (!local.authDuplicateEmail) {
        return { [FORM_ERROR]: "duplicate email not set" };
      }
      try {
        await linkAccount({
          email: local.authDuplicateEmail,
          password: input.password,
        });
        return;
      } catch (error) {
        return { [FORM_ERROR]: error.message };
      }
    },
    [linkAccount]
  );
  const changeEmail = useCallback(() => {
    setDuplicateEmail({ duplicateEmail: null });
  }, [setDuplicateEmail]);

  return (
    <CompleteAccountBox
      data-testid="linkAccount-container"
      title={
        <Localized id="linkAccount-linkAccountHeader">
          <span>Link Account</span>
        </Localized>
      }
    >
      <HorizontalGutter spacing={3}>
        <Form onSubmit={onSubmit}>
          {({ handleSubmit, submitting, submitError }) => (
            <form autoComplete="off" onSubmit={handleSubmit}>
              <HorizontalGutter size="oneAndAHalf">
                <Localized
                  id="linkAccount-alreadyAssociated"
                  $email={local.authDuplicateEmail}
                  strong={<strong />}
                >
                  <Typography variant="bodyCopy">
                    The email <strong>{local.authDuplicateEmail}</strong> is
                    already associated with an account. If you would like to
                    link these enter your password.
                  </Typography>
                </Localized>
                {submitError && (
                  <CallOut color="error" fullWidth>
                    {submitError}
                  </CallOut>
                )}
                <Field name="password" validate={required}>
                  {({ input, meta }) => (
                    <FormField>
                      <Localized id="linkAccount-passwordLabel">
                        <InputLabel htmlFor={input.name}>Password</InputLabel>
                      </Localized>
                      <Localized
                        id="linkAccount-passwordTextField"
                        attrs={{ placeholder: true }}
                      >
                        <PasswordField
                          {...input}
                          id={input.name}
                          placeholder="Password"
                          color={colorFromMeta(meta)}
                          disabled={submitting}
                          fullWidth
                        />
                      </Localized>
                      <ValidationMessage meta={meta} fullWidth />
                    </FormField>
                  )}
                </Field>
                <Localized id="linkAccount-linkAccountButton">
                  <Button
                    variant="filled"
                    color="primary"
                    size="large"
                    type="submit"
                    fullWidth
                    disabled={submitting}
                  >
                    Link Account
                  </Button>
                </Localized>
              </HorizontalGutter>
            </form>
          )}
        </Form>
        <OrSeparator />
        <Localized id="linkAccount-useDifferentEmail">
          <Button
            variant="filled"
            size="large"
            type="submit"
            fullWidth
            onClick={changeEmail}
          >
            Use a different email address
          </Button>
        </Localized>
      </HorizontalGutter>
    </CompleteAccountBox>
  );
};

export default LinkAccountContainer;
