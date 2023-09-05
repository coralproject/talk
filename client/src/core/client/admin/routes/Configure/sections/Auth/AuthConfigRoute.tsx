import React from "react";
import { graphql } from "react-relay";

import { withRouteConfig } from "coral-framework/lib/router";
import { Delay, Spinner } from "coral-ui/components/v2";

import { AuthConfigRouteContainerQueryResponse } from "coral-admin/__generated__/AuthConfigRouteContainerQuery.graphql";

import AuthConfigContainer from "./AuthConfigContainer";

interface Props {
  data: AuthConfigRouteContainerQueryResponse | null;
  submitting?: boolean;
}

class AuthConfigRoute extends React.Component<Props> {
  public render() {
    if (!this.props.data) {
      return (
        <Delay>
          <Spinner />
        </Delay>
      );
    }
    return (
      <AuthConfigContainer
        settings={this.props.data.settings}
        auth={this.props.data.settings.auth}
        submitting={this.props.submitting}
      />
    );
  }
}

const enhanced = withRouteConfig<Props>({
  query: graphql`
    query AuthConfigRouteContainerQuery {
      settings {
        ...AuthConfigContainer_settings
        auth {
          ...AuthConfigContainer_auth
        }
      }
    }
  `,
  cacheConfig: { force: true },
})(AuthConfigRoute);

export default enhanced;
