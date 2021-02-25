import React, { FunctionComponent } from "react";

import { Flex, Timestamp } from "coral-ui/components/v2";

import styles from "./LiveCommentBody.css";

interface Props {
  author?: {
    readonly username: string | null;
  } | null;
  createdAt: string;
  body?: string | null;
}

const LiveCommentBody: FunctionComponent<Props> = ({
  author,
  body,
  createdAt,
}) => {
  return (
    <Flex justifyContent="flex-start" alignItems="flex-start">
      <div className={styles.avatar}></div>
      <div className={styles.container}>
        <Flex justifyContent="flex-start" alignItems="center">
          <div className={styles.username}>{author?.username}</div>
          <Timestamp className={styles.timestamp}>{createdAt}</Timestamp>
        </Flex>
        <div
          className={styles.body}
          dangerouslySetInnerHTML={{ __html: body || "" }}
        ></div>
      </div>
    </Flex>
  );
};

export default LiveCommentBody;
