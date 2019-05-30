import { Localized } from "fluent-react/compat";
import React, {
  FunctionComponent,
  ReactNode,
  useEffect,
  useState,
} from "react";

import { usePrevious } from "coral-framework/hooks";
import { graphql, withFragmentContainer } from "coral-framework/lib/relay";
import { TombstoneOrHideContainer_comment as CommentData } from "coral-stream/__generated__/TombstoneOrHideContainer_comment.graphql";
import { TombstoneOrHideContainer_viewer as ViewerData } from "coral-stream/__generated__/TombstoneOrHideContainer_viewer.graphql";
import { CallOut } from "coral-ui/components";

interface Props {
  viewer: ViewerData | null;
  comment: CommentData;
  children: ReactNode;
}

/**
 * useTombstone is a React hook that determines whether or not
 * to show a tombstone instead of hiding the comment.
 * @param hide boolean if comment should be hidden
 */
const useTombstone = (hide: boolean) => {
  const [tombstone, setTombstone] = useState<boolean>(false);
  const prevHide = usePrevious(hide);

  useEffect(() => {
    // When we first rendered this comment but then hide it,
    // show a tombstone instead.
    if (!tombstone && hide === true && prevHide === false) {
      setTombstone(true);
    }
  }, [hide, prevHide, tombstone, setTombstone]);
  return tombstone;
};

const TombstoneOrHideContainer: FunctionComponent<Props> = ({
  viewer,
  comment,
  children,
}) => {
  const hide = Boolean(
    comment.author &&
      viewer &&
      viewer.ignoredUsers.some(u => Boolean(u.id === comment.author!.id))
  );
  const tombstone = useTombstone(hide);

  if (!hide) {
    return <>{children}</>;
  }

  if (tombstone) {
    return (
      <Localized
        id="comments-tombstone-ignore"
        $username={comment.author!.username}
      >
        <CallOut fullWidth>
          This comment is hidden because you ignored {comment.author!.username}
        </CallOut>
      </Localized>
    );
  }
  return null;
};

const enhanced = withFragmentContainer<Props>({
  viewer: graphql`
    fragment TombstoneOrHideContainer_viewer on User {
      ignoredUsers {
        id
      }
    }
  `,
  comment: graphql`
    fragment TombstoneOrHideContainer_comment on Comment {
      author {
        id
        username
      }
    }
  `,
})(TombstoneOrHideContainer);

export default enhanced;
