import { RouteProps } from "found";
import React from "react";
import { graphql } from "react-relay";

import { ModerateContainerQueryResponse } from "talk-admin/__generated__/ModerateContainerQuery.graphql";

import Moderate from "../components/Moderate";

type Props = ModerateContainerQueryResponse;

export default class ModerateContainer extends React.Component<Props> {
  public static routeConfig: RouteProps;

  public render() {
    if (!this.props.moderationQueues) {
      return <Moderate />;
    }
    return (
      <Moderate
        unmoderatedCount={this.props.moderationQueues.unmoderated.count}
        reportedCount={this.props.moderationQueues.reported.count}
        pendingCount={this.props.moderationQueues.pending.count}
      >
        {this.props.children}
      </Moderate>
    );
  }
}

ModerateContainer.routeConfig = {
  Component: ModerateContainer,
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
  render: ({ Component, props }) =>
    Component ? <Component {...props} /> : undefined,
};
