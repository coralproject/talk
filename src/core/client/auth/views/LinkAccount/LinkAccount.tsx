import { Localized } from "@fluent/react/compat";
import { FORM_ERROR } from "final-form";
import React, { FunctionComponent, useCallback } from "react";
import { Field, Form } from "react-final-form";

import { Bar, Title } from "coral-auth/components//Header";
import Main from "coral-auth/components/Main";
import OrSeparator from "coral-auth/components/OrSeparator";
import useResizePopup from "coral-auth/hooks/useResizePopup";
import { SetDuplicateEmailMutation } from "coral-auth/mutations";
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

import { LinkAccountLocal } from "coral-auth/__generated__/LinkAccountLocal.graphql";

import LinkAccountMutation from "./LinkAccountMutation";

interface FormProps {
  password: string;
}

interface FormErrorProps extends FormProps, FormError {}

const LinkAccountContainer: FunctionComponent = () => {
  const [local] = useLocal<LinkAccountLocal>(graphql`
    fragment LinkAccountLocal on Local {
      duplicateEmail
    }
  `);
  const setDuplicateEmail = useMutation(SetDuplicateEmailMutation);
  const linkAccount = useMutation(LinkAccountMutation);
  const onSubmit: OnSubmit<FormErrorProps> = useCallback(
    async (input, form) => {
      if (!local.duplicateEmail) {
        return { [FORM_ERROR]: "duplicate email not set" };
      }
      try {
        await linkAccount({
          email: local.duplicateEmail,
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

  const ref = useResizePopup();

  return (
    <div ref={ref} data-testid="linkAccount-container">
      <Bar>
        <Localized id="linkAccount-linkAccountHeader">
          <Title>Link Account</Title>
        </Localized>
      </Bar>
      <Main data-testid="linkAccount-main">
        <HorizontalGutter spacing={3}>
          <Form onSubmit={onSubmit}>
            {({ handleSubmit, submitting, submitError }) => (
              <form autoComplete="off" onSubmit={handleSubmit}>
                <HorizontalGutter size="oneAndAHalf">
                  <Localized id="linkAccount-whatItIs">
                    <Typography variant="bodyCopy">
                      The email <strong>{local.duplicateEmail}</strong> is
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
          <Localized id="linkAccount-changeEmail">
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
      </Main>
    </div>
  );
};

export default LinkAccountContainer;
