import { Localized } from "@fluent/react/compat";
import React, { FunctionComponent, useCallback, useMemo } from "react";
import { graphql, RelayPaginationProp } from "react-relay";

import AutoLoadMore from "coral-admin/components/AutoLoadMore";
import { IntersectionProvider } from "coral-framework/lib/intersection";
import {
  useLoadMore,
  useRefetch,
  withPaginationContainer,
} from "coral-framework/lib/relay";
import {
  CheckBox,
  FieldSet,
  Flex,
  FormField,
  Label,
  ListGroup,
  ListGroupRow,
  Spinner,
} from "coral-ui/components/v2";

import { USER_ROLE } from "coral-admin/__generated__/UserStatusChangeContainer_viewer.graphql";
import { UserStatusSitesListContainer_query } from "coral-admin/__generated__/UserStatusSitesListContainer_query.graphql";
import { UserStatusSitesListContainerPaginationQueryVariables } from "coral-admin/__generated__/UserStatusSitesListContainerPaginationQuery.graphql";
import { useField } from "react-final-form";

export interface Scopes {
  role: USER_ROLE;
  siteIDs: string[] | undefined;
}

interface Props {
  viewerScopes: Scopes;
  userScopes: Scopes;
}

interface Props {
  query: UserStatusSitesListContainer_query;
  relay: RelayPaginationProp;

  viewerScopes: Scopes;
  userScopes: Scopes;
}

const siteIsVisible = (
  id: string,
  viewerSites: string[] | null | undefined
) => {
  if (!viewerSites || viewerSites.length === 0) {
    return true;
  }

  return viewerSites.includes(id);
};

const UserStatusSitesListContainer: FunctionComponent<Props> = ({
  query,
  relay,
  viewerScopes,
  userScopes,
}) => {
  const { input } = useField<string[]>("siteIDs");
  const sites = useMemo(
    () => query?.sites.edges.map((edge) => edge.node) || [],
    [query?.sites.edges]
  );
  const [loadMore, isLoadingMore] = useLoadMore(relay, 1);
  const [, isRefetching] = useRefetch<
    UserStatusSitesListContainerPaginationQueryVariables
  >(relay);
  const loading = !query || isRefetching;
  const hasMore = !isRefetching && relay.hasMore();

  const onChange = useCallback(
    (siteID: string, selectedIndex: number) => () => {
      const changed = [...input.value];
      if (selectedIndex >= 0) {
        changed.splice(selectedIndex, 1);
      } else {
        changed.push(siteID);
      }

      input.onChange(changed);
    },
    [input]
  );

  return (
    <IntersectionProvider>
      <FieldSet>
        <FormField>
          <Localized id="community-banModal-selectSites">
            <Label>Select sites to moderate</Label>
          </Localized>
          <ListGroup>
            {sites.map((site) => {
              const selectedIndex = input.value.indexOf(site.id);
              const enabled = siteIsVisible(site.id, viewerScopes.siteIDs);
              const isChecked = selectedIndex >= 0;

              return (
                <ListGroupRow key={site.id}>
                  <CheckBox
                    disabled={!enabled}
                    checked={isChecked}
                    onChange={onChange(site.id, selectedIndex)}
                  >
                    {site.name}
                  </CheckBox>
                </ListGroupRow>
              );
            })}
            {!loading && sites.length === 0 && (
              <Localized id="community-banModal-noSites">
                <span>No sites</span>
              </Localized>
            )}
            {loading && (
              <Flex justifyContent="center">
                <Spinner />
              </Flex>
            )}
            {hasMore && (
              <Flex justifyContent="center">
                <AutoLoadMore
                  disableLoadMore={isLoadingMore}
                  onLoadMore={loadMore}
                />
              </Flex>
            )}
          </ListGroup>
        </FormField>
      </FieldSet>
    </IntersectionProvider>
  );
};

type FragmentVariables = UserStatusSitesListContainerPaginationQueryVariables;

const enhanced = withPaginationContainer<
  Props,
  UserStatusSitesListContainerPaginationQueryVariables,
  FragmentVariables
>(
  {
    query: graphql`
      fragment UserStatusSitesListContainer_query on Query
        @argumentDefinitions(
          count: { type: "Int!", defaultValue: 20 }
          cursor: { type: "Cursor" }
        ) {
        sites(first: $count, after: $cursor)
          @connection(key: "UserStatusSitesListContainer_sites") {
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
      query UserStatusSitesListContainerPaginationQuery(
        $count: Int!
        $cursor: Cursor
      ) {
        ...UserStatusSitesListContainer_query
          @arguments(count: $count, cursor: $cursor)
      }
    `,
  }
)(UserStatusSitesListContainer);

export default enhanced;
