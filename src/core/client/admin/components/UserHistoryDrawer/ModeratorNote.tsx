import { Localized } from "fluent-react/compat";
import React, { FunctionComponent, useCallback } from "react";

import { Button, Flex, Icon, Timestamp, Typography } from "coral-ui/components";

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
      <div className={styles.body}>
        <Typography variant="bodyCopy" className={styles.bodyType}>
          {body}
        </Typography>
      </div>
      <Flex justifyContent="space-between">
        <Flex alignItems="center">
          <Timestamp>{createdAt}</Timestamp>
          {moderator && (
            <>
              <Localized id="moderatorNote-left-by">
                <Typography variant="timestamp" className={styles.leftBy}>
                  Left by:
                </Typography>
              </Localized>
              <Typography className={styles.username} variant="timestamp">
                {moderator}
              </Typography>
            </>
          )}
        </Flex>
        {onDelete && (
          <Localized id="moderatorNote-delete">
            <Button size="small" color="primary" onClick={deleteNote}>
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
