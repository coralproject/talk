import { FormApi } from "final-form";
import React from "react";
import { graphql } from "react-relay";

import { withRouteConfig } from "coral-framework/lib/router";
import { Delay, Spinner } from "coral-ui/components";

import { OrganizationConfigRouteQueryResponse } from "coral-admin/__generated__/OrganizationConfigRouteQuery.graphql";

import OrganizationConfigContainer from "./OrganizationConfigContainer";

interface Props {
  data: OrganizationConfigRouteQueryResponse | null;
  form: FormApi;
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
      <OrganizationConfigContainer
        settings={this.props.data.settings}
        form={this.props.form}
        submitting={this.props.submitting}
      />
    );
  }
}

const enhanced = withRouteConfig<Props>({
  query: graphql`
    query OrganizationConfigRouteQuery {
      settings {
        ...OrganizationConfigContainer_settings
      }
    }
  `,
  cacheConfig: { force: true },
})(OrganizationConfigRoute);

export default enhanced;
