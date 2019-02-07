import { FormApi } from "final-form";
import React from "react";
import { graphql } from "react-relay";

import { OrganizationRouteContainerQueryResponse } from "talk-admin/__generated__/OrganizationRouteContainerQuery.graphql";
import { withRouteConfig } from "talk-framework/lib/router";
import { Delay, Spinner } from "talk-ui/components";

import OrganizationConfigContainer from "./OrganizationConfigContainer";

interface Props {
  data: OrganizationRouteContainerQueryResponse | null;
  form: FormApi;
  submitting: boolean;
}

class OrganizationRouteContainer extends React.Component<Props> {
  public render() {
    if (!this.props.data) {
      return (
        <Delay>
          <Spinner />
        </Delay>
      );
    }
    return (
      <OrganizationConfigContainer
        settings={this.props.data.settings}
        form={this.props.form}
        submitting={this.props.submitting}
      />
    );
  }
}

const enhanced = withRouteConfig({
  query: graphql`
    query OrganizationRouteContainerQuery {
      settings {
        ...OrganizationConfigContainer_settings
      }
    }
  `,
  cacheConfig: { force: true },
})(OrganizationRouteContainer);

export default enhanced;
