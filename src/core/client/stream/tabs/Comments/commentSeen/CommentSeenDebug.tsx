import React, { FC, useCallback, useContext } from "react";
import { v4 as uuid } from "uuid";

import { CommentSeenContext } from "./CommentSeenContext";

const CommentSeenDebug: FC = () => {
  const { markSeen } = useContext(CommentSeenContext);

  const handleClick = useCallback(async () => {
    for (let i = 0; i < 10000; i++) {
      markSeen(uuid());
    }
  }, [markSeen]);

  return (
    <div>
      <button onClick={handleClick}>Add 10000 Comment Seen</button>
    </div>
  );
};

export default CommentSeenDebug;
