import { Localized } from "@fluent/react/compat";
import React, { FunctionComponent, useCallback, useState } from "react";
import { useField } from "react-final-form";
import { graphql, RelayPaginationProp } from "react-relay";

import AutoLoadMore from "coral-admin/components/AutoLoadMore";
import { IntersectionProvider } from "coral-framework/lib/intersection";
import {
  useLoadMore,
  useRefetch,
  withPaginationContainer,
} from "coral-framework/lib/relay";
import { GQLUSER_ROLE } from "coral-framework/schema";
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

import styles from "./UserStatusSitesListContainer.css";

interface ScopeSite {
  readonly id: string;
  readonly name: string;
}

export interface Scopes {
  role: USER_ROLE;
  sites?: ScopeSite[] | null;
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
  viewerSites: ScopeSite[] | null | undefined
) => {
  if (!viewerSites || viewerSites.length === 0) {
    return true;
  }

  return viewerSites.map((s) => s.id).includes(id);
};

const UserStatusSitesListContainer: FunctionComponent<Props> = ({
  query,
  relay,
  viewerScopes,
}) => {
  const viewerIsScoped = !!viewerScopes.sites && viewerScopes.sites.length > 0;
  const viewerIsSiteMod =
    viewerScopes.role === GQLUSER_ROLE.MODERATOR && viewerIsScoped;
  const [showSites, setShowSites] = useState<boolean>(!!viewerIsScoped);
  const sites = viewerIsSiteMod
    ? viewerScopes.sites || []
    : query?.sites.edges.map((edge) => edge.node) || [];

  const { input: selectedIDsInput } = useField<string[]>("selectedIDs");

  const [loadMore, isLoadingMore] = useLoadMore(relay, 1);
  const [, isRefetching] = useRefetch<
    UserStatusSitesListContainerPaginationQueryVariables
  >(relay);
  const loading = !query || isRefetching;
  const hasMore = !isRefetching && relay.hasMore();

  const toggleShowSites = useCallback(() => {
    setShowSites(!showSites);
  }, [showSites, setShowSites]);
  const onChangeSite = useCallback(
    (siteID: string) => () => {
      const changed = [...selectedIDsInput.value];

      const index = changed.indexOf(siteID);
      if (index >= 0) {
        changed.splice(index, 1);
      } else {
        changed.push(siteID);
      }

      selectedIDsInput.onChange(changed);
    },
    [selectedIDsInput]
  );

  return (
    <IntersectionProvider>
      <FieldSet>
        <div className={styles.header}>
          {viewerIsScoped ? (
            <Localized id="community-banModal-selectSites">
              <Label>Select sites to ban</Label>
            </Localized>
          ) : (
            <FormField>
              <CheckBox checked={showSites} onChange={toggleShowSites}>
                <Localized id="community-banModal-selectSites">
                  Select sites to ban
                </Localized>
              </CheckBox>
            </FormField>
          )}
        </div>

        {(viewerIsScoped || showSites) && (
          <FormField>
            <ListGroup>
              {sites.map((site) => {
                const enabled = siteIsVisible(site.id, viewerScopes.sites);
                const isChecked = selectedIDsInput.value.includes(site.id);

                return (
                  <ListGroupRow key={site.id}>
                    <CheckBox
                      disabled={!enabled}
                      checked={isChecked}
                      onChange={onChangeSite(site.id)}
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
        )}
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
