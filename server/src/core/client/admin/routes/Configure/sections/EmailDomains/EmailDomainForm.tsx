import { Localized } from "@fluent/react/compat";
import { FORM_ERROR } from "final-form";
import { useRouter } from "found";
import React, { FunctionComponent, useCallback } from "react";
import { Field, Form } from "react-final-form";

import { urls } from "coral-framework/helpers";
import { colorFromMeta, ValidationMessage } from "coral-framework/lib/form";
import { useMutation } from "coral-framework/lib/relay";
import {
  composeValidators,
  required,
  validateEmailDomain,
} from "coral-framework/lib/validation";
import {
  Button,
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
import UpdateEmailDomainMutation from "./UpdateEmailDomainMutation";

enum NEW_USER_MODERATION {
  BAN = "BAN",
  PREMOD = "PREMOD",
}

interface Props {
  emailDomain?: {
    readonly domain: string;
    readonly id: string;
    readonly newUserModeration: "BAN" | "PREMOD" | "%future added value";
  };
}

const EmailDomainForm: FunctionComponent<Props> = ({ emailDomain }) => {
  const create = useMutation(CreateEmailDomainMutation);
  const update = useMutation(UpdateEmailDomainMutation);
  const { router } = useRouter();
  const onSubmit = useCallback(
    async (input: {
      domain: string | null;
      newUserModeration: "BAN" | "PREMOD" | "%future added value";
    }) => {
      try {
        if (emailDomain) {
          await update({
            domain: input.domain!,
            newUserModeration: input.newUserModeration,
            id: emailDomain.id,
          });
        } else {
          await create({
            domain: input.domain!,
            newUserModeration: input.newUserModeration,
          });
        }
        router.push(urls.admin.configureModeration + "#emailDomain");
      } catch (error) {
        return { [FORM_ERROR]: error.message };
      }
      return;
    },
    []
  );

  return (
    <Form
      onSubmit={onSubmit}
      initialValues={{
        domain: emailDomain?.domain || null,
        newUserModeration:
          emailDomain?.newUserModeration || NEW_USER_MODERATION.BAN,
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
            {emailDomain ? (
              <Localized id="configure-moderation-emailDomains-form-description-edit">
                <FormFieldDescription>
                  Update the domain or action that should be taken when on every
                  new account using the specified domain.
                </FormFieldDescription>
              </Localized>
            ) : (
              <Localized id="configure-moderation-emailDomains-form-description-add">
                <FormFieldDescription>
                  Add a domain and select the action that should be taken when
                  on every new account created using the specified domain.
                </FormFieldDescription>
              </Localized>
            )}
            <Field
              name="domain"
              validate={composeValidators(required, validateEmailDomain)}
            >
              {({ input, meta }) => (
                <FormField>
                  <Localized id="configure-moderation-emailDomains-form-label-domain">
                    <Label>Domain</Label>
                  </Localized>
                  <TextField
                    {...input}
                    placeholder="ex. email.com"
                    color={colorFromMeta(meta)}
                    fullWidth
                    data-testid="configure-moderation-emailDomains-domainTextField"
                  />
                  <ValidationMessage meta={meta} fullWidth />
                </FormField>
              )}
            </Field>
            <>
              <Localized id="configure-moderation-emailDomains-form-label-moderationAction">
                <Label>Moderation action</Label>
              </Localized>
              <Field
                name="newUserModeration"
                type="radio"
                value={NEW_USER_MODERATION.PREMOD}
              >
                {({ input }) => (
                  <RadioButton
                    {...input}
                    id={`${input.name}-${NEW_USER_MODERATION.PREMOD}`}
                  >
                    <Localized id="configure-moderation-emailDomains-alwaysPremod">
                      <span>Always pre-moderate comments</span>
                    </Localized>
                  </RadioButton>
                )}
              </Field>
              <Field
                name="newUserModeration"
                type="radio"
                value={NEW_USER_MODERATION.BAN}
              >
                {({ input }) => (
                  <RadioButton
                    {...input}
                    id={`${input.name}-${NEW_USER_MODERATION.BAN}`}
                  >
                    <Localized id="configure-moderation-emailDomains-banAllUsers">
                      <span>Ban all users</span>
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
                  to={`${urls.admin.configureModeration}#emailDomain`}
                >
                  Cancel
                </Button>
              </Localized>
              {emailDomain ? (
                <Localized id="configure-moderation-emailDomains-form-editDomain">
                  <Button disabled={submitting} type="submit" size="large">
                    Update
                  </Button>
                </Localized>
              ) : (
                <Localized id="configure-moderation-emailDomains-form-addDomain">
                  <Button disabled={submitting} type="submit" size="large">
                    Add domain
                  </Button>
                </Localized>
              )}
            </Flex>
          </HorizontalGutter>
        </form>
      )}
    </Form>
  );
};

export default EmailDomainForm;
