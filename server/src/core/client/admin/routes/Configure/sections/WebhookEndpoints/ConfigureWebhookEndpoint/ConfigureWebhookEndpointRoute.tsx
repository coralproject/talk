import { Localized } from "@fluent/react/compat";
import React, { FunctionComponent } from "react";
import { graphql } from "react-relay";

import { withRouteConfig } from "coral-framework/lib/router";
import { CallOut, Delay, Spinner } from "coral-ui/components/v2";

import { ConfigureWebhookEndpointRouteQueryResponse } from "coral-admin/__generated__/ConfigureWebhookEndpointRouteQuery.graphql";

import ConfigureWebhookContainer from "./ConfigureWebhookEndpointContainer";

interface Props {
  data: ConfigureWebhookEndpointRouteQueryResponse | null;
}

const ConfigureWebhookEndpointRoute: FunctionComponent<Props> = ({ data }) => {
  if (!data) {
    return (
      <Delay>
        <Spinner />
      </Delay>
    );
  }

  if (!data.webhookEndpoint) {
    return (
      <Localized id="configure-webhooks-webhookEndpointNotFound">
        <CallOut color="error" fullWidth>
          Webhook endpoint not found
        </CallOut>
      </Localized>
    );
  }

  return (
    <ConfigureWebhookContainer
      webhookEndpoint={data.webhookEndpoint}
      settings={data.settings}
    />
  );
};

const enhanced = withRouteConfig<Props>({
  query: graphql`
    query ConfigureWebhookEndpointRouteQuery($webhookEndpointID: ID!) {
      webhookEndpoint(id: $webhookEndpointID) {
        ...ConfigureWebhookEndpointContainer_webhookEndpoint
      }
      settings {
        ...ConfigureWebhookEndpointContainer_settings
      }
    }
  `,
  cacheConfig: { force: true },
  prepareVariables: (params, match) => {
    return {
      webhookEndpointID: match.params.webhookEndpointID,
    };
  },
})(ConfigureWebhookEndpointRoute);

export default enhanced;
