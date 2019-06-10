import { RouteProps } from "found";
import { noop } from "lodash";
import React from "react";
import { graphql } from "react-relay";

import { SingleModerateRouteQueryResponse } from "coral-admin/__generated__/SingleModerateRouteQuery.graphql";

import NotFound from "../../NotFound";
import { LoadingQueue, Queue } from "../Queue";
import SingleModerate from "./SingleModerate";

type Props = SingleModerateRouteQueryResponse;

const danglingLogic = () => false;

export default class SingleModerateRoute extends React.Component<Props> {
  public static routeConfig: RouteProps;

  public render() {
    if (!this.props.comment) {
      return <NotFound />;
    }
    return (
      <SingleModerate>
        <Queue
          comments={[this.props.comment]}
          settings={this.props.settings}
          onLoadMore={noop}
          hasMore={false}
          disableLoadMore={false}
          danglingLogic={danglingLogic}
        />
      </SingleModerate>
    );
  }
}

SingleModerateRoute.routeConfig = {
  Component: SingleModerateRoute,
  query: graphql`
    query SingleModerateRouteQuery($commentID: ID!) {
      comment(id: $commentID) {
        id
        ...ModerateCardContainer_comment
      }
      settings {
        ...ModerateCardContainer_settings
      }
    }
  `,
  cacheConfig: { force: true },
  render: ({ Component, props }) => {
    if (Component && props) {
      return <Component {...props} />;
    }
    return <LoadingQueue />;
  },
};
