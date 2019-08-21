import { FormApi } from "final-form";
import React from "react";
import { graphql } from "react-relay";

import { AuthConfigRouteContainerQueryResponse } from "coral-admin/__generated__/AuthConfigRouteContainerQuery.graphql";
import { withRouteConfig } from "coral-framework/lib/router";
import { Delay, Spinner } from "coral-ui/components";

import AccountFeaturesConfigContainer from "./AccountFeaturesConfigContainer";
import AuthConfigContainer from "./AuthConfigContainer";

interface Props {
  data: AuthConfigRouteContainerQueryResponse | null;
  form: FormApi;
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
      <div>
        <AuthConfigContainer
          settings={this.props.data.settings}
          auth={this.props.data.settings.auth}
          form={this.props.form}
          submitting={this.props.submitting}
        />
      </div>
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
