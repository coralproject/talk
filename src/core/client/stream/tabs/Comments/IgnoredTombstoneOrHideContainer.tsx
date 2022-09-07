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
import { Flex } from "coral-ui/components/v2";
import { Button, Tombstone } from "coral-ui/components/v3";

import { IgnoredTombstoneOrHideContainer_comment as CommentData } from "coral-stream/__generated__/IgnoredTombstoneOrHideContainer_comment.graphql";
import { IgnoredTombstoneOrHideContainer_viewer as ViewerData } from "coral-stream/__generated__/IgnoredTombstoneOrHideContainer_viewer.graphql";

import styles from "./IgnoredTombstoneOrHideContainer.css";

interface Props {
  viewer: ViewerData | null;
  comment: CommentData;
  children: ReactNode;
  allowTombstoneReveal?: boolean;
  disableHide?: boolean;
}

const IgnoredTombstoneOrHideContainer: FunctionComponent<Props> = ({
  viewer,
  comment,
  children,
  allowTombstoneReveal,
  disableHide,
}) => {
  const ignored = Boolean(
    comment.author &&
      viewer &&
      viewer.ignoredUsers.some((u) => Boolean(u.id === comment.author!.id))
  );
  const [tombstone, setTombstone] = useState<boolean>(Boolean(disableHide));
  const [forceVisible, setForceVisible] = useState<boolean>(false);
  const previouslyIgnored = usePrevious(ignored);

  useEffect(() => {
    // When we first rendered this comment but then hide it,
    // show a tombstone instead.
    if (
      disableHide ||
      (!tombstone && ignored === true && previouslyIgnored === false)
    ) {
      setTombstone(true);
    }
  }, [ignored, previouslyIgnored, tombstone, setTombstone, disableHide]);

  const onShowComment = useCallback(() => {
    setForceVisible(true);
  }, [setForceVisible]);

  if (!ignored || forceVisible) {
    return <>{children}</>;
  }

  if (tombstone) {
    return (
      <Tombstone className={CLASSES.ignoredTombstone} fullWidth>
        <Flex alignItems="center" justifyContent="center" itemGutter>
          <Localized
            id="comments-tombstone-ignore"
            vars={{ username: comment.author!.username! }}
          >
            <div>
              This comment is hidden because you ignored{" "}
              {comment.author!.username}
            </div>
          </Localized>
          {allowTombstoneReveal && (
            <Localized id="comments-tombstone-showComment">
              <Button
                variant="outlined"
                fontSize="small"
                paddingSize="small"
                color="secondary"
                onClick={onShowComment}
                upperCase
                classes={{
                  outlined: styles.outlined,
                  active: styles.active,
                  disabled: styles.disabled,
                  mouseHover: styles.mouseHover,
                  colorSecondary: styles.colorSecondary,
                }}
              >
                Show Comment
              </Button>
            </Localized>
          )}
        </Flex>
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
