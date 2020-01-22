import { Localized } from "@fluent/react/compat";
import React, { FunctionComponent, useCallback, useState } from "react";
import { RelayPaginationProp } from "react-relay";

import {
  graphql,
  useRefetch,
  withPaginationContainer,
} from "coral-framework/lib/relay";
import { GQLUSER_ROLE_RL, GQLUSER_STATUS_RL } from "coral-framework/schema";
import { Button, Flex, Icon, Spinner, TextField } from "coral-ui/components";

import { ExpertSelectionContainer_query as QueryData } from "coral-stream/__generated__/ExpertSelectionContainer_query.graphql";
import { ExpertSelectionContainerPaginationQueryVariables } from "coral-stream/__generated__/ExpertSelectionContainerPaginationQuery.graphql";

import ExpertSearchItem from "./ExpertSearchItem";

interface Props {
  query: QueryData | null;
  relay: RelayPaginationProp;
}

const ExpertSelectionContainer: FunctionComponent<Props> = ({
  query,
  relay,
}) => {
  const users = query ? query.users.edges.map(edge => edge.node) : [];

  // const [loadMore, isLoadingMore] = useLoadMore(relay, 10);
  const [searchFilter, setSearchFilter] = useState<string>("");
  const [roleFilter] = useState<GQLUSER_ROLE_RL | null>(null);
  const [statusFilter] = useState<GQLUSER_STATUS_RL | null>(null);
  const [, isRefetching] = useRefetch(relay, {
    searchFilter: searchFilter || null,
    roleFilter,
    statusFilter,
  });
  const [tempSearchFilter, setTempSearchFilter] = useState<string>("");

  const loading = !query || isRefetching;
  const hasMore = !isRefetching && relay.hasMore();

  const onAddExpert = useCallback((id: string) => {
    window.console.log(id);
  }, []);

  const onSubmitSearch = useCallback(() => {
    setSearchFilter(tempSearchFilter);
  }, [tempSearchFilter]);
  const onSearchTextChanged = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setTempSearchFilter(event.target.value);
    },
    [setTempSearchFilter]
  );
  const onSearchKeyPress = useCallback(
    (event: React.KeyboardEvent) => {
      if (event.key === "Enter") {
        onSubmitSearch();
      }
    },
    [onSubmitSearch]
  );

  return (
    <>
      <Localized
        id="configure-experts-filter-searchField"
        attrs={{ placeholder: true, "aria-label": true }}
      >
        <TextField
          color="regular"
          placeholder="Search by username or email address..."
          aria-label="Search by username or email address"
          variant="seamlessAdornment"
          adornment={
            <Localized
              id="configure-experts-filter-searchButton"
              attrs={{ "aria-label": true }}
            >
              <Button color="dark" aria-label="Search" onClick={onSubmitSearch}>
                <Icon size="md">search</Icon>
              </Button>
            </Localized>
          }
          onChange={onSearchTextChanged}
          onKeyPress={onSearchKeyPress}
        />
      </Localized>
      <div>
        {searchFilter.length > 0 &&
          users.map(u => (
            <ExpertSearchItem
              key={u.id}
              id={u.id}
              username={u.username}
              email={u.email}
              onClickAdd={onAddExpert}
            />
          ))}
        {!loading && users.length === 0 && (
          <div>
            <Localized id="configure-experts-search-none-found">
              No users were found with that email or username
            </Localized>
          </div>
        )}
        {loading && (
          <Flex justifyContent="center">
            <Spinner />
          </Flex>
        )}
        {hasMore && <div>Load more</div>}
      </div>
    </>
  );
};

type FragmentVariables = ExpertSelectionContainerPaginationQueryVariables;

const enhanced = withPaginationContainer<
  Props,
  ExpertSelectionContainerPaginationQueryVariables,
  FragmentVariables
>(
  {
    query: graphql`
      fragment ExpertSelectionContainer_query on Query
        @argumentDefinitions(
          count: { type: "Int!", defaultValue: 10 }
          cursor: { type: "Cursor" }
          roleFilter: { type: "USER_ROLE" }
          statusFilter: { type: "USER_STATUS" }
          searchFilter: { type: "String" }
        ) {
        viewer {
          id
          username
        }
        users(
          first: $count
          after: $cursor
          role: $roleFilter
          status: $statusFilter
          query: $searchFilter
        ) @connection(key: "ExpertSelection_users") {
          edges {
            node {
              id
              email
              username
            }
          }
        }
      }
    `,
  },
  {
    direction: "forward",
    getConnectionFromProps(props) {
      return props.query && props.query.users;
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
        roleFilter: fragmentVariables.roleFilter,
        statusFilter: fragmentVariables.statusFilter,
        searchFilter: fragmentVariables.searchFilter,
      };
    },
    query: graphql`
      # Pagination query to be fetched upon calling 'loadMore'.
      # Notice that we re-use our fragment, and the shape of this query matches our fragment spec.
      query ExpertSelectionContainerPaginationQuery(
        $count: Int!
        $cursor: Cursor
        $roleFilter: USER_ROLE
        $statusFilter: USER_STATUS
        $searchFilter: String
      ) {
        ...ExpertSelectionContainer_query
          @arguments(
            count: $count
            cursor: $cursor
            roleFilter: $roleFilter
            statusFilter: $statusFilter
            searchFilter: $searchFilter
          )
      }
    `,
  }
)(ExpertSelectionContainer);

export default enhanced;
