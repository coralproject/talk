import React from "react";
import { graphql } from "react-relay";

import { withRouteConfig } from "coral-framework/lib/router";
import { Delay, Spinner } from "coral-ui/components/v2";

import { ModerationConfigRouteQueryResponse } from "coral-admin/__generated__/ModerationConfigRouteQuery.graphql";

import ModerationConfigContainer from "./ModerationConfigContainer";

interface Props {
  data: ModerationConfigRouteQueryResponse | null;
  submitting: boolean;
}

class ModerationConfigRoute extends React.Component<Props> {
  public render() {
    if (!this.props.data) {
      return (
        <Delay>
          <Spinner />
        </Delay>
      );
    }
    return (
      <ModerationConfigContainer
        settings={this.props.data.settings}
        submitting={this.props.submitting}
      />
    );
  }
}

const enhanced = withRouteConfig<Props>({
  query: graphql`
    query ModerationConfigRouteQuery {
      settings {
        ...ModerationConfigContainer_settings
      }
    }
  `,
  cacheConfig: { force: true },
})(ModerationConfigRoute);

export default enhanced;
