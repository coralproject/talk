import { Localized } from "@fluent/react/compat";
import React, { FunctionComponent, useCallback, useState } from "react";
import { RelayPaginationProp } from "react-relay";

import {
  graphql,
  useMutation,
  useRefetch,
  withPaginationContainer,
} from "coral-framework/lib/relay";
import { GQLUSER_ROLE_RL, GQLUSER_STATUS_RL } from "coral-framework/schema";
import {
  Button,
  Flex,
  Icon,
  Spinner,
  TextField,
  Typography,
} from "coral-ui/components";

import { ExpertSelectionContainer_query as QueryData } from "coral-stream/__generated__/ExpertSelectionContainer_query.graphql";
import { ExpertSelectionContainerPaginationQueryVariables } from "coral-stream/__generated__/ExpertSelectionContainerPaginationQuery.graphql";

import AddExpertMutation from "./AddExpertMutation";
import ExpertListItem from "./ExpertListItem";
import ExpertSearchItem from "./ExpertSearchItem";

interface Props {
  storyID: string;
  query: QueryData | null;
  relay: RelayPaginationProp;
}

function computeUsers(query: QueryData | null) {
  if (!query) {
    return [];
  }

  return query.users.edges.map(edge => edge.node);
}

function computeExperts(query: QueryData | null) {
  if (!query) {
    return [];
  }
  if (!query.story) {
    return [];
  }

  return query.story.settings.experts;
}

const ExpertSelectionContainer: FunctionComponent<Props> = ({
  storyID,
  query,
  relay,
}) => {
  const addExpertMutation = useMutation(AddExpertMutation);

  const users = computeUsers(query);
  const experts = computeExperts(query);

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

  const onAddExpert = useCallback(
    (id: string, username: string | null, email: string | null) => {
      addExpertMutation({
        storyID,
        userID: id,
        username: username ? username : "",
        email: email ? email : "",
      });
    },
    [addExpertMutation]
  );
  const onRemoveExpert = useCallback((id: string) => {
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
      <Typography variant="heading3" container="div">
        <Localized id="configure-experts-title">
          <span>Experts</span>
        </Localized>
      </Typography>
      {experts.length === 0 && (
        <div>
          <Localized id="configure-experts-list-none">
            There are currently no experts for this story.
          </Localized>
        </div>
      )}
      {experts.length > 0 && (
        <ol>
          {users.map(u => (
            <ExpertListItem
              key={u.id}
              id={u.id}
              username={u.username}
              email={u.email}
              onClickRemove={onRemoveExpert}
            />
          ))}
        </ol>
      )}
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
          storyID: { type: "ID!" }
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
        story(id: $storyID) {
          settings {
            experts {
              id
              email
              username
            }
          }
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
        storyID: props.storyID,
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
        $storyID: ID!
        $count: Int!
        $cursor: Cursor
        $roleFilter: USER_ROLE
        $statusFilter: USER_STATUS
        $searchFilter: String
      ) {
        ...ExpertSelectionContainer_query
          @arguments(
            storyID: $storyID
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
