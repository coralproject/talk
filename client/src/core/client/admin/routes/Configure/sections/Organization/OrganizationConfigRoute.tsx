import React from "react";
import { graphql } from "react-relay";

import { withRouteConfig } from "coral-framework/lib/router";
import { Delay, HorizontalGutter, Spinner } from "coral-ui/components/v2";

import { OrganizationConfigRouteQueryResponse } from "coral-admin/__generated__/OrganizationConfigRouteQuery.graphql";

import OrganizationConfigContainer from "./OrganizationConfigContainer";
import SitesConfigContainer from "./SitesConfigContainer";

interface Props {
  data: OrganizationConfigRouteQueryResponse | null;
  submitting: boolean;
}

class OrganizationConfigRoute extends React.Component<Props> {
  public render() {
    if (!this.props.data) {
      return (
        <Delay>
          <Spinner />
        </Delay>
      );
    }
    return (
      <HorizontalGutter
        spacing={4}
        data-testid="configure-organizationContainer"
      >
        <OrganizationConfigContainer
          settings={this.props.data.settings}
          submitting={this.props.submitting}
        />
        <SitesConfigContainer query={this.props.data} />
      </HorizontalGutter>
    );
  }
}

const enhanced = withRouteConfig<Props>({
  query: graphql`
    query OrganizationConfigRouteQuery {
      settings {
        ...OrganizationConfigContainer_settings
      }
      ...SitesConfigContainer_query
    }
  `,
  cacheConfig: { force: true },
})(OrganizationConfigRoute);

export default enhanced;
