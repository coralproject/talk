import { Localized } from "@fluent/react/compat";
import { Match, Router, withRouter } from "found";
import React, { FunctionComponent, useCallback } from "react";
import { Field, Form } from "react-final-form";
import { graphql } from "react-relay";

import { colorFromMeta, ValidationMessage } from "coral-framework/lib/form";
import { useMutation, withFragmentContainer } from "coral-framework/lib/relay";
import {
  Button,
  ButtonIcon,
  CallOut,
  Flex,
  FormField,
  HorizontalGutter,
  Label,
  RadioButton,
  TextField,
} from "coral-ui/components/v2";

import { ConfigureEmailDomainForm_emailDomain } from "coral-admin/__generated__/ConfigureEmailDomainForm_emailDomain.graphql";
import EditEmailDomainMutation from "./EditEmailDomainMutation";
import { urls } from "coral-framework/helpers";

interface Props {
  router: Router;
  match: Match;
  emailDomain: ConfigureEmailDomainForm_emailDomain;
}

const ConfigureEmailDomainForm: FunctionComponent<Props> = ({
  emailDomain,
  router,
}) => {
  const edit = useMutation(EditEmailDomainMutation);
  const onSubmit = useCallback(async (input) => {
    try {
      await edit({
        domain: input.domain,
        newUserModeration: input.newUserModeration,
        id: emailDomain.id,
      });
      router.push(urls.admin.configureModeration);
    } catch (error) {
      // KNOTE: Handle the error here
    }
  }, []);

  return (
    <Form
      onSubmit={onSubmit}
      initialValues={{
        domain: emailDomain ? emailDomain.domain : null,
        newUserModeration: emailDomain ? emailDomain.newUserModeration : null,
      }}
    >
      {({ handleSubmit, submitting, submitError }) => (
        <form autoComplete="off" onSubmit={handleSubmit}>
          <HorizontalGutter size="double">
            {submitError && (
              <CallOut color="error" fullWidth>
                {submitError}
              </CallOut>
            )}
            <Field name="domain">
              {({ input, meta }) => (
                <FormField>
                  <Localized id="configure-moderation-emailDomains-form-domainLabel">
                    <Label>Domain</Label>
                  </Localized>
                  <TextField
                    {...input}
                    placeholder="ex. email.com"
                    color={colorFromMeta(meta)}
                    fullWidth
                  />
                  <ValidationMessage meta={meta} fullWidth />
                </FormField>
              )}
            </Field>
            <>
              <Label>Moderation action</Label>
              <Field name="newUserModeration" type="radio" value="BANNED">
                {({ input }) => (
                  <RadioButton {...input} id={`${input.name}-BANNED`}>
                    <Localized id="configure-moderation-emailDomains-form-banAllUsers">
                      <span>Ban all users</span>
                    </Localized>
                  </RadioButton>
                )}
              </Field>
              <Field
                name="newUserModeration"
                type="radio"
                value="ALWAYS_PREMOD"
              >
                {({ input }) => (
                  <RadioButton {...input} id={`${input.name}-ALWAYS_PREMOD`}>
                    <Localized id="configure-moderation-emailDomains-form-alwaysPremod">
                      <span>Always pre-moderate comments</span>
                    </Localized>
                  </RadioButton>
                )}
              </Field>
            </>
            <Flex itemGutter justifyContent="flex-end">
              <Localized id="configure-moderation-emailDomains-form-cancel">
                <Button
                  variant="outlined"
                  size="large"
                  color="mono"
                  to="/admin/configure/moderation"
                >
                  Cancel
                </Button>
              </Localized>
              <Localized
                id="configure-moderation-emailDomains-form-editDomain"
                icon={<ButtonIcon>edit</ButtonIcon>}
              >
                <Button
                  disabled={submitting}
                  iconLeft
                  type="submit"
                  size="large"
                >
                  Edit domain
                </Button>
              </Localized>
            </Flex>
          </HorizontalGutter>
        </form>
      )}
    </Form>
  );
};

const enhanced = withRouter(
  withFragmentContainer<Props>({
    emailDomain: graphql`
      fragment ConfigureEmailDomainForm_emailDomain on EmailDomain {
        domain
        id
        newUserModeration
      }
    `,
  })(ConfigureEmailDomainForm)
);

export default enhanced;
