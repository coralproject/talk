import { FormApi } from "final-form";
import React from "react";
import { graphql } from "react-relay";

import { AdvancedConfigRouteQueryResponse } from "coral-admin/__generated__/AdvancedConfigRouteQuery.graphql";
import { withRouteConfig } from "coral-framework/lib/router";
import { Delay, Spinner } from "coral-ui/components";

import AdvancedConfigContainer from "./AdvancedConfigContainer";

interface Props {
  data: AdvancedConfigRouteQueryResponse | null;
  form: FormApi;
  submitting: boolean;
}

class AdvancedConfigRoute extends React.Component<Props> {
  public render() {
    if (!this.props.data) {
      return (
        <Delay>
          <Spinner />
        </Delay>
      );
    }
    return (
      <AdvancedConfigContainer
        settings={this.props.data.settings}
        form={this.props.form}
        submitting={this.props.submitting}
      />
    );
  }
}

const enhanced = withRouteConfig<Props>({
  query: graphql`
    query AdvancedConfigRouteQuery {
      settings {
        ...AdvancedConfigContainer_settings
      }
    }
  `,
  cacheConfig: { force: true },
})(AdvancedConfigRoute);

export default enhanced;
