import React, { useEffect, useMemo, useState } from "react";
import { graphql, RelayPaginationProp } from "react-relay";

import { QUEUE_NAME } from "coral-framework/helpers";
import { useCoralContext } from "coral-framework/lib/bootstrap";
import {
  useLoadMore,
  useRefetch,
  withPaginationContainer,
} from "coral-framework/lib/relay";
import { QueryError } from "coral-ui/components/v3";

import { SiteSelectorContainer_query } from "coral-admin/__generated__/SiteSelectorContainer_query.graphql";
import { SiteSelectorContainer_viewer } from "coral-admin/__generated__/SiteSelectorContainer_viewer.graphql";
import { SiteSelectorContainerPaginationQueryVariables } from "coral-admin/__generated__/SiteSelectorContainerPaginationQuery.graphql";

import SiteSelector from "./SiteSelector";

interface Props {
  query: SiteSelectorContainer_query | null;
  viewer: SiteSelectorContainer_viewer | null;
  relay: RelayPaginationProp;
  queueName: QUEUE_NAME | undefined;
  siteID: string | null;
}

const SiteSelectorContainer: React.FunctionComponent<Props> = (props) => {
  const context = useCoralContext();
  const [loadMore, isLoadingMore] = useLoadMore(props.relay, 10);
  // Buffering in the sense that we gather changes and then "flush"
  // them 1 second after the last change is received
  const [filterBuffer, setFilterBuffer] = useState<string | null>(null);
  const [searchFilter, setSearchFilter] = useState<string | null>(null);
  const [searchTimeout, setSearchTimeout] = useState<number | undefined>();

  const [, isRefetching, refetchError] = useRefetch(props.relay, 10, {
    searchFilter: searchFilter || null,
  });

  useEffect(() => {
    if (filterBuffer === searchFilter) {
      return;
    }

    if (searchTimeout) {
      context.window.clearTimeout(searchTimeout);
    }

    const newTimeout = context.window.setTimeout(
      () => setSearchFilter(filterBuffer),
      1000
    );

    setSearchTimeout(newTimeout);

    return () => context.window.clearTimeout(searchTimeout);
  }, [filterBuffer, context.window]);
  // marcushaddon: omitting searchFilter from dependency array to avoid an infinite update loop

  const { sites, scoped } = useMemo(() => {
    // If the viewer is moderation scoped, then only provide those sites.
    if (
      props.viewer &&
      props.viewer.moderationScopes?.scoped &&
      props.viewer.moderationScopes.sites
    ) {
      return { scoped: true, sites: props.viewer.moderationScopes.sites };
    }

    // As the moderation is not scoped, return the sites from the query instead.

    if (props.query) {
      return {
        scoped: false,
        sites: props.query.sites.edges.map((edge) => edge.node),
      };
    }

    return { scoped: false, sites: [] };
  }, [props.query, props.viewer]);

  if (refetchError) {
    return <QueryError error={refetchError} />;
  }

  return (
    <SiteSelector
      loading={!props.query || isRefetching}
      scoped={scoped}
      sites={sites}
      onLoadMore={loadMore}
      onFilter={setFilterBuffer}
      hasMore={props.relay.hasMore()}
      disableLoadMore={isLoadingMore}
      queueName={props.queueName}
      siteID={props.siteID}
    />
  );
};

type FragmentVariables = SiteSelectorContainerPaginationQueryVariables;

const enhanced = withPaginationContainer<
  Props,
  SiteSelectorContainerPaginationQueryVariables,
  FragmentVariables
>(
  {
    query: graphql`
      fragment SiteSelectorContainer_query on Query
      @argumentDefinitions(
        count: { type: "Int", defaultValue: 10 }
        cursor: { type: "Cursor" }
        searchFilter: { type: "String" }
      ) {
        sites(first: $count, after: $cursor, query: $searchFilter)
          @connection(key: "SitesConfig_sites") {
          edges {
            node {
              id
              ...SiteSelectorSite_site
            }
          }
        }
      }
    `,
    viewer: graphql`
      fragment SiteSelectorContainer_viewer on User {
        moderationScopes {
          scoped
          sites {
            id
            ...SiteSelectorSite_site
          }
        }
      }
    `,
  },
  {
    getConnectionFromProps(props) {
      return props.query && props.query.sites;
    },
    getVariables(props, { count, cursor }, fragmentVariables) {
      return {
        count,
        cursor,
        searchFilter: fragmentVariables.searchFilter,
      };
    },
    query: graphql`
      # Pagination query to be fetched upon calling 'loadMore'.
      # Notice that we re-use our fragment, and the shape of this query matches our fragment spec.
      query SiteSelectorContainerPaginationQuery(
        $count: Int!
        $cursor: Cursor
        $searchFilter: String
      ) {
        ...SiteSelectorContainer_query
          @arguments(
            count: $count
            cursor: $cursor
            searchFilter: $searchFilter
          )
      }
    `,
  }
)(SiteSelectorContainer);

export default enhanced;
