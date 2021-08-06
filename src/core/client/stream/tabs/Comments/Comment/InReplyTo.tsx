import { Localized } from "@fluent/react/compat";
import cn from "classnames";
import React, { FunctionComponent } from "react";

import { useCoralContext } from "coral-framework/lib/bootstrap";
import CLASSES from "coral-stream/classes";
import computeCommentElementID from "coral-stream/tabs/Comments/Comment/computeCommentElementID";
import { Flex, Icon } from "coral-ui/components/v2";

import { CommentContainer_comment as CommentData } from "coral-stream/__generated__/CommentContainer_comment.graphql";

import styles from "./InReplyTo.css";

interface Props {
  parent: CommentData["parent"];
  isLink: boolean;
}

const InReplyTo: FunctionComponent<Props> = ({ parent, isLink }) => {
  const { pym } = useCoralContext();

  const navigateToParent = (id: string) => {
    /* eslint-disable */
    console.log('navigating to parent');
    const elemId = computeCommentElementID(id);
    const elem = document.getElementById(elemId);
    console.log(elem);
    if (elem) {
      void pym?.scrollParentToChildEl(elemId);
      elem.focus();
      (elem as any).style["border"] = "5px solid green";
    } else {
      /* eslint-disable-next-line */
      console.log("TODO: its not on the page~");
    }
  };

  const Username = () => {
    const username = parent!.author!.username;
    const className = cn(styles.username, CLASSES.comment.inReplyTo.username);
    return isLink ? (
      <button
        onClick={() => navigateToParent(parent!.id)}
        className={className}
      >
        {parent!.author!.username}
      </button>
    ) : (
      <span className={className}>{username}</span>
    );
  };

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
