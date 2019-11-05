import { Localized } from "fluent-react/compat";
import React, { FunctionComponent, useCallback } from "react";

import { Button, Flex, Icon, Timestamp } from "coral-ui/components/v2";

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
      onDelete(id);
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
          <Localized id="moderatorNote-delete">
            <Button
              size="small"
              uppercase={false}
              variant="plain"
              onClick={deleteNote}
            >
              <Icon>delete</Icon>
              <span>Delete</span>
            </Button>
          </Localized>
        )}
      </Flex>
    </div>
  );
};

export default ModeratorNote;
