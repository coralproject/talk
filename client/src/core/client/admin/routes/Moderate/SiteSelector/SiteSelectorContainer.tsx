import React, { useEffect, useMemo, useState } from "react";
import { graphql, RelayPaginationProp } from "react-relay";

import { QUEUE_NAME } from "coral-framework/helpers";
import {
  useLoadMore,
  useRefetch,
  withPaginationContainer,
} from "coral-framework/lib/relay";

import { SiteSelectorContainer_query } from "coral-admin/__generated__/SiteSelectorContainer_query.graphql";
import { SiteSelectorContainer_viewer } from "coral-admin/__generated__/SiteSelectorContainer_viewer.graphql";
import { SiteSelectorContainerPaginationQueryVariables } from "coral-admin/__generated__/SiteSelectorContainerPaginationQuery.graphql";

import { useCoralContext } from "coral-framework/lib/bootstrap";
import SiteSelector from "./SiteSelector";

interface Props {
  query: SiteSelectorContainer_query | null;
  viewer: SiteSelectorContainer_viewer | null;
  relay: RelayPaginationProp;
  queueName: QUEUE_NAME | undefined;
  siteID: string | null;
}

const useTimeout = <T extends unknown>(
  fn: (arg: T) => void,
  ms: number
): ((arg: T) => void) => {
  const context = useCoralContext();
  const [timeoutID, setTimeoutID] =
    useState<ReturnType<Window["setTimeout"]>>();

  return (arg: T) => {
    if (timeoutID !== undefined) {
      context.window.clearTimeout(timeoutID);
    }

    const newTimeoutID = context.window.setTimeout(() => {
      fn(arg);
    }, ms);
    setTimeoutID(newTimeoutID);
  };
};

const SiteSelectorContainer: React.FunctionComponent<Props> = (props) => {
  const [loadMore, isLoadingMore] = useLoadMore(props.relay, 10);
  const [displayFilter, setDisplayFilter] = useState("");
  const [searchFilter, setSearchFilter] = useState<string | null>(null);
  const delayedSetFilter = useTimeout(setSearchFilter, 1000);

  const [, isRefetching] = useRefetch(props.relay, 10, {
    searchFilter: searchFilter || null, // will this work?
  });

  useEffect(() => {
    delayedSetFilter(displayFilter);
  }, [displayFilter, delayedSetFilter]);

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

  return (
    <SiteSelector
      loading={!props.query || isRefetching}
      scoped={scoped}
      sites={sites}
      onLoadMore={loadMore}
      onFilter={setDisplayFilter}
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
