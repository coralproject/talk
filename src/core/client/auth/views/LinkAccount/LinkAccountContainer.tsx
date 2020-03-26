import { Localized } from "@fluent/react/compat";
import { FORM_ERROR } from "final-form";
import React, { FunctionComponent, useCallback } from "react";
import { Field, Form } from "react-final-form";
import { graphql } from "react-relay";

import { Bar, Title } from "coral-auth/components//Header";
import Main from "coral-auth/components/Main";
import OrSeparator from "coral-auth/components/OrSeparator";
import useResizePopup from "coral-auth/hooks/useResizePopup";
import { SetViewMutation } from "coral-auth/mutations";
import {
  colorFromMeta,
  FormError,
  OnSubmit,
  ValidationMessage,
} from "coral-framework/lib/form";
import {
  useLocal,
  useMutation,
  withFragmentContainer,
} from "coral-framework/lib/relay";
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

import { LinkAccountContainer_viewer } from "coral-auth/__generated__/LinkAccountContainer_viewer.graphql";
import { LinkAccountContainerLocal } from "coral-auth/__generated__/LinkAccountContainerLocal.graphql";

import LinkAccountMutation from "./LinkAccountMutation";

interface FormProps {
  password: string;
}

interface FormErrorProps extends FormProps, FormError {}

interface Props {
  viewer: LinkAccountContainer_viewer | null;
}

const LinkAccountContainer: FunctionComponent<Props> = (props) => {
  const [local] = useLocal<LinkAccountContainerLocal>(graphql`
    fragment LinkAccountContainerLocal on Local {
      duplicateEmail
    }
  `);
  const duplicateEmail =
    local.duplicateEmail || (props.viewer && props.viewer.duplicateEmail);
  const setView = useMutation(SetViewMutation);
  const linkAccount = useMutation(LinkAccountMutation);
  const onSubmit: OnSubmit<FormErrorProps> = useCallback(
    async (input, form) => {
      if (!duplicateEmail) {
        return { [FORM_ERROR]: "duplicate email not set" };
      }
      try {
        await linkAccount({
          email: duplicateEmail,
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
    setView({ view: "ADD_EMAIL_ADDRESS" });
  }, [setView]);

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
                  <Localized
                    id="linkAccount-alreadyAssociated"
                    $email={duplicateEmail}
                    strong={<strong />}
                  >
                    <Typography variant="bodyCopy">
                      The email <strong>{duplicateEmail}</strong> is already
                      associated with an account. If you would like to link
                      these enter your password.
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
      </Main>
    </div>
  );
};

const enhanced = withFragmentContainer<Props>({
  viewer: graphql`
    fragment LinkAccountContainer_viewer on User {
      duplicateEmail
    }
  `,
})(LinkAccountContainer);

export default enhanced;
