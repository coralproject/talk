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
import { Typography } from "coral-ui/components";
import {
  Button,
  CallOut,
  Card,
  CardCloseButton,
  Flex,
  FormField,
  HorizontalGutter,
  Label,
  Modal,
  TextField,
} from "coral-ui/components/v2";

import { ConfigureWebhookEndpointModal_settings } from "coral-admin/__generated__/ConfigureWebhookEndpointModal_settings.graphql";
import { ConfigureWebhookEndpointModal_webhookEndpoint } from "coral-admin/__generated__/ConfigureWebhookEndpointModal_webhookEndpoint.graphql";

import CreateWebhookEndpointMutation from "./CreateWebhookEndpointMutation";
import EventsSelectField from "./EventsSelectField";
import UpdateWebhookEndpointMutation from "./UpdateWebhookEndpointMutation";

import styles from "./ConfigureWebhookEndpointModal.css";

interface Props {
  onHide: () => void;
  open: boolean;
  router: Router;
  match: Match;
  webhookEndpoint: ConfigureWebhookEndpointModal_webhookEndpoint | null;
  settings: ConfigureWebhookEndpointModal_settings;
}

const ConfigureWebhookEndpointModal: FunctionComponent<Props> = ({
  open,
  onHide,
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

          // We need to close the modal now.
          onHide();
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
    <Modal open={open}>
      {({ firstFocusableRef, lastFocusableRef }) => (
        <Card className={styles.root}>
          <Flex justifyContent="flex-end">
            <CardCloseButton onClick={onHide} ref={firstFocusableRef} />
          </Flex>
          <Form
            onSubmit={onSubmit}
            initialValues={
              webhookEndpoint
                ? webhookEndpoint
                : { events: [], all: false, url: "" }
            }
          >
            {({ handleSubmit, submitting, submitError }) => (
              <form autoComplete="off" onSubmit={handleSubmit}>
                <HorizontalGutter size="double">
                  {webhookEndpoint ? (
                    <Typography variant="header2">
                      Edit webhook endpoint
                    </Typography>
                  ) : (
                    <Typography variant="header2">
                      Add a webhook endpoint
                    </Typography>
                  )}
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
                  <Flex direction="row" justifyContent="flex-end">
                    <Button
                      type="submit"
                      disabled={submitting}
                      ref={lastFocusableRef}
                    >
                      {webhookEndpoint ? "Edit endpoint" : "Add endpoint"}
                    </Button>
                  </Flex>
                </HorizontalGutter>
              </form>
            )}
          </Form>
        </Card>
      )}
    </Modal>
  );
};

const enhanced = withRouter(
  withFragmentContainer<Props>({
    webhookEndpoint: graphql`
      fragment ConfigureWebhookEndpointModal_webhookEndpoint on WebhookEndpoint {
        id
        url
        events
        all
      }
    `,
    settings: graphql`
      fragment ConfigureWebhookEndpointModal_settings on Settings {
        ...EventsSelectField_settings
      }
    `,
  })(ConfigureWebhookEndpointModal)
);

export default enhanced;
