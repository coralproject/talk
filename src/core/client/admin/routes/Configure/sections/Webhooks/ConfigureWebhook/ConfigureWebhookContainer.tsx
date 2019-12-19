import { Localized } from "@fluent/react/compat";
import React, { FunctionComponent } from "react";

import ConfigBox from "coral-admin/routes/Configure/ConfigBox";
import Header from "coral-admin/routes/Configure/Header";
import { graphql, withFragmentContainer } from "coral-framework/lib/relay";
import { HorizontalGutter } from "coral-ui/components/v2";

import { ConfigureWebhookContainer_settings } from "coral-admin/__generated__/ConfigureWebhookContainer_settings.graphql";
import { ConfigureWebhookContainer_webhookEndpoint } from "coral-admin/__generated__/ConfigureWebhookContainer_webhookEndpoint.graphql";

import EndpointDangerZone from "./EndpointDangerZone";
import EndpointDetails from "./EndpointDetails";
import EndpointStatus from "./EndpointStatus";

interface Props {
  webhookEndpoint: ConfigureWebhookContainer_webhookEndpoint;
  settings: ConfigureWebhookContainer_settings;
}

const ConfigureWebhookContainer: FunctionComponent<Props> = ({
  webhookEndpoint,
  settings,
}) => {
  return (
    <HorizontalGutter size="double">
      <ConfigBox
        title={
          <Localized id="configure-webhooks-header-title">
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
    fragment ConfigureWebhookContainer_webhookEndpoint on WebhookEndpoint {
      ...EndpointDangerZone_webhookEndpoint
      ...EndpointDetails_webhookEndpoint
      ...EndpointStatus_webhookEndpoint
    }
  `,
  settings: graphql`
    fragment ConfigureWebhookContainer_settings on Settings {
      ...EndpointDetails_settings
    }
  `,
})(ConfigureWebhookContainer);

export default enhanced;
