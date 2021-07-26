import { Localized } from "@fluent/react/compat";
import cn from "classnames";
import React, { FunctionComponent } from "react";

import { useCoralContext } from "coral-framework/lib/bootstrap";
import CLASSES from "coral-stream/classes";
import computeCommentElementID from "coral-stream/tabs/Comments/Comment/computeCommentElementID";
import { Flex, Icon } from "coral-ui/components/v2";
import { Button } from "coral-ui/components/v3";

import { CommentContainer_comment as CommentData } from "coral-stream/__generated__/CommentContainer_comment.graphql";

import styles from "./InReplyTo.css";

interface Props {
  parent: CommentData["parent"];
}

const InReplyTo: FunctionComponent<Props> = ({ parent }) => {
  const { pym } = useCoralContext();
  const navigateToParent = (id: string) => {
    /* eslint-disable-next-line */
    const elemId = computeCommentElementID(id);
    const elem = document.getElementById(elemId);
    if (elem) {
      /* eslint-disable-next-line */
      pym?.scrollParentToChildEl(elemId);
      elem.focus();
      (elem as any).style["background-color"] = "pink";
    } else {
      /* eslint-disable-next-line */
      console.log("TODO: its not on the page~");
    }
  };

  const Username = () => (
    <Button
      onClick={() => navigateToParent(parent!.id)}
      className={cn(styles.username, CLASSES.comment.inReplyTo.username)}
    >
      {parent!.author!.username}
    </Button>
  );

  return (
    <Flex alignItems="center" className={CLASSES.comment.inReplyTo.$root}>
      <Icon className={styles.icon}>reply</Icon>{" "}
      <Localized id="comments-inReplyTo" Username={<Username />}>
        <span className={cn(styles.inReplyTo, CLASSES.comment.inReplyTo.text)}>
          {"In reply to <Username></Username>"}
        </span>
      </Localized>
    </Flex>
  );
};

export default InReplyTo;
