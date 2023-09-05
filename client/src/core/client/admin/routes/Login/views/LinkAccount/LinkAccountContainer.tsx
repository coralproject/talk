import { Localized } from "@fluent/react/compat";
import { FORM_ERROR } from "final-form";
import React, { FunctionComponent, useCallback } from "react";
import { Field, Form } from "react-final-form";
import { graphql } from "react-relay";

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
} from "coral-ui/components/v2";

import { LinkAccountContainer_viewer } from "coral-admin/__generated__/LinkAccountContainer_viewer.graphql";
import { LinkAccountContainerLocal } from "coral-admin/__generated__/LinkAccountContainerLocal.graphql";

import CompleteAccountBox from "../../CompleteAccountBox";
import SetAuthViewMutation from "../../SetAuthViewMutation";
import LinkAccountMutation from "./LinkAccountMutation";
import OrSeparator from "./OrSeparator";

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
      authDuplicateEmail
    }
  `);
  const setView = useMutation(SetAuthViewMutation);
  const linkAccount = useMutation(LinkAccountMutation);
  const duplicateEmail =
    local.authDuplicateEmail || (props.viewer && props.viewer.duplicateEmail);
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
    [duplicateEmail, linkAccount]
  );
  const changeEmail = useCallback(() => {
    setView({ view: "ADD_EMAIL_ADDRESS" });
  }, [setView]);

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
                  vars={{ email: duplicateEmail! }}
                  elems={{ strong: <strong /> }}
                >
                  <div>
                    The email <strong>{duplicateEmail}</strong> is already
                    associated with an account. If you would like to link these
                    enter your password.
                  </div>
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
                    variant="regular"
                    color="regular"
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
            color="mono"
            variant="regular"
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

const enhanced = withFragmentContainer<Props>({
  viewer: graphql`
    fragment LinkAccountContainer_viewer on User {
      duplicateEmail
    }
  `,
})(LinkAccountContainer);

export default enhanced;
