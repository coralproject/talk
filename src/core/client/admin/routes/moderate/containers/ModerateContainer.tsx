import { RouteProps } from "found";
import React from "react";
import { graphql } from "react-relay";

import { ModerateContainerQueryResponse } from "talk-admin/__generated__/ModerateContainerQuery.graphql";
import { withRouteConfig } from "talk-framework/lib/router";

import Moderate from "../components/Moderate";

interface Props {
  data: ModerateContainerQueryResponse;
}

class ModerateContainer extends React.Component<Props> {
  public static routeConfig: RouteProps;

  public render() {
    if (!this.props.data) {
      return null;
    }

    if (!this.props.data.moderationQueues) {
      return <Moderate />;
    }
    return (
      <Moderate
        unmoderatedCount={this.props.data.moderationQueues.unmoderated.count}
        reportedCount={this.props.data.moderationQueues.reported.count}
        pendingCount={this.props.data.moderationQueues.pending.count}
      >
        {this.props.children}
      </Moderate>
    );
  }
}

const enhanced = withRouteConfig<ModerateContainerQueryResponse>({
  query: graphql`
    query ModerateContainerQuery {
      moderationQueues {
        unmoderated {
          count
        }
        reported {
          count
        }
        pending {
          count
        }
      }
    }
  `,
  cacheConfig: { force: true },
})(ModerateContainer);

export default enhanced;
