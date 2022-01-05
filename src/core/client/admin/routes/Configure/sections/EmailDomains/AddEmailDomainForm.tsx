import { Localized } from "@fluent/react/compat";
import { Match, Router, withRouter } from "found";
import React, { FunctionComponent, useCallback } from "react";
import { Field, Form } from "react-final-form";

import { urls } from "coral-framework/helpers";
import { colorFromMeta, ValidationMessage } from "coral-framework/lib/form";
import { useMutation } from "coral-framework/lib/relay";
import {
  Button,
  ButtonIcon,
  CallOut,
  Flex,
  FormField,
  FormFieldDescription,
  HorizontalGutter,
  Label,
  RadioButton,
  TextField,
} from "coral-ui/components/v2";

import CreateEmailDomainMutation from "./CreateEmailDomainMutation";

interface Props {
  router: Router;
  match: Match;
}

const AddEmailDomainForm: FunctionComponent<Props> = ({ router }) => {
  const create = useMutation(CreateEmailDomainMutation);
  const onSubmit = useCallback(async (input) => {
    try {
      await create({
        domain: input.domain,
        newUserModeration: input.newUserModeration,
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
        newUserModeration: "BANNED",
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
            <Localized id="configure-moderation-emailDomains-form-description-add">
              <FormFieldDescription>
                Add a domain and select the action that should be taken when on
                every new account created using the specified domain.
              </FormFieldDescription>
            </Localized>
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
                      <span>Ban all new commenter accounts</span>
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
                id="configure-moderation-emailDomains-form-addDomain"
                icon={<ButtonIcon>add</ButtonIcon>}
              >
                <Button
                  disabled={submitting}
                  iconLeft
                  type="submit"
                  size="large"
                >
                  Add domain
                </Button>
              </Localized>
            </Flex>
          </HorizontalGutter>
        </form>
      )}
    </Form>
  );
};

const enhanced = withRouter(AddEmailDomainForm);

export default enhanced;
