import { Localized } from "@fluent/react/compat";
import React, { FunctionComponent, useCallback } from "react";

import { Button, ButtonIcon, Flex, Timestamp } from "coral-ui/components/v2";

import styles from "./ModeratorNote.css";

interface Props {
  body: string;
  moderator: string | null;
  createdAt: string;
  onDelete: ((id: string) => Promise<any>) | null;
  id: string;
}

const ModeratorNote: FunctionComponent<Props> = ({
  moderator,
  createdAt,
  body,
  onDelete,
  id,
}) => {
  const deleteNote = useCallback(() => {
    if (onDelete) {
      void onDelete(id);
    }
  }, [id]);
  return (
    <div>
      <div className={styles.body}>{body}</div>
      <Flex justifyContent="space-between">
        <Flex alignItems="center" className={styles.footerLeft}>
          <Timestamp>{createdAt}</Timestamp>
          {moderator && (
            <Flex alignItems="center">
              <Localized id="moderatorNote-left-by">
                <div className={styles.leftBy}>Left by</div>
              </Localized>
              <div className={styles.username}>{moderator}</div>
            </Flex>
          )}
        </Flex>
        {onDelete && (
          <Button
            uppercase={false}
            iconLeft
            variant="flat"
            onClick={deleteNote}
          >
            <ButtonIcon>delete</ButtonIcon>
            <Localized id="moderatorNote-delete">Delete</Localized>
          </Button>
        )}
      </Flex>
    </div>
  );
};

export default ModeratorNote;
