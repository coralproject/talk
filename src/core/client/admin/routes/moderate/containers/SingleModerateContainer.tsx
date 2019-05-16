import { RouteProps } from "found";
import { noop } from "lodash";
import React from "react";
import { graphql } from "react-relay";

import { SingleModerateContainerQueryResponse } from "coral-admin/__generated__/SingleModerateContainerQuery.graphql";

import NotFound from "../../NotFound";
import LoadingQueue from "../components/LoadingQueue";
import Queue from "../components/Queue";
import SingleModerate from "../components/SingleModerate";

type Props = SingleModerateContainerQueryResponse;

const danglingLogic = () => false;

export default class SingleModerateContainer extends React.Component<Props> {
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

SingleModerateContainer.routeConfig = {
  Component: SingleModerateContainer,
  query: graphql`
    query SingleModerateContainerQuery($commentID: ID!) {
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
