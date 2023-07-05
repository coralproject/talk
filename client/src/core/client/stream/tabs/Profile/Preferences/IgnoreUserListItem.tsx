import { Localized } from "@fluent/react/compat";
import cn from "classnames";
import React, { FunctionComponent, useCallback, useState } from "react";

import CLASSES from "coral-stream/classes";
import { Flex, Icon } from "coral-ui/components/v2";
import { Button } from "coral-ui/components/v3";

import styles from "./IgnoreUserListItem.css";

interface Props {
  id: string;
  username: string | null;
  onRemove: (id: string) => void;
}

const renderName = (name: string | null) => {
  return (
    <span className={cn(styles.username, CLASSES.ignoredCommenters.username)}>
      {name}
    </span>
  );
};

const IgnoreUserListItem: FunctionComponent<Props> = ({
  id,
  username,
  onRemove,
}) => {
  const [removed, setRemoved] = useState(false);

  const onClickRemove = useCallback(() => {
    onRemove(id);
    setRemoved(true);
    // TODO: (cvle) Bug - Adding and removing ignored user mutations should
    // add or remove user from ths list, or this part should be split into a separate Query.
  }, [id, setRemoved, onRemove]);

  if (removed) {
    return (
      <div className={styles.removed} key={id} aria-live="polite">
        <Localized id="profile-account-ignoredCommenters-youAreNoLonger">
          <span>{"You are no longer ignoring "}</span>
        </Localized>
        {renderName(username)}
      </div>
    );
  }

  return (
    <Flex key={id} justifyContent="space-between" alignItems="center">
      {renderName(username)}
      <Button
        variant="none"
        color="none"
        onClick={onClickRemove}
        className={cn(
          styles.stopIgnoringButton,
          CLASSES.ignoredCommenters.stopIgnoreButton
        )}
        aria-controls="profile-account-ignoredCommenters-log"
      >
        <Flex justifyContent="center" alignItems="center">
          <Icon size="sm" className={styles.icon}>
            close
          </Icon>
          <Localized id="profile-account-ignoredCommenters-stopIgnoring">
            <span>Stop ignoring</span>
          </Localized>
        </Flex>
      </Button>
    </Flex>
  );
};

export default IgnoreUserListItem;
