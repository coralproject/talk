import { FormApi } from "final-form";
import React from "react";
import { graphql } from "react-relay";

import { ModerationRouteContainerQueryResponse } from "talk-admin/__generated__/ModerationRouteContainerQuery.graphql";
import { withRouteConfig } from "talk-framework/lib/router";
import { Delay, Spinner } from "talk-ui/components";

import ModerationContainer from ".//ModerationContainer";

interface Props {
  data: ModerationRouteContainerQueryResponse | null;
  form: FormApi;
  submitting: boolean;
}

class ModerationRouteContainer extends React.Component<Props> {
  public render() {
    if (!this.props.data) {
      return (
        <Delay>
          <Spinner />
        </Delay>
      );
    }
    return (
      <ModerationContainer
        settings={this.props.data.settings}
        form={this.props.form}
        submitting={this.props.submitting}
      />
    );
  }
}

const enhanced = withRouteConfig({
  query: graphql`
    query ModerationRouteContainerQuery {
      settings {
        ...ModerationContainer_settings
      }
    }
  `,
  cacheConfig: { force: true },
})(ModerationRouteContainer);

export default enhanced;
