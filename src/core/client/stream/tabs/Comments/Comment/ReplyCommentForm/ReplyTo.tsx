import cn from "classnames";
import { Localized } from "fluent-react/compat";
import React, { FunctionComponent } from "react";

import CLASSES from "coral-stream/classes";
import { Flex, Icon, Typography } from "coral-ui/components";

import styles from "./ReplyTo.css";

interface Props {
  username: string;
}

const ReplyTo: FunctionComponent<Props> = ({ username }) => {
  const Username = () => (
    <Typography
      variant="heading4"
      container="span"
      className={cn(
        styles.username,
        CLASSES.createReplyComment.replyTo.username
      )}
    >
      {username}
    </Typography>
  );

  return (
    <Flex
      alignItems="center"
      className={cn(styles.root, CLASSES.createReplyComment.replyTo.$root)}
    >
      <Icon>reply</Icon>{" "}
      <Localized id="comments-replyTo" Username={<Username />}>
        <Typography
          container="span"
          className={cn(styles.text, CLASSES.createReplyComment.replyTo.text)}
        >
          {"Replying to: <Username></Username>"}
        </Typography>
      </Localized>
    </Flex>
  );
};

export default ReplyTo;
