import { Localized } from "@fluent/react/compat";
import { FORM_ERROR } from "final-form";
import { useRouter } from "found";
import React, { FunctionComponent, useCallback } from "react";
import { Field, Form } from "react-final-form";
import { graphql, useFragment } from "react-relay";

import getEndpointLink from "coral-admin/helpers/getEndpointLink";
import { InvalidRequestError } from "coral-framework/lib/errors";
import { colorFromMeta, ValidationMessage } from "coral-framework/lib/form";
import { useMutation } from "coral-framework/lib/relay";
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
  HorizontalGutter,
  Label,
  TextField,
} from "coral-ui/components/v2";

import { ConfigureWebhookEndpointForm_settings$key as ConfigureWebhookEndpointForm_settings } from "coral-admin/__generated__/ConfigureWebhookEndpointForm_settings.graphql";
import { ConfigureWebhookEndpointForm_webhookEndpoint$key as ConfigureWebhookEndpointForm_webhookEndpoint } from "coral-admin/__generated__/ConfigureWebhookEndpointForm_webhookEndpoint.graphql";

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
  const settingsData = useFragment(
    graphql`
      fragment ConfigureWebhookEndpointForm_settings on Settings {
        ...EventsSelectField_settings
      }
    `,
    settings
  );
  const webhookEndpointData = useFragment(
    graphql`
      fragment ConfigureWebhookEndpointForm_webhookEndpoint on WebhookEndpoint {
        id
        url
        events
        all
      }
    `,
    webhookEndpoint
  );

  const create = useMutation(CreateWebhookEndpointMutation);
  const update = useMutation(UpdateWebhookEndpointMutation);
  const { router } = useRouter();
  const onSubmit = useCallback(
    async (values) => {
      try {
        if (webhookEndpointData) {
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
      } catch (err) {
        if (err instanceof InvalidRequestError) {
          return err.invalidArgs;
        }
        return { [FORM_ERROR]: err.message };
      }
    },
    [webhookEndpointData, create, update, router]
  );

  return (
    <Form
      onSubmit={onSubmit}
      initialValues={
        webhookEndpointData
          ? webhookEndpointData
          : { events: [], all: false, url: "" }
      }
    >
      {({ handleSubmit, submitting, submitError, pristine }) => (
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
            <EventsSelectField settings={settingsData} />
            <Flex direction="row" justifyContent="flex-end" itemGutter>
              {onCancel && (
                <Localized id="configure-webhooks-cancelButton">
                  <Button type="button" color="mono" onClick={onCancel}>
                    Cancel
                  </Button>
                </Localized>
              )}
              {webhookEndpointData ? (
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

export default ConfigureWebhookEndpointForm;
