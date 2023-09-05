import React, { FunctionComponent } from "react";
import { graphql } from "react-relay";

import { withRouteConfig } from "coral-framework/lib/router";
import { Delay, Spinner } from "coral-ui/components/v2";

import { AddWebhookEndpointRouteQueryResponse } from "coral-admin/__generated__/AddWebhookEndpointRouteQuery.graphql";

import AddWebhookEndpointContainer from "./AddWebhookEndpointContainer";

interface Props {
  data: AddWebhookEndpointRouteQueryResponse | null;
}

const AddWebhookEndpointRoute: FunctionComponent<Props> = ({ data }) => {
  if (!data) {
    return (
      <Delay>
        <Spinner />
      </Delay>
    );
  }

  return <AddWebhookEndpointContainer settings={data.settings} />;
};

const enhanced = withRouteConfig<Props>({
  query: graphql`
    query AddWebhookEndpointRouteQuery {
      settings {
        ...AddWebhookEndpointContainer_settings
      }
    }
  `,
  cacheConfig: { force: true },
})(AddWebhookEndpointRoute);

export default enhanced;
