import { Localized } from "@fluent/react/compat";
import React, {
  FunctionComponent,
  useCallback,
  useMemo,
  useState,
} from "react";
import { useField } from "react-final-form";
import { graphql, RelayPaginationProp } from "react-relay";

import AutoLoadMore from "coral-admin/components/AutoLoadMore";
import { GQLUSER_ROLE } from "coral-admin/schema";
import { IntersectionProvider } from "coral-framework/lib/intersection";
import {
  useLoadMore,
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
  RadioButton,
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
  const viewerIsAdmin = viewerScopes.role === GQLUSER_ROLE.ADMIN;
  const viewerIsOrgAdmin =
    viewerScopes.role === GQLUSER_ROLE.MODERATOR &&
    !!(!viewerScopes.sites || viewerScopes.sites?.length === 0);
  const viewerIsScoped = !!viewerScopes.sites && viewerScopes.sites.length > 0;
  const viewerIsSiteMod =
    viewerScopes.role === GQLUSER_ROLE.MODERATOR && viewerIsScoped;
  const viewerIsSingleSiteMod = !!(
    viewerIsSiteMod &&
    viewerScopes.sites &&
    viewerScopes.sites.length === 1
  );

  const [showSites, setShowSites] = useState<boolean>(
    !!(viewerIsScoped || viewerIsSingleSiteMod)
  );

  const sites = useMemo(() => {
    const items = viewerIsSiteMod
      ? viewerScopes.sites || []
      : query?.sites.edges.map((edge) => edge.node) || [];

    return viewerIsSiteMod
      ? items.filter((i) => siteIsVisible(i.id, viewerScopes.sites))
      : items;
  }, [query?.sites.edges, viewerIsSiteMod, viewerScopes.sites]);

  const { input: selectedIDsInput } = useField<string[]>("selectedIDs");

  const [loadMore, isLoadingMore] = useLoadMore(relay, 1);
  const loading = !query;
  const hasMore = relay.hasMore();

  const onHideSites = useCallback(() => {
    setShowSites(false);
  }, [setShowSites]);
  const onShowSites = useCallback(() => {
    setShowSites(true);
  }, [setShowSites]);

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
          <Localized id="community-banModal-banFrom">
            <Label>Ban from</Label>
          </Localized>
        </div>

        {(viewerIsAdmin ||
          viewerIsOrgAdmin ||
          (viewerIsScoped && !viewerIsSingleSiteMod)) && (
          <div className={styles.sitesToggle}>
            <FormField>
              <Localized id="community-banModal-allSites">
                <RadioButton checked={!showSites} onChange={onHideSites}>
                  All sites
                </RadioButton>
              </Localized>
            </FormField>
            <FormField>
              <Localized id="community-banModal-specificSites">
                <RadioButton checked={showSites} onChange={onShowSites}>
                  Specific Sites
                </RadioButton>
              </Localized>
            </FormField>
          </div>
        )}

        {showSites && (
          <FormField>
            <ListGroup>
              {sites.map((site) => {
                const isChecked = selectedIDsInput.value.includes(site.id);

                return (
                  <ListGroupRow key={site.id}>
                    <CheckBox
                      checked={isChecked || viewerIsSingleSiteMod}
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
          count: { type: "Int", defaultValue: 20 }
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
    getConnectionFromProps(props) {
      return props.query && props.query.sites;
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
