import { Localized } from "@fluent/react/compat";
import React, { FunctionComponent } from "react";
import { graphql, useFragment } from "react-relay";

import Subheader from "coral-admin/routes/Configure/Subheader";

import { EndpointDetails_settings$key as EndpointDetails_settings } from "coral-admin/__generated__/EndpointDetails_settings.graphql";
import { EndpointDetails_webhookEndpoint$key as EndpointDetails_webhookEndpoint } from "coral-admin/__generated__/EndpointDetails_webhookEndpoint.graphql";

import ConfigureWebhookEndpointForm from "../ConfigureWebhookEndpointForm";

interface Props {
  webhookEndpoint: EndpointDetails_webhookEndpoint;
  settings: EndpointDetails_settings;
}

const EndpointDetails: FunctionComponent<Props> = ({
  webhookEndpoint,
  settings,
}) => {
  const webhookEndpointData = useFragment(
    graphql`
      fragment EndpointDetails_webhookEndpoint on WebhookEndpoint {
        ...ConfigureWebhookEndpointForm_webhookEndpoint
      }
    `,
    webhookEndpoint
  );

  const settingsData = useFragment(
    graphql`
      fragment EndpointDetails_settings on Settings {
        ...ConfigureWebhookEndpointForm_settings
      }
    `,
    settings
  );

  return (
    <>
      <Localized id="configure-webhooks-endpointDetails">
        <Subheader>Endpoint details</Subheader>
      </Localized>
      <ConfigureWebhookEndpointForm
        settings={settingsData}
        webhookEndpoint={webhookEndpointData}
      />
    </>
  );
};

export default EndpointDetails;
