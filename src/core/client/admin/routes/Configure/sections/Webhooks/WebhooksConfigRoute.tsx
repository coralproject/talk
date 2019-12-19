import React, { FunctionComponent } from "react";
import { graphql } from "react-relay";

import { withRouteConfig } from "coral-framework/lib/router";
import { Delay, Spinner } from "coral-ui/components/v2";

import { WebhooksConfigRouteQueryResponse } from "coral-admin/__generated__/WebhooksConfigRouteQuery.graphql";

import WebhooksConfigContainer from "./WebhooksConfigContainer";

interface Props {
  data: WebhooksConfigRouteQueryResponse | null;
}

const WebhooksConfigRoute: FunctionComponent<Props> = ({ data }) => {
  if (!data) {
    return (
      <Delay>
        <Spinner />
      </Delay>
    );
  }

  return <WebhooksConfigContainer settings={data.settings} />;
};

const enhanced = withRouteConfig<Props>({
  query: graphql`
    query WebhooksConfigRouteQuery {
      settings {
        ...WebhooksConfigContainer_settings
      }
    }
  `,
})(WebhooksConfigRoute);

export default enhanced;
