import { Localized } from "@fluent/react/compat";
import cn from "classnames";
import { FORM_ERROR } from "final-form";
import React, { FunctionComponent, useCallback } from "react";
import { Field, Form } from "react-final-form";
import { graphql } from "react-relay";

import Main from "coral-auth/components/Main";
import OrSeparator from "coral-auth/components/OrSeparator";
import useResizePopup from "coral-auth/hooks/useResizePopup";
import { SetViewMutation } from "coral-auth/mutations";
import {
  FormError,
  OnSubmit,
  streamColorFromMeta,
} from "coral-framework/lib/form";
import {
  useLocal,
  useMutation,
  withFragmentContainer,
} from "coral-framework/lib/relay";
import { required } from "coral-framework/lib/validation";
import CLASSES from "coral-stream/classes";
import {
  FormField,
  Icon,
  InputLabel,
  PasswordField,
} from "coral-ui/components/v2";
import { Button, CallOut, ValidationMessage } from "coral-ui/components/v3";

import { LinkAccountContainer_viewer } from "coral-auth/__generated__/LinkAccountContainer_viewer.graphql";
import { LinkAccountContainerLocal } from "coral-auth/__generated__/LinkAccountContainerLocal.graphql";

import LinkAccountMutation from "./LinkAccountMutation";

import styles from "./LinkAccountContainer.css";

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
      <div role="banner" className={cn(CLASSES.login.bar, styles.bar)}>
        <Localized id="linkAccount-linkAccountHeader">
          <div className={cn(CLASSES.login.title, styles.title)}>
            Link Account
          </div>
        </Localized>
      </div>
      <Main id="link-account-main" data-testid="linkAccount-main">
        <Form onSubmit={onSubmit}>
          {({ handleSubmit, submitting, submitError }) => (
            <form autoComplete="off" onSubmit={handleSubmit}>
              <Localized
                id="linkAccount-alreadyAssociated"
                vars={{ email: duplicateEmail }}
                elems={{ strong: <span className={styles.strong} /> }}
              >
                <div
                  className={cn(CLASSES.login.description, styles.description)}
                >
                  The email <strong>{duplicateEmail}</strong> is already
                  associated with an account. If you would like to link these
                  enter your password.
                </div>
              </Localized>
              {submitError && (
                <div className={cn(CLASSES.login.errorContainer, styles.error)}>
                  <CallOut
                    className={CLASSES.login.error}
                    color="error"
                    icon={<Icon size="sm">error</Icon>}
                    title={submitError}
                  />
                </div>
              )}
              <div className={cn(CLASSES.login.field, styles.field)}>
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
                          color={streamColorFromMeta(meta)}
                          disabled={submitting}
                          fullWidth
                        />
                      </Localized>
                      <ValidationMessage meta={meta} />
                    </FormField>
                  )}
                </Field>
              </div>
              <Localized id="linkAccount-linkAccountButton">
                <Button
                  variant="filled"
                  color="primary"
                  fontSize="medium"
                  paddingSize="medium"
                  upperCase
                  type="submit"
                  fullWidth
                  disabled={submitting}
                >
                  Link Account
                </Button>
              </Localized>
            </form>
          )}
        </Form>
        <OrSeparator />
        <Localized id="linkAccount-useDifferentEmail">
          <Button
            variant="filled"
            color="secondary"
            fontSize="medium"
            paddingSize="medium"
            upperCase
            type="submit"
            fullWidth
            onClick={changeEmail}
          >
            Use a different email address
          </Button>
        </Localized>
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
