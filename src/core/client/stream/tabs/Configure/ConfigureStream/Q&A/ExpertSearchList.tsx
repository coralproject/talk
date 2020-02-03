import { Localized } from "@fluent/react/compat";
import React, { FunctionComponent, useCallback } from "react";

import { Card, Flex, Spinner } from "coral-ui/components";

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
  onAdd: (id: string, username: string, email: string) => void;

  hasMore: boolean;
  loading: boolean;
}

const ExpertSearchList: FunctionComponent<Props> = ({
  isVisible,
  users,
  loading,
  hasMore,
  onAdd,
}) => {
  const onAddClick = useCallback(
    (id: string, username: string, email: string) => {
      onAdd(id, username, email);
    },
    [onAdd]
  );

  if (!isVisible) {
    return null;
  }

  return (
    <div className={styles.list}>
      <Card>
        {users.map(u => (
          <ExpertSearchItem
            key={u.id}
            id={u.id}
            username={u.username}
            email={u.email}
            onClickAdd={onAddClick}
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
      </Card>
    </div>
  );
};

export default ExpertSearchList;
