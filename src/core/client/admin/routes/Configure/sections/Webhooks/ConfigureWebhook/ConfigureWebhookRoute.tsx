import React, { FunctionComponent } from "react";
import { graphql } from "react-relay";

import { withRouteConfig } from "coral-framework/lib/router";
import { CallOut, Delay, Spinner } from "coral-ui/components/v2";

import { ConfigureWebhookRouteQueryResponse } from "coral-admin/__generated__/ConfigureWebhookRouteQuery.graphql";

import ConfigureWebhookContainer from "./ConfigureWebhookContainer";

interface Props {
  data: ConfigureWebhookRouteQueryResponse | null;
}

const ConfigureWebhookRoute: FunctionComponent<Props> = ({ data }) => {
  if (!data) {
    return (
      <Delay>
        <Spinner />
      </Delay>
    );
  }

  if (!data.webhookEndpoint) {
    return (
      <CallOut color="error" fullWidth>
        Webhook endpoint not found
      </CallOut>
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
    query ConfigureWebhookRouteQuery($webhookEndpointID: ID!) {
      webhookEndpoint(id: $webhookEndpointID) {
        ...ConfigureWebhookContainer_webhookEndpoint
      }
      settings {
        ...ConfigureWebhookContainer_settings
      }
    }
  `,
  cacheConfig: { force: true },
  prepareVariables: (params, match) => {
    return {
      webhookEndpointID: match.params.webhookEndpointID,
    };
  },
})(ConfigureWebhookRoute);

export default enhanced;
