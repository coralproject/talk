import { FormApi } from "final-form";
import React from "react";
import { graphql } from "react-relay";

import { ModerationConfigRouteContainerQueryResponse } from "talk-admin/__generated__/ModerationConfigRouteContainerQuery.graphql";
import { withRouteConfig } from "talk-framework/lib/router";
import { Delay, Spinner } from "talk-ui/components";

import ModerationConfigContainer from "./ModerationConfigContainer";

interface Props {
  data: ModerationConfigRouteContainerQueryResponse | null;
  form: FormApi;
  submitting: boolean;
}

class ModerationConfigRouteContainer extends React.Component<Props> {
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
        form={this.props.form}
        submitting={this.props.submitting}
      />
    );
  }
}

const enhanced = withRouteConfig<Props>({
  query: graphql`
    query ModerationConfigRouteContainerQuery {
      settings {
        ...ModerationConfigContainer_settings
      }
    }
  `,
  cacheConfig: { force: true },
})(ModerationConfigRouteContainer);

export default enhanced;
