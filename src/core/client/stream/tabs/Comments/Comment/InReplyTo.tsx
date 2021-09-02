import { Localized } from "@fluent/react/compat";
import cn from "classnames";
import React, { FunctionComponent, useCallback } from "react";

import { useCoralContext } from "coral-framework/lib/bootstrap";
import { globalErrorReporter } from "coral-framework/lib/errors";
import CLASSES from "coral-stream/classes";
import computeCommentElementID from "coral-stream/tabs/Comments/Comment/computeCommentElementID";
import { Flex, Icon } from "coral-ui/components/v2";

import { CommentContainer_comment as CommentData } from "coral-stream/__generated__/CommentContainer_comment.graphql";

import styles from "./InReplyTo.css";

interface Props {
  parent: CommentData["parent"];
  enableJumpToParent: boolean;
}

const InReplyTo: FunctionComponent<Props> = ({
  parent,
  enableJumpToParent,
}) => {
  const { pym } = useCoralContext();

  const navigateToParent = useCallback(() => {
    if (!parent) {
      return;
    }
    const elemId = computeCommentElementID(parent.id);
    const elem = document.getElementById(elemId);
    if (elem) {
      void pym?.scrollParentToChildEl(elemId);
      elem.focus();
    } else {
      globalErrorReporter.report(
        `Assertion Error: Expected to find parent comment with id ${parent?.id} but could not`
      );
    }
  }, [parent, pym]);

  const Username = () => {
    const username = parent!.author!.username;
    const className = cn(styles.username, CLASSES.comment.inReplyTo.username);
    return enableJumpToParent ? (
      <button onClick={navigateToParent} className={className}>
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
