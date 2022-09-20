import { Localized } from "@fluent/react/compat";
import cn from "classnames";
import React, { FunctionComponent, useCallback } from "react";

import { globalErrorReporter } from "coral-framework/lib/errors";
import CLASSES from "coral-stream/classes";
import computeCommentElementID from "coral-stream/tabs/Comments/Comment/computeCommentElementID";
import { BaseButton, Flex, Icon } from "coral-ui/components/v2";
import { useShadowRootOrDocument } from "coral-ui/encapsulation";

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
  const root = useShadowRootOrDocument();

  const navigateToParent = useCallback(() => {
    if (!parent) {
      return;
    }

    const elemID = computeCommentElementID(parent.id);
    const elem = root.getElementById(elemID);
    if (elem) {
      elem.scrollIntoView();
      elem.focus();
    } else {
      globalErrorReporter.report(
        `Assertion Error: Expected to find parent comment with id ${parent?.id} but could not`
      );
    }
  }, [parent, root]);

  const Username = () => (
    <span className={cn(styles.username, CLASSES.comment.inReplyTo.username)}>
      {parent?.author?.username}
    </span>
  );

  const Content = (
    <Flex
      alignItems="center"
      className={CLASSES.comment.inReplyTo.$root}
      container="span"
    >
      <Icon className={styles.icon}>reply</Icon>{" "}
      <Localized id="comments-inReplyTo" elems={{ Username: <Username /> }}>
        <span className={cn(styles.inReplyTo, CLASSES.comment.inReplyTo.text)}>
          {"In reply to <Username></Username>"}
        </span>
      </Localized>
    </Flex>
  );

  if (!enableJumpToParent) {
    return Content;
  }
  return (
    <BaseButton onClick={navigateToParent} className={styles.button}>
      {Content}
    </BaseButton>
  );
};

export default InReplyTo;
