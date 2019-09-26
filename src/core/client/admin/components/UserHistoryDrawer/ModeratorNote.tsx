import { Localized } from "fluent-react/compat";
import React, { FunctionComponent, useCallback } from "react";

import { Button, Timestamp, Typography } from "coral-ui/components";

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
      {moderator && <Typography>{moderator}</Typography>}
      <Typography>{body}</Typography>
      <Timestamp>{createdAt}</Timestamp>
      {onDelete && (
        <Button variant="ghost" onClick={deleteNote}>
          delete
        </Button>
      )}
    </div>
  );
};

export default ModeratorNote;
