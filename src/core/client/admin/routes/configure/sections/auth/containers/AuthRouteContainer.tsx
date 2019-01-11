import { FormApi } from "final-form";
import React from "react";
import { graphql } from "react-relay";

import { AuthRouteContainerQueryResponse } from "talk-admin/__generated__/AuthRouteContainerQuery.graphql";
import { withRouteConfig } from "talk-framework/lib/router";
import { Delay, Spinner } from "talk-ui/components";

import AuthContainer from ".//AuthContainer";

interface Props {
  data: AuthRouteContainerQueryResponse | null;
  form: FormApi;
  submitting?: boolean;
}

class AuthRouteContainer extends React.Component<Props> {
  public render() {
    if (!this.props.data) {
      return (
        <Delay>
          <Spinner />
        </Delay>
      );
    }
    return (
      <AuthContainer
        auth={this.props.data.settings.auth}
        form={this.props.form}
        submitting={this.props.submitting}
      />
    );
  }
}

const enhanced = withRouteConfig({
  query: graphql`
    query AuthRouteContainerQuery {
      settings {
        auth {
          ...AuthContainer_auth
        }
      }
    }
  `,
  cacheConfig: { force: true },
})(AuthRouteContainer);

export default enhanced;
