import { Localized } from "@fluent/react/compat";
import { FORM_ERROR } from "final-form";
import { useRouter } from "found";
import React, { FunctionComponent, useCallback } from "react";
import { Field, Form } from "react-final-form";
import { graphql } from "react-relay";

import getEndpointLink from "coral-admin/helpers/getEndpointLink";
import { InvalidRequestError } from "coral-framework/lib/errors";
import {
  colorFromMeta,
  parseIntegerNullable,
  ValidationMessage,
} from "coral-framework/lib/form";
import { useMutation, withFragmentContainer } from "coral-framework/lib/relay";
import {
  composeValidators,
  required,
  validateURL,
} from "coral-framework/lib/validation";
import {
  Button,
  CallOut,
  Flex,
  FormField,
  HelperText,
  HorizontalGutter,
  Label,
  TextField,
} from "coral-ui/components/v2";

import { ConfigureWebhookEndpointForm_settings } from "coral-admin/__generated__/ConfigureWebhookEndpointForm_settings.graphql";
import { ConfigureWebhookEndpointForm_webhookEndpoint } from "coral-admin/__generated__/ConfigureWebhookEndpointForm_webhookEndpoint.graphql";

import { GQLWEBHOOK_EVENT_NAME } from "coral-framework/schema";
import CreateWebhookEndpointMutation from "./CreateWebhookEndpointMutation";
import EventsSelectField from "./EventsSelectField";
import UpdateWebhookEndpointMutation from "./UpdateWebhookEndpointMutation";

interface Props {
  onCancel?: () => void;
  webhookEndpoint: ConfigureWebhookEndpointForm_webhookEndpoint | null;
  settings: ConfigureWebhookEndpointForm_settings;
}

const ConfigureWebhookEndpointForm: FunctionComponent<Props> = ({
  onCancel,
  settings,
  webhookEndpoint,
}) => {
  const create = useMutation(CreateWebhookEndpointMutation);
  const update = useMutation(UpdateWebhookEndpointMutation);
  const { router } = useRouter();

  const onSubmit = useCallback(
    async (values: {
      id: string;
      url: string;
      all: boolean;
      events: any;
      reportingThreshold?: number | null;
    }) => {
      try {
        if (webhookEndpoint) {
          // The webhook endpoint was defined, update it.
          await update(values);
        } else {
          // The webhook endpoint wasn't defined, created it.
          const result = await create(values);

          // Redirect the user to the new webhook endpoint page.
          router.push(getEndpointLink(result.endpoint.id));

          // We don't need to close this modal because we are navigating...
        }

        return;
      } catch (err: unknown) {
        if (err instanceof InvalidRequestError) {
          return err.invalidArgs;
        }
        return {
          [FORM_ERROR]:
            err instanceof Error ? err.message : "An unknown error occurred",
        };
      }
    },
    [webhookEndpoint, create, update, router]
  );

  return (
    <Form
      onSubmit={onSubmit}
      initialValues={
        webhookEndpoint
          ? webhookEndpoint
          : { events: [], all: false, url: "", reportingThreshold: null }
      }
    >
      {({ handleSubmit, submitting, submitError, pristine, values }) => (
        <form autoComplete="off" onSubmit={handleSubmit}>
          <HorizontalGutter size="double">
            {submitError && (
              <CallOut color="error" fullWidth>
                {submitError}
              </CallOut>
            )}
            <Field
              name="url"
              validate={composeValidators(required, validateURL)}
            >
              {({ input, meta }) => (
                <FormField>
                  <Localized id="configure-webhooks-endpointURL">
                    <Label>Endpoint URL</Label>
                  </Localized>
                  <TextField
                    {...input}
                    placeholder="https://"
                    color={colorFromMeta(meta)}
                    fullWidth
                  />
                  <ValidationMessage meta={meta} fullWidth />
                </FormField>
              )}
            </Field>
            <EventsSelectField settings={settings} />
            {values.all ||
              (values.events?.includes(
                GQLWEBHOOK_EVENT_NAME.COMMENT_REPORTED_THRESHOLD_REACHED
              ) && (
                <FormField>
                  <Localized id="configure-webhooks-reportingThreshold">
                    <Label>Reporting threshold</Label>
                  </Localized>
                  <HelperText>
                    Number of reports before event triggered
                  </HelperText>
                  <Field
                    name="reportingThreshold"
                    validate={required}
                    parse={parseIntegerNullable}
                  >
                    {({ input, meta }) => (
                      <>
                        <TextField
                          {...input}
                          id={input.name}
                          type="number"
                          fullWidth
                          color={colorFromMeta(meta)}
                        />
                        <ValidationMessage meta={meta} fullWidth />
                      </>
                    )}
                  </Field>
                </FormField>
              ))}
            <Flex direction="row" justifyContent="flex-end" itemGutter>
              {onCancel && (
                <Localized id="configure-webhooks-cancelButton">
                  <Button type="button" color="mono" onClick={onCancel}>
                    Cancel
                  </Button>
                </Localized>
              )}
              {webhookEndpoint ? (
                <Localized id="configure-webhooks-updateWebhookEndpointButton">
                  <Button type="submit" disabled={submitting || pristine}>
                    Update details
                  </Button>
                </Localized>
              ) : (
                <Localized id="configure-webhooks-addEndpointButton">
                  <Button type="submit" disabled={submitting}>
                    Add webhook endpoint
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

const enhanced = withFragmentContainer<Props>({
  webhookEndpoint: graphql`
    fragment ConfigureWebhookEndpointForm_webhookEndpoint on WebhookEndpoint {
      id
      url
      events
      all
      reportingThreshold
    }
  `,
  settings: graphql`
    fragment ConfigureWebhookEndpointForm_settings on Settings {
      ...EventsSelectField_settings
    }
  `,
})(ConfigureWebhookEndpointForm);

export default enhanced;
