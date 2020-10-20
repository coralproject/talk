import React, { FunctionComponent, useMemo } from "react";
import { graphql, RelayPaginationProp } from "react-relay";

import { IntersectionProvider } from "coral-framework/lib/intersection";
import {
  useLoadMore,
  useRefetch,
  withPaginationContainer,
} from "coral-framework/lib/relay";

import { SiteModeratorModalSiteFieldContainer_query } from "coral-admin/__generated__/SiteModeratorModalSiteFieldContainer_query.graphql";
import { SiteModeratorModalSiteFieldContainerPaginationQueryVariables } from "coral-admin/__generated__/SiteModeratorModalSiteFieldContainerPaginationQuery.graphql";

import SiteModeratorModalSiteField from "./SiteModeratorModalSiteField";

interface Props {
  query: SiteModeratorModalSiteFieldContainer_query;
  relay: RelayPaginationProp;
  viewerScoped: boolean;
  viewerSites?: string[] | null;
}

const SiteModeratorModalSiteFieldContainer: FunctionComponent<Props> = ({
  query,
  relay,
  viewerSites,
  viewerScoped,
}) => {
  const sites = useMemo(
    () => query?.sites.edges.map((edge) => edge.node) || [],
    [query?.sites.edges]
  );
  const [loadMore, isLoadingMore] = useLoadMore(relay, 1);
  const [, isRefetching] = useRefetch<
    SiteModeratorModalSiteFieldContainerPaginationQueryVariables
  >(relay);

  return (
    <IntersectionProvider>
      <SiteModeratorModalSiteField
        loading={!query || isRefetching}
        sites={sites}
        validSites={viewerScoped ? viewerSites || [] : null}
        onLoadMore={loadMore}
        hasMore={!isRefetching && relay.hasMore()}
        disableLoadMore={isLoadingMore}
      />
    </IntersectionProvider>
  );
};

type FragmentVariables = SiteModeratorModalSiteFieldContainerPaginationQueryVariables;

const enhanced = withPaginationContainer<
  Props,
  SiteModeratorModalSiteFieldContainerPaginationQueryVariables,
  FragmentVariables
>(
  {
    query: graphql`
      fragment SiteModeratorModalSiteFieldContainer_query on Query
        @argumentDefinitions(
          count: { type: "Int!", defaultValue: 20 }
          cursor: { type: "Cursor" }
        ) {
        sites(first: $count, after: $cursor)
          @connection(key: "SiteModeratorModalSiteField_sites") {
          edges {
            node {
              id
              name
            }
          }
        }
      }
    `,
  },
  {
    direction: "forward",
    getConnectionFromProps(props) {
      return props.query && props.query.sites;
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
        count,
        cursor,
      };
    },
    query: graphql`
      # Pagination query to be fetched upon calling 'loadMore'.
      # Notice that we re-use our fragment, and the shape of this query matches our fragment spec.
      query SiteModeratorModalSiteFieldContainerPaginationQuery(
        $count: Int!
        $cursor: Cursor
      ) {
        ...SiteModeratorModalSiteFieldContainer_query
          @arguments(count: $count, cursor: $cursor)
      }
    `,
  }
)(SiteModeratorModalSiteFieldContainer);

export default enhanced;
