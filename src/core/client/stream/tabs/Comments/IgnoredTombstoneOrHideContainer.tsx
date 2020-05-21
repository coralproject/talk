import { Localized } from "@fluent/react/compat";
import React, {
  FunctionComponent,
  ReactNode,
  useCallback,
  useEffect,
  useState,
} from "react";
import { graphql } from "react-relay";

import { usePrevious } from "coral-framework/hooks";
import { withFragmentContainer } from "coral-framework/lib/relay";
import CLASSES from "coral-stream/classes";
import { Button, Tombstone } from "coral-ui/components/v3";

import { IgnoredTombstoneOrHideContainer_comment as CommentData } from "coral-stream/__generated__/IgnoredTombstoneOrHideContainer_comment.graphql";
import { IgnoredTombstoneOrHideContainer_viewer as ViewerData } from "coral-stream/__generated__/IgnoredTombstoneOrHideContainer_viewer.graphql";

import styles from "./IgnoredTombstoneOrHideContainer.css";

interface Props {
  viewer: ViewerData | null;
  comment: CommentData;
  children: ReactNode;
  singleConversationView?: boolean;
}

const IgnoredTombstoneOrHideContainer: FunctionComponent<Props> = ({
  viewer,
  comment,
  children,
  singleConversationView,
}) => {
  const deleted = Boolean(!comment.author);

  if (deleted) {
    return (
      <>
        <Tombstone className={CLASSES.deletedTombstone} fullWidth>
          <Localized id="comments-tombstone-deleted">
            This comment is no longer available. The commenter has deleted their
            account.
          </Localized>
        </Tombstone>
        {children}
      </>
    );
  }

  const ignored = Boolean(
    comment.author &&
      viewer &&
      viewer.ignoredUsers.some((u) => Boolean(u.id === comment.author!.id))
  );
  const [tombstone, setTombstone] = useState<boolean>(false);
  const [forceVisible, setForceVisible] = useState<boolean>(false);
  const previouslyIgnored = usePrevious(ignored);

  useEffect(() => {
    if (singleConversationView && ignored) {
      setTombstone(true);
    }

    // When we first rendered this comment but then hide it,
    // show a tombstone instead.
    if (!tombstone && ignored === true && previouslyIgnored === false) {
      setTombstone(true);
    }
  }, [ignored, previouslyIgnored, tombstone, setTombstone]);

  const onShowComment = useCallback(() => {
    setForceVisible(true);
  }, [setForceVisible]);

  if (!ignored || forceVisible) {
    return <>{children}</>;
  }

  if (tombstone) {
    return (
      <Tombstone className={CLASSES.ignoredTombstone} fullWidth>
        <Localized
          id="comments-tombstone-ignore"
          $username={comment.author!.username}
        >
          <span>
            This comment is hidden because you ignored{" "}
            {comment.author!.username}
          </span>
        </Localized>
        {singleConversationView && (
          <Button
            variant="outlined"
            fontSize="small"
            paddingSize="small"
            color="secondary"
            onClick={onShowComment}
            upperCase
            className={styles.showCommentButton}
            classes={{
              outlined: styles.outlined,
              active: styles.active,
              disabled: styles.disabled,
              mouseHover: styles.mouseHover,
              colorSecondary: styles.colorSecondary,
            }}
          >
            <Localized id="comments-tombstone-showComment">
              Show Comment
            </Localized>
          </Button>
        )}
      </Tombstone>
    );
  }
  return null;
};

const enhanced = withFragmentContainer<Props>({
  viewer: graphql`
    fragment IgnoredTombstoneOrHideContainer_viewer on User {
      ignoredUsers {
        id
      }
    }
  `,
  comment: graphql`
    fragment IgnoredTombstoneOrHideContainer_comment on Comment {
      author {
        id
        username
      }
    }
  `,
})(IgnoredTombstoneOrHideContainer);

export default enhanced;
