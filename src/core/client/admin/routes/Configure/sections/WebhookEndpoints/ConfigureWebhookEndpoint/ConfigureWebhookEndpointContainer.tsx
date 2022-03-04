import { Localized } from "@fluent/react/compat";
import React, { FunctionComponent } from "react";
import { graphql, useFragment } from "react-relay";

import ConfigBox from "coral-admin/routes/Configure/ConfigBox";
import Header from "coral-admin/routes/Configure/Header";
import { HorizontalGutter } from "coral-ui/components/v2";

import { ConfigureWebhookEndpointContainer_settings$key as ConfigureWebhookEndpointContainer_settings } from "coral-admin/__generated__/ConfigureWebhookEndpointContainer_settings.graphql";
import { ConfigureWebhookEndpointContainer_webhookEndpoint$key as ConfigureWebhookEndpointContainer_webhookEndpoint } from "coral-admin/__generated__/ConfigureWebhookEndpointContainer_webhookEndpoint.graphql";

import ExperimentalWebhooksCallOut from "../ExperimentalWebhooksCallOut";
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
  const settingsData = useFragment(
    graphql`
      fragment ConfigureWebhookEndpointContainer_settings on Settings {
        ...EndpointDetails_settings
      }
    `,
    settings
  );
  const webhookEndpointData = useFragment(
    graphql`
      fragment ConfigureWebhookEndpointContainer_webhookEndpoint on WebhookEndpoint {
        ...EndpointDangerZone_webhookEndpoint
        ...EndpointDetails_webhookEndpoint
        ...EndpointStatus_webhookEndpoint
      }
    `,
    webhookEndpoint
  );

  return (
    <HorizontalGutter size="double" data-testid="webhook-endpoint-container">
      <ExperimentalWebhooksCallOut />
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
          webhookEndpoint={webhookEndpointData}
          settings={settingsData}
        />
        <EndpointStatus webhookEndpoint={webhookEndpointData} />
        <EndpointDangerZone webhookEndpoint={webhookEndpointData} />
      </ConfigBox>
    </HorizontalGutter>
  );
};

export default ConfigureWebhookEndpointContainer;
