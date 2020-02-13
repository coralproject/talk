import { Localized } from "@fluent/react/compat";
import React, { FunctionComponent } from "react";

import ConfigBox from "coral-admin/routes/Configure/ConfigBox";
import Header from "coral-admin/routes/Configure/Header";
import { graphql, withFragmentContainer } from "coral-framework/lib/relay";
import { HorizontalGutter } from "coral-ui/components/v2";

import { ConfigureWebhookEndpointContainer_settings } from "coral-admin/__generated__/ConfigureWebhookEndpointContainer_settings.graphql";
import { ConfigureWebhookEndpointContainer_webhookEndpoint } from "coral-admin/__generated__/ConfigureWebhookEndpointContainer_webhookEndpoint.graphql";

import EndpointDangerZone from "./EndpointDangerZone";
import EndpointDetails from "./EndpointDetails";
import EndpointStatus from "./EndpointStatus";

interface Props {
  webhookEndpoint: ConfigureWebhookEndpointContainer_webhookEndpoint;
  settings: ConfigureWebhookEndpointContainer_settings;
}

const ConfigureWebhookEndpointContainer: FunctionComponent<Props> = ({
  webhookEndpoint,
  settings,
}) => {
  return (
    <HorizontalGutter size="double" data-testid="webhook-endpoint-container">
      <ConfigBox
        title={
          <Localized id="configure-webhooks-configureWebhookEndpoint">
            <Header htmlFor="configure-webhooks-header.title">
              Configure webhook endpoint
            </Header>
          </Localized>
        }
      >
        <EndpointDetails
          webhookEndpoint={webhookEndpoint}
          settings={settings}
        />
        <EndpointStatus webhookEndpoint={webhookEndpoint} />
        <EndpointDangerZone webhookEndpoint={webhookEndpoint} />
      </ConfigBox>
    </HorizontalGutter>
  );
};

const enhanced = withFragmentContainer<Props>({
  webhookEndpoint: graphql`
    fragment ConfigureWebhookEndpointContainer_webhookEndpoint on WebhookEndpoint {
      ...EndpointDangerZone_webhookEndpoint
      ...EndpointDetails_webhookEndpoint
      ...EndpointStatus_webhookEndpoint
    }
  `,
  settings: graphql`
    fragment ConfigureWebhookEndpointContainer_settings on Settings {
      ...EndpointDetails_settings
    }
  `,
})(ConfigureWebhookEndpointContainer);

export default enhanced;
