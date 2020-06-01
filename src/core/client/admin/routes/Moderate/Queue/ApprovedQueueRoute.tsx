import { Localized } from "@fluent/react/compat";
import { RouteProps } from "found";
import React from "react";
import { graphql, RelayPaginationProp } from "react-relay";

import parseModerationOptions from "coral-framework/helpers/parseModerationOptions";
import { IntersectionProvider } from "coral-framework/lib/intersection";
import { withPaginationContainer } from "coral-framework/lib/relay";
import { resolveModule } from "coral-framework/lib/relay/helpers";

import { ApprovedQueueRoute_query } from "coral-admin/__generated__/ApprovedQueueRoute_query.graphql";
import { ApprovedQueueRoutePaginationQueryVariables } from "coral-admin/__generated__/ApprovedQueueRoutePaginationQuery.graphql";

import EmptyMessage from "./EmptyMessage";
import LoadingQueue from "./LoadingQueue";
import Queue from "./Queue";

interface ApprovedQueueRouteProps {
  query: ApprovedQueueRoute_query;
  relay: RelayPaginationProp;
  storyID?: string;
  siteID?: string;
  section?: string | null;
}

// TODO: use generated types
const danglingLogic = (status: string) => ["REJECTED"].includes(status);

export class ApprovedQueueRoute extends React.Component<
  ApprovedQueueRouteProps
> {
  public static routeConfig: RouteProps;

  public state = {
    disableLoadMore: false,
  };

  public render() {
    const comments = this.props.query.comments.edges.map((edge) => edge.node);
    return (
      <IntersectionProvider>
        <Queue
          settings={this.props.query.settings}
          comments={comments}
          onLoadMore={this.loadMore}
          hasLoadMore={this.props.relay.hasMore()}
          disableLoadMore={this.state.disableLoadMore}
          danglingLogic={danglingLogic}
          emptyElement={
            <Localized id="moderate-emptyQueue-approved">
              <EmptyMessage>There are no approved comments.</EmptyMessage>
            </Localized>
          }
          allStories={!this.props.storyID}
        />
      </IntersectionProvider>
    );
  }

  private loadMore = () => {
    if (!this.props.relay.hasMore() || this.props.relay.isLoading()) {
      return;
    }
    this.setState({ disableLoadMore: true });
    this.props.relay.loadMore(
      10, // Fetch the next 10 feed items
      (error) => {
        this.setState({ disableLoadMore: false });
        if (error) {
          // eslint-disable-next-line no-console
          console.error(error);
        }
      }
    );
  };
}

// TODO: (cvle) If this could be autogenerated..
type FragmentVariables = ApprovedQueueRoutePaginationQueryVariables;

const enhanced = (withPaginationContainer<
  ApprovedQueueRouteProps,
  ApprovedQueueRoutePaginationQueryVariables,
  FragmentVariables
>(
  {
    query: graphql`
      fragment ApprovedQueueRoute_query on Query
        @argumentDefinitions(
          count: { type: "Int!", defaultValue: 5 }
          cursor: { type: "Cursor" }
          storyID: { type: "ID" }
          siteID: { type: "ID" }
          section: { type: "SectionFilter" }
        ) {
        comments(
          status: APPROVED
          storyID: $storyID
          siteID: $siteID
          section: $section
          first: $count
          after: $cursor
        ) @connection(key: "ApprovedQueue_comments") {
          edges {
            node {
              id
              ...ModerateCardContainer_comment
            }
          }
        }
        settings {
          ...ModerateCardContainer_settings
        }
      }
    `,
  },
  {
    direction: "forward",
    getConnectionFromProps(props) {
      return props.query && props.query.comments;
    },
    // This is also the default implementation of `getFragmentVariables` if it isn't provided.
    getFragmentVariables(prevVars, totalCount) {
      return {
        ...prevVars,
        count: totalCount,
      };
    },
    getVariables(props, { count, cursor }, fragmentVariables) {
      return {
        ...fragmentVariables,
        count,
        cursor,
      };
    },
    query: graphql`
      # Pagination query to be fetched upon calling 'loadMore'.
      # Notice that we re-use our fragment, and the shape of this query matches our fragment spec.
      query ApprovedQueueRoutePaginationQuery(
        $storyID: ID
        $siteID: ID
        $section: SectionFilter
        $count: Int!
        $cursor: Cursor
      ) {
        ...ApprovedQueueRoute_query
          @arguments(
            storyID: $storyID
            siteID: $siteID
            section: $section
            count: $count
            cursor: $cursor
          )
      }
    `,
  }
)(ApprovedQueueRoute) as any) as typeof ApprovedQueueRoute;

enhanced.routeConfig = {
  Component: enhanced,
  query: resolveModule(graphql`
    query ApprovedQueueRouteQuery(
      $storyID: ID
      $siteID: ID
      $section: SectionFilter
    ) {
      ...ApprovedQueueRoute_query
        @arguments(storyID: $storyID, siteID: $siteID, section: $section)
    }
  `),
  cacheConfig: { force: true },
  render: function RejectedRouteRender({ Component, props, match }) {
    if (Component && props) {
      const { storyID, siteID, section } = parseModerationOptions(match);

      return (
        <Component
          query={props}
          storyID={storyID}
          siteID={siteID}
          section={section}
        />
      );
    }
    return <LoadingQueue />;
  },
};

export default enhanced;
