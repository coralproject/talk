import cn from "classnames";
import React, { FunctionComponent, useCallback } from "react";
import { graphql } from "react-relay";

import { InvalidRequestError } from "coral-framework/lib/errors";
import {
  useFetch,
  useMutation,
  withFragmentContainer,
} from "coral-framework/lib/relay";
import { ShowAuthPopupMutation } from "coral-stream/common/AuthPopup";
import { VIEWER_STATUS_CONTAINER_ID } from "coral-stream/constants";
import { useShadowRootOrDocument } from "coral-ui/encapsulation";

import { ReactionButtonContainer_comment as CommentData } from "coral-stream/__generated__/ReactionButtonContainer_comment.graphql";
import { ReactionButtonContainer_settings as SettingsData } from "coral-stream/__generated__/ReactionButtonContainer_settings.graphql";
import { ReactionButtonContainer_viewer as ViewerData } from "coral-stream/__generated__/ReactionButtonContainer_viewer.graphql";

import CLASSES from "coral-stream/classes";
import { shouldTriggerViewerRefresh } from "../../helpers";
import RefreshViewerFetch from "../../RefreshViewerFetch";
import CreateCommentReactionMutation from "./CreateCommentReactionMutation";
import ReactionButton from "./ReactionButton";
import RemoveCommentReactionMutation from "./RemoveCommentReactionMutation";

interface Props {
  comment: CommentData;
  settings: SettingsData;
  viewer: ViewerData | null;
  readOnly?: boolean;
  className?: string;
  reactedClassName: string;
  isQA?: boolean;
}

const ReactionButtonContainer: FunctionComponent<Props> = ({
  comment,
  settings,
  viewer,
  readOnly = false,
  className,
  reactedClassName,
  isQA = false,
}) => {
  const root = useShadowRootOrDocument();
  const showAuthPopup = useMutation(ShowAuthPopupMutation);
  const createCommentReaction = useMutation(CreateCommentReactionMutation);
  const removeCommentReaction = useMutation(RemoveCommentReactionMutation);
  const refreshViewer = useFetch(RefreshViewerFetch);
  const isLoggedIn = !!viewer;
  const handleClick = useCallback(async () => {
    if (!isLoggedIn) {
      return showAuthPopup({ view: "SIGN_IN" });
    }

    const input = {
      commentID: comment.id,
      // Can assume revision is not null as we tombstone when comment revisions
      // don't exist.
      commentRevisionID: comment.revision!.id,
      author: comment.author,
    };

    const alreadyReacted = !!comment.viewerActionPresence?.reaction;

    try {
      if (alreadyReacted) {
        await removeCommentReaction(input);
      } else {
        await createCommentReaction(input);
      }
    } catch (err) {
      if (err instanceof InvalidRequestError) {
        if (shouldTriggerViewerRefresh(err.code)) {
          await refreshViewer();

          // If we can find the viewer status container, then we should scroll
          // to it because it will contain the reason why we failed to update
          // the reaction count!
          const el = root.getElementById(VIEWER_STATUS_CONTAINER_ID);
          if (el) {
            el.scrollIntoView();
          }
        }
      }
    }
  }, [
    comment.author,
    comment.id,
    comment.revision,
    comment.viewerActionPresence?.reaction,
    createCommentReaction,
    isLoggedIn,
    refreshViewer,
    removeCommentReaction,
    showAuthPopup,
    root,
  ]);

  const {
    actionCounts: {
      reaction: { total: totalReactions },
    },
  } = comment;

  if (readOnly && totalReactions === 0) {
    return null;
  }

  const {
    reaction: { label, labelActive, icon, iconActive },
  } = settings;

  const reacted = !!comment.viewerActionPresence?.reaction;

  return (
    <ReactionButton
      className={cn(className, { [reactedClassName]: reacted })}
      onClick={handleClick}
      totalReactions={totalReactions}
      reacted={reacted}
      label={label}
      labelActive={labelActive}
      icon={icon}
      iconActive={iconActive}
      readOnly={readOnly}
      isQA={isQA}
      author={comment.author?.username}
      iconClassName={CLASSES.comment.actionBar.reactButton}
    />
  );
};

const enhanced = withFragmentContainer<Props>({
  viewer: graphql`
    fragment ReactionButtonContainer_viewer on User {
      id
    }
  `,
  comment: graphql`
    fragment ReactionButtonContainer_comment on Comment {
      id
      author {
        id
        username
      }
      revision {
        id
      }
      viewerActionPresence {
        reaction
      }
      actionCounts {
        reaction {
          total
        }
      }
    }
  `,
  settings: graphql`
    fragment ReactionButtonContainer_settings on Settings {
      reaction {
        label
        labelActive
        icon
        iconActive
      }
    }
  `,
})(ReactionButtonContainer);

export default enhanced;
