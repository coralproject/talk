import { Localized } from "@fluent/react/compat";
import React, { FunctionComponent, useMemo } from "react";
import { graphql, RelayPaginationProp } from "react-relay";

import {
  useLoadMore,
  withPaginationContainer,
} from "coral-framework/lib/relay";
import { GQLUSER_ROLE } from "coral-framework/schema";
import { Card, Flex, Spinner } from "coral-ui/components/v2";

import { SiteSearchListContainer_query } from "coral-admin/__generated__/SiteSearchListContainer_query.graphql";
import { SiteSearchListContainerPaginationQueryVariables } from "coral-admin/__generated__/SiteSearchListContainerPaginationQuery.graphql";

import AutoLoadMore from "../AutoLoadMore";
import SiteFilterOption from "./SiteFilterOption";

import styles from "./SiteSearchListContainer.css";

interface ScopeSite {
  readonly id: string;
  readonly name: string;
}

interface Props {
  query: SiteSearchListContainer_query;
  relay: RelayPaginationProp;
  onSelect: (site: { name: string; id: string } | null) => void;
  activeSiteID: string | null;
  showOnlyScopedSitesInSiteSearchList: boolean;
}

const siteIsVisible = (
  id: string,
  viewerSites: ReadonlyArray<ScopeSite> | null | undefined
) => {
  if (!viewerSites || viewerSites.length === 0) {
    return true;
  }

  return viewerSites.map((s) => s.id).includes(id);
};

const SiteSearchListContainer: FunctionComponent<Props> = ({
  query,
  relay,
  onSelect,
  activeSiteID,
  showOnlyScopedSitesInSiteSearchList,
}) => {
  const viewer = query.viewer;
  const viewerSites = viewer?.moderationScopes?.sites;
  const viewerIsScoped =
    viewer?.moderationScopes?.sites && viewer.moderationScopes.sites.length > 0;
  const viewerIsSiteMod =
    viewer?.role === GQLUSER_ROLE.MODERATOR && viewerIsScoped;
  const viewerIsSiteModAndShouldScope =
    viewerIsSiteMod && showOnlyScopedSitesInSiteSearchList;

  const sites = useMemo(() => {
    const items = query?.sites.edges.map((edge) => edge.node) || [];

    return viewerIsSiteModAndShouldScope
      ? items.filter((i: { id: string }) => siteIsVisible(i.id, viewerSites))
      : items;
  }, [query?.sites.edges, viewerIsSiteModAndShouldScope, viewerSites]);

  const [loadMore, isLoadingMore] = useLoadMore(relay, 10);

  const hasMore = relay.hasMore();
  const loading = !query;

  return (
    <Card className={styles.list} data-testid="site-search-list">
      {/* NOTE: In future, can render the options based on a kind passed through for filter button, moderation link, etc. */}
      <SiteFilterOption onClick={onSelect} site={null} active={!activeSiteID} />
      {sites.map((s) => (
        <SiteFilterOption
          onClick={onSelect}
          site={s}
          active={s.id === activeSiteID}
          key={s.id}
        />
      ))}
      {!loading && sites.length === 0 && (
        <div className={styles.noneFound}>
          <Localized id="site-search-none-found">
            No sites were found with that search
          </Localized>
        </div>
      )}
      {loading && (
        <Flex justifyContent="center">
          <Spinner />
        </Flex>
      )}
      {hasMore && (
        <Flex justifyContent="center">
          <AutoLoadMore disableLoadMore={isLoadingMore} onLoadMore={loadMore} />
        </Flex>
      )}
    </Card>
  );
};

type FragmentVariables = SiteSearchListContainerPaginationQueryVariables;

const enhanced = withPaginationContainer<
  Props,
  SiteSearchListContainerPaginationQueryVariables,
  FragmentVariables
>(
  {
    query: graphql`
      fragment SiteSearchListContainer_query on Query
        @argumentDefinitions(
          count: { type: "Int", defaultValue: 10 }
          cursor: { type: "Cursor" }
          searchFilter: { type: "String" }
        ) {
        viewer {
          role
          moderationScopes {
            sites {
              id
              name
            }
          }
        }
        sites(first: $count, after: $cursor, query: $searchFilter)
          @connection(key: "SitesConfig_sites") {
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
      query SiteSearchListContainerPaginationQuery(
        $count: Int!
        $cursor: Cursor
        $searchFilter: String!
      ) {
        ...SiteSearchListContainer_query
          @arguments(
            count: $count
            cursor: $cursor
            searchFilter: $searchFilter
          )
      }
    `,
  }
)(SiteSearchListContainer);
export default enhanced;
