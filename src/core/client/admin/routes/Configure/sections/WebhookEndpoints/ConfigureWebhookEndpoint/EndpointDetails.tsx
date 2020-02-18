import React, { FunctionComponent } from "react";

import Subheader from "coral-admin/routes/Configure/Subheader";
import { graphql, withFragmentContainer } from "coral-framework/lib/relay";

import { EndpointDetails_settings } from "coral-admin/__generated__/EndpointDetails_settings.graphql";
import { EndpointDetails_webhookEndpoint } from "coral-admin/__generated__/EndpointDetails_webhookEndpoint.graphql";

import ConfigureWebhookEndpointForm from "../ConfigureWebhookEndpointForm";

interface Props {
  webhookEndpoint: EndpointDetails_webhookEndpoint;
  settings: EndpointDetails_settings;
}

const EndpointDetails: FunctionComponent<Props> = ({
  webhookEndpoint,
  settings,
}) => (
  <>
    <Subheader>Endpoint details</Subheader>
    <ConfigureWebhookEndpointForm
      settings={settings}
      webhookEndpoint={webhookEndpoint}
    />
  </>
);

const enhanced = withFragmentContainer<Props>({
  webhookEndpoint: graphql`
    fragment EndpointDetails_webhookEndpoint on WebhookEndpoint {
      ...ConfigureWebhookEndpointForm_webhookEndpoint
    }
  `,
  settings: graphql`
    fragment EndpointDetails_settings on Settings {
      ...ConfigureWebhookEndpointForm_settings
    }
  `,
})(EndpointDetails);

export default enhanced;
