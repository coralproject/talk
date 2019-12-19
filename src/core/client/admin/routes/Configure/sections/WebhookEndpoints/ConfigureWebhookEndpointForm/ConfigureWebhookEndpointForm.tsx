import { FORM_ERROR } from "final-form";
import { Match, Router, withRouter } from "found";
import React, { FunctionComponent, useCallback } from "react";
import { Field, Form } from "react-final-form";

import getEndpointLink from "coral-admin/helpers/getEndpointLink";
import { InvalidRequestError } from "coral-framework/lib/errors";
import { colorFromMeta, ValidationMessage } from "coral-framework/lib/form";
import {
  graphql,
  useMutation,
  withFragmentContainer,
} from "coral-framework/lib/relay";
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

import { ConfigureWebhookEndpointForm_settings } from "coral-admin/__generated__/ConfigureWebhookEndpointForm_settings.graphql";
import { ConfigureWebhookEndpointForm_webhookEndpoint } from "coral-admin/__generated__/ConfigureWebhookEndpointForm_webhookEndpoint.graphql";

import CreateWebhookEndpointMutation from "./CreateWebhookEndpointMutation";
import EventsSelectField from "./EventsSelectField";
import UpdateWebhookEndpointMutation from "./UpdateWebhookEndpointMutation";

interface Props {
  onCancel?: () => void;
  router: Router;
  match: Match;
  webhookEndpoint: ConfigureWebhookEndpointForm_webhookEndpoint | null;
  settings: ConfigureWebhookEndpointForm_settings;
}

const ConfigureWebhookEndpointForm: FunctionComponent<Props> = ({
  onCancel,
  settings,
  webhookEndpoint,
  router,
}) => {
  const create = useMutation(CreateWebhookEndpointMutation);
  const update = useMutation(UpdateWebhookEndpointMutation);
  const onSubmit = useCallback(
    async values => {
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
      } catch (err) {
        if (err instanceof InvalidRequestError) {
          return err.invalidArgs;
        }
        return { [FORM_ERROR]: err.message };
      }
    },
    [webhookEndpoint, create, update, router]
  );

  return (
    <Form
      onSubmit={onSubmit}
      initialValues={
        webhookEndpoint ? webhookEndpoint : { events: [], all: false, url: "" }
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
                  <Label>Endpoint URL</Label>
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
            <Flex direction="row" justifyContent="flex-end" itemGutter>
              {onCancel && (
                <Button type="button" color="mono" onClick={onCancel}>
                  Cancel
                </Button>
              )}
              <Button type="submit" disabled={submitting || pristine}>
                {webhookEndpoint ? "Update details" : "Add endpoint"}
              </Button>
            </Flex>
          </HorizontalGutter>
        </form>
      )}
    </Form>
  );
};

const enhanced = withRouter(
  withFragmentContainer<Props>({
    webhookEndpoint: graphql`
      fragment ConfigureWebhookEndpointForm_webhookEndpoint on WebhookEndpoint {
        id
        url
        events
        all
      }
    `,
    settings: graphql`
      fragment ConfigureWebhookEndpointForm_settings on Settings {
        ...EventsSelectField_settings
      }
    `,
  })(ConfigureWebhookEndpointForm)
);

export default enhanced;
