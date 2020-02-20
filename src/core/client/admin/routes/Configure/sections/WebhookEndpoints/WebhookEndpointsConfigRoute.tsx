import React, { FunctionComponent } from "react";
import { graphql } from "react-relay";

import { withRouteConfig } from "coral-framework/lib/router";
import { Delay, Spinner } from "coral-ui/components/v2";

import { WebhookEndpointsConfigRouteQueryResponse } from "coral-admin/__generated__/WebhookEndpointsConfigRouteQuery.graphql";

import WebhookEndpointsConfigContainer from "./WebhookEndpointsConfigContainer";

interface Props {
  data: WebhookEndpointsConfigRouteQueryResponse | null;
}

const WebhookEndpointsConfigRoute: FunctionComponent<Props> = ({ data }) => {
  if (!data) {
    return (
      <Delay>
        <Spinner />
      </Delay>
    );
  }

  return <WebhookEndpointsConfigContainer settings={data.settings} />;
};

const enhanced = withRouteConfig<Props>({
  query: graphql`
    query WebhookEndpointsConfigRouteQuery {
      settings {
        ...WebhookEndpointsConfigContainer_settings
      }
    }
  `,
})(WebhookEndpointsConfigRoute);

export default enhanced;
