import React from "react";
import { graphql } from "react-relay";

import { withRouteConfig } from "coral-framework/lib/router";
import { Delay, Spinner } from "coral-ui/components/v2";

import { EmailConfigRouteQueryResponse } from "coral-admin/__generated__/EmailConfigRouteQuery.graphql";

import EmailConfigContainer from "./EmailConfigContainer";

interface Props {
  data: EmailConfigRouteQueryResponse | null;
  submitting: boolean;
}

class EmailConfigRoute extends React.Component<Props> {
  public render() {
    if (!this.props.data) {
      return (
        <Delay>
          <Spinner />
        </Delay>
      );
    }
    return (
      <EmailConfigContainer
        email={this.props.data.settings.email}
        submitting={this.props.submitting}
        viewer={this.props.data.viewer}
      />
    );
  }
}

const enhanced = withRouteConfig<Props>({
  query: graphql`
    query EmailConfigRouteQuery {
      viewer {
        ...EmailConfigContainer_viewer
      }
      settings {
        email {
          ...EmailConfigContainer_email
        }
      }
    }
  `,
  cacheConfig: { force: true },
})(EmailConfigRoute);

export default enhanced;
