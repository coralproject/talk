import { Localized } from "@fluent/react/compat";
import React, {
  FunctionComponent,
  useCallback,
  useEffect,
  useState,
} from "react";
import { RelayPaginationProp } from "react-relay";

import {
  graphql,
  useLoadMore,
  useMutation,
  useRefetch,
  withPaginationContainer,
} from "coral-framework/lib/relay";
import { GQLUSER_ROLE_RL, GQLUSER_STATUS_RL } from "coral-framework/schema";
import { Button, Flex, Icon, Typography } from "coral-ui/components";
import { TextField as SearchTextField } from "coral-ui/components/v2";

import { ExpertSelectionContainer_query as QueryData } from "coral-stream/__generated__/ExpertSelectionContainer_query.graphql";
import { ExpertSelectionContainerPaginationQueryVariables } from "coral-stream/__generated__/ExpertSelectionContainerPaginationQuery.graphql";

import AddExpertMutation from "./AddExpertMutation";
import ExpertListItem from "./ExpertListItem";
import ExpertSearchList from "./ExpertSearchList";
import RemoveExpertMutation from "./RemoveExpertMutation";

import styles from "./ExpertSelectionContainer.css";

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
  const users = computeUsers(query);
  const experts = computeExperts(query);

  const searchRootRef = React.createRef<HTMLDivElement>();

  const [loadMore, isLoadingMore] = useLoadMore(relay, 10);
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

  const addExpertMutation = useMutation(AddExpertMutation);
  const removeExpertMutation = useMutation(RemoveExpertMutation);

  const clearSearchFilter = useCallback(() => {
    setTempSearchFilter("");
    setSearchFilter("");
  }, [setSearchFilter, setTempSearchFilter]);

  const onClickOutside = useCallback(
    (e: any) => {
      if (
        searchRootRef &&
        searchRootRef.current &&
        searchRootRef.current.contains(e.target)
      ) {
        return;
      }

      clearSearchFilter();
    },
    [clearSearchFilter, searchRootRef]
  );
  useEffect(() => {
    document.addEventListener("mousedown", onClickOutside);
    return () => {
      document.removeEventListener("mousedown", onClickOutside);
    };
  }, [onClickOutside]);

  const onAddExpert = useCallback(
    (id: string) => {
      addExpertMutation({
        storyID,
        userID: id,
      });
      clearSearchFilter();
    },
    [addExpertMutation, clearSearchFilter]
  );
  const onRemoveExpert = useCallback(
    (id: string) => {
      removeExpertMutation({
        storyID,
        userID: id,
      });
    },
    [removeExpertMutation]
  );

  const onSubmitSearch = useCallback(() => {
    setSearchFilter(tempSearchFilter);
  }, [tempSearchFilter]);
  const onSearchTextChanged = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setTempSearchFilter(event.target.value);
    },
    [setTempSearchFilter]
  );
  const onSearchKeyDown = useCallback(
    (event: React.KeyboardEvent) => {
      if (event.key === "Escape") {
        clearSearchFilter();
      }
    },
    [clearSearchFilter]
  );
  const onSearchKeyPress = useCallback(
    (event: React.KeyboardEvent) => {
      if (event.key === "Enter") {
        onSubmitSearch();
      }
      if (event.key === "Escape") {
        clearSearchFilter();
      }
    },
    [onSubmitSearch, clearSearchFilter]
  );

  return (
    <>
      <Typography variant="heading3" container="div">
        <Localized id="configure-experts-title">
          <span>Add an Expert</span>
        </Localized>
      </Typography>
      <Localized id="configure-experts-filter-description">
        <Typography
          variant="detail"
          color="textSecondary"
          className={styles.description}
        >
          Adds an Expert Badge to comments by registered users, only on this
          page. New users must first sign up and open the comments on a page to
          create their account.
        </Typography>
      </Localized>
      <div className={styles.searchRoot} ref={searchRootRef}>
        <Flex>
          <Localized
            id="configure-experts-filter-searchField"
            attrs={{ placeholder: true, "aria-label": true }}
          >
            <SearchTextField
              color="regular"
              placeholder="Search by email or username"
              aria-label="Search by email or username"
              onChange={onSearchTextChanged}
              onKeyPress={onSearchKeyPress}
              onKeyDown={onSearchKeyDown}
              className={styles.searchField}
              variant="seamlessAdornment"
              value={tempSearchFilter}
              adornment={
                <Localized
                  id="configure-experts-filter-searchButton"
                  attrs={{ "aria-label": true }}
                >
                  <Button
                    className={styles.searchButton}
                    variant="filled"
                    color="primary"
                    aria-label="Search"
                    onClick={onSubmitSearch}
                  >
                    <Icon size="md">search</Icon>
                  </Button>
                </Localized>
              }
            />
          </Localized>
        </Flex>
        <ExpertSearchList
          isVisible={searchFilter.length > 0}
          users={users}
          onAdd={onAddExpert}
          loading={loading}
          hasMore={hasMore}
          disableLoadMore={isLoadingMore}
          onLoadMore={loadMore}
        />
        <Typography
          variant="heading3"
          container="div"
          className={styles.expertListTitle}
        >
          <Localized id="configure-experts-assigned-title">
            <span>Experts</span>
          </Localized>
        </Typography>
        {experts.length > 0 ? (
          <ul className={styles.list}>
            {experts.map(u => (
              <ExpertListItem
                key={u.id}
                id={u.id}
                username={u.username}
                email={u.email}
                onClickRemove={onRemoveExpert}
              />
            ))}
          </ul>
        ) : (
          <Localized id="configure-experts-none-yet">
            <Typography color="textSecondary">
              There are currently no experts for this Q&A.
            </Typography>
          </Localized>
        )}
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
