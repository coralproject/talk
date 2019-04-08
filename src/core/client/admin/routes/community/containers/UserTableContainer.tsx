import React, { StatelessComponent, useState } from "react";
import { graphql, RelayPaginationProp } from "react-relay";

import { UserTableContainer_query as QueryData } from "talk-admin/__generated__/UserTableContainer_query.graphql";
import { UserTableContainerPaginationQueryVariables } from "talk-admin/__generated__/UserTableContainerPaginationQuery.graphql";
import { IntersectionProvider } from "talk-framework/lib/intersection";
import {
  useLoadMore,
  useRefetch,
  withPaginationContainer,
} from "talk-framework/lib/relay";
import { GQLUSER_ROLE_RL, GQLUSER_STATUS_RL } from "talk-framework/schema";

import { HorizontalGutter } from "talk-ui/components";
import UserTable from "../components/UserTable";
import UserTableFilter from "../components/UserTableFilter";

interface Props {
  query: QueryData | null;
  relay: RelayPaginationProp;
}

const UserTableContainer: StatelessComponent<Props> = props => {
  const users = props.query
    ? props.query.users.edges.map(edge => edge.node)
    : [];

  const [loadMore, isLoadingMore] = useLoadMore(props.relay, 10);
  const [searchFilter, setSearchFilter] = useState<string>("");
  const [roleFilter, setRoleFilter] = useState<GQLUSER_ROLE_RL | null>(null);
  const [statusFilter, setStatusFilter] = useState<GQLUSER_STATUS_RL | null>(
    null
  );
  const [, isRefetching] = useRefetch(props.relay, {
    searchFilter: searchFilter || null,
    roleFilter,
    statusFilter,
  });

  return (
    <IntersectionProvider>
      <HorizontalGutter size="double">
        <UserTableFilter
          onSetRoleFilter={setRoleFilter}
          onSetStatusFilter={setStatusFilter}
          roleFilter={roleFilter}
          statusFilter={statusFilter}
          onSetSearchFilter={setSearchFilter}
          searchFilter={searchFilter}
        />
        <UserTable
          viewer={props.query && props.query.viewer}
          loading={!props.query || isRefetching}
          users={users}
          onLoadMore={loadMore}
          hasMore={!isRefetching && props.relay.hasMore()}
          disableLoadMore={isLoadingMore}
        />
      </HorizontalGutter>
    </IntersectionProvider>
  );
};

// TODO: (cvle) In this case they are the same, but they should be autogenerated.
type FragmentVariables = UserTableContainerPaginationQueryVariables;

const enhanced = withPaginationContainer<
  Props,
  UserTableContainerPaginationQueryVariables,
  FragmentVariables
>(
  {
    query: graphql`
      fragment UserTableContainer_query on Query
        @argumentDefinitions(
          count: { type: "Int!", defaultValue: 10 }
          cursor: { type: "Cursor" }
          roleFilter: { type: "USER_ROLE" }
          statusFilter: { type: "USER_STATUS" }
          searchFilter: { type: "String" }
        ) {
        viewer {
          ...UserRowContainer_viewer
        }
        users(
          first: $count
          after: $cursor
          role: $roleFilter
          status: $statusFilter
          query: $searchFilter
        ) @connection(key: "UserTable_users") {
          edges {
            node {
              id
              ...UserRowContainer_user
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
      query UserTableContainerPaginationQuery(
        $count: Int!
        $cursor: Cursor
        $roleFilter: USER_ROLE
        $statusFilter: USER_STATUS
        $searchFilter: String
      ) {
        ...UserTableContainer_query
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
)(UserTableContainer);

export default enhanced;
