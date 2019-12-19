import React, { FunctionComponent, useCallback, useState } from "react";

import Subheader from "coral-admin/routes/Configure/Subheader";
import { ExternalLink } from "coral-framework/lib/i18n/components";
import { graphql, withFragmentContainer } from "coral-framework/lib/relay";
import { Typography } from "coral-ui/components";
import {
  Button,
  Flex,
  FormField,
  FormFieldDescription,
  HelperText,
  HorizontalGutter,
  Label,
  ListGroup,
  ListGroupRow,
  Marker,
} from "coral-ui/components/v2";

import { EndpointDetails_settings } from "coral-admin/__generated__/EndpointDetails_settings.graphql";
import { EndpointDetails_webhookEndpoint } from "coral-admin/__generated__/EndpointDetails_webhookEndpoint.graphql";

import ConfigureWebhookEndpointModal from "../ConfigureWebhookEndpointModal";

import styles from "./EndpointDetails.css";

interface Props {
  webhookEndpoint: EndpointDetails_webhookEndpoint;
  settings: EndpointDetails_settings;
}

const EndpointDetails: FunctionComponent<Props> = ({
  webhookEndpoint,
  settings,
}) => {
  const [open, setOpen] = useState(false);

  const show = useCallback(() => setOpen(true), []);
  const hide = useCallback(() => setOpen(false), []);

  return (
    <>
      <Subheader>Endpoint details</Subheader>
      <FormField>
        <Label>URL</Label>
        <Typography className={styles.url}>{webhookEndpoint.url}</Typography>
      </FormField>
      <FormField>
        <Label>Events</Label>
        <FormFieldDescription>
          These are the events that are registered to this particular endpoint.
          Visit{" "}
          <ExternalLink href="https://docs.coralproject.net/coral/v5/integrating/webhooks/#events">
            our docs
          </ExternalLink>{" "}
          for the schema of these events. Any event matching the following will
          be sent to the endpoint if it is enabled:
        </FormFieldDescription>
        {webhookEndpoint.all ? (
          <HorizontalGutter>
            <Marker className={styles.warning}>All events</Marker>
            <HelperText>
              All events that are currently available and any future event added
              will be sent to this URL.
            </HelperText>
          </HorizontalGutter>
        ) : (
          <ListGroup className={styles.events}>
            {webhookEndpoint.events.map((event, idx) => (
              <ListGroupRow key={idx}>
                <Typography className={styles.event}>{event}</Typography>
              </ListGroupRow>
            ))}
          </ListGroup>
        )}
      </FormField>
      <Flex justifyContent="flex-end">
        <Button onClick={show}>Update details</Button>
      </Flex>
      <ConfigureWebhookEndpointModal
        open={open}
        onHide={hide}
        settings={settings}
        webhookEndpoint={webhookEndpoint}
      />
    </>
  );
};

const enhanced = withFragmentContainer<Props>({
  webhookEndpoint: graphql`
    fragment EndpointDetails_webhookEndpoint on WebhookEndpoint {
      id
      url
      all
      events
      ...ConfigureWebhookEndpointModal_webhookEndpoint
    }
  `,
  settings: graphql`
    fragment EndpointDetails_settings on Settings {
      ...ConfigureWebhookEndpointModal_settings
    }
  `,
})(EndpointDetails);

export default enhanced;
