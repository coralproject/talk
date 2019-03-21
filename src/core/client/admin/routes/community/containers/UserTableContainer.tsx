import React, { StatelessComponent, useCallback, useState } from "react";
import { graphql, RelayPaginationProp } from "react-relay";

import { UserTableContainer_query as QueryData } from "talk-admin/__generated__/UserTableContainer_query.graphql";
import { UserTableContainerPaginationQueryVariables } from "talk-admin/__generated__/UserTableContainerPaginationQuery.graphql";
import { IntersectionProvider } from "talk-framework/lib/intersection";
import { withPaginationContainer } from "talk-framework/lib/relay";
import { GQLUSER_ROLE_RL } from "talk-framework/schema";

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
  const [disableLoadMore, setDisableLoadMore] = useState(false);
  const [refetching, setRefetching] = useState(false);
  const [roleFilter, setRoleFilter] = useState<GQLUSER_ROLE_RL | null>(null);

  const setRoleFilterAndRefetch = useCallback(
    (role: GQLUSER_ROLE_RL | null) => {
      setRoleFilter(role);
      setRefetching(true);
      props.relay.refetchConnection(
        10,
        error => {
          setRefetching(false);
          if (error) {
            // tslint:disable-next-line:no-console
            console.error(error);
          }
        },
        {
          roleFilter: role,
        }
      );
    },
    [roleFilter, props.relay]
  );

  const loadMore = useCallback(
    () => {
      if (!props.relay.hasMore() || props.relay.isLoading()) {
        return;
      }
      setDisableLoadMore(true);
      props.relay.loadMore(
        10, // Fetch the next 10 feed items
        error => {
          setDisableLoadMore(false);
          if (error) {
            // tslint:disable-next-line:no-console
            console.error(error);
          }
        }
      );
    },
    [props.relay]
  );

  return (
    <IntersectionProvider>
      <HorizontalGutter size="double">
        <UserTableFilter
          onSetRoleFilter={role => setRoleFilterAndRefetch(role || null)}
          roleFilter={roleFilter}
        />
        <UserTable
          me={props.query && props.query.me}
          loading={!props.query || refetching}
          users={users}
          onLoadMore={loadMore}
          hasMore={!refetching && props.relay.hasMore()}
          disableLoadMore={disableLoadMore}
        />
      </HorizontalGutter>
    </IntersectionProvider>
  );
};

// TODO: (cvle) This should be autogenerated.
interface FragmentVariables {
  count: number;
  cursor?: string;
  roleFilter: GQLUSER_ROLE_RL | null;
}

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
        ) {
        me {
          ...UserRowContainer_me
        }
        users(first: $count, after: $cursor, role: $roleFilter)
          @connection(key: "UserTable_users") {
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
      };
    },
    query: graphql`
      # Pagination query to be fetched upon calling 'loadMore'.
      # Notice that we re-use our fragment, and the shape of this query matches our fragment spec.
      query UserTableContainerPaginationQuery(
        $count: Int!
        $cursor: Cursor
        $roleFilter: USER_ROLE
      ) {
        ...UserTableContainer_query
          @arguments(count: $count, cursor: $cursor, roleFilter: $roleFilter)
      }
    `,
  }
)(UserTableContainer);

export default enhanced;
