import { Localized } from "@fluent/react/compat";
import React, { FunctionComponent, useCallback } from "react";

import { Card, Flex, Spinner } from "coral-ui/components/v2";
import { Button } from "coral-ui/components/v3";

import ExpertSearchItem from "./ExpertSearchItem";

import styles from "./ExpertSearchList.css";

interface UserItem {
  id: string;
  username: string | null;
  email: string | null;
}

interface Props {
  isVisible: boolean;
  users: UserItem[];
  onAdd: (id: string) => void;

  hasMore: boolean;
  loading: boolean;
  disableLoadMore: boolean;
  onLoadMore: () => void;
}

const ExpertSearchList: FunctionComponent<Props> = ({
  isVisible,
  users,
  loading,
  hasMore,
  disableLoadMore,
  onLoadMore,
  onAdd,
}) => {
  const onAddClick = useCallback(
    (id: string) => {
      onAdd(id);
    },
    [onAdd]
  );
  const loadMore = useCallback(() => {
    onLoadMore();
  }, [onLoadMore]);

  if (!isVisible) {
    return null;
  }

  return (
    <Card className={styles.list}>
      {users.map((u) => (
        <ExpertSearchItem
          key={u.id}
          id={u.id}
          username={u.username}
          email={u.email}
          onClickAdd={onAddClick}
        />
      ))}
      {!loading && users.length === 0 && (
        <div className={styles.noneFound}>
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
      {hasMore && (
        <Localized id="configure-experts-load-more">
          <Button
            variant="filled"
            color="primary"
            onClick={loadMore}
            disabled={disableLoadMore}
            className={styles.loadMore}
          >
            Load More
          </Button>
        </Localized>
      )}
    </Card>
  );
};

export default ExpertSearchList;
