import { Localized } from "fluent-react/compat";
import React, { FunctionComponent } from "react";

import { Flex, Icon, Typography } from "coral-ui/components";

import styles from "./ReplyTo.css";

interface Props {
  username: string;
}

const ReplyTo: FunctionComponent<Props> = ({ username }) => {
  const Username = () => (
    <Typography variant="heading4" container="span" className={styles.username}>
      {username}
    </Typography>
  );

  return (
    <Flex alignItems="center" className={styles.root}>
      <Icon>reply</Icon>{" "}
      <Localized id="comments-replyTo" username={<Username />}>
        <Typography container="span" className={styles.text}>
          {"Replying to: <username></username>"}
        </Typography>
      </Localized>
    </Flex>
  );
};

export default ReplyTo;
