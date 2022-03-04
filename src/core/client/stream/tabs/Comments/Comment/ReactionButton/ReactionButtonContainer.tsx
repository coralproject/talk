import cn from "classnames";
import React, { FunctionComponent, useCallback } from "react";
import { graphql, useFragment } from "react-relay";

import { useCoralContext } from "coral-framework/lib/bootstrap/CoralContext";
import { InvalidRequestError } from "coral-framework/lib/errors";
import { useFetch, useMutation } from "coral-framework/lib/relay";
import { ShowAuthPopupMutation } from "coral-stream/common/AuthPopup";
import { VIEWER_STATUS_CONTAINER_ID } from "coral-stream/constants";

import { ReactionButtonContainer_comment$key as CommentData } from "coral-stream/__generated__/ReactionButtonContainer_comment.graphql";
import { ReactionButtonContainer_settings$key as SettingsData } from "coral-stream/__generated__/ReactionButtonContainer_settings.graphql";
import { ReactionButtonContainer_viewer$key as ViewerData } from "coral-stream/__generated__/ReactionButtonContainer_viewer.graphql";

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
  const viewerData = useFragment(
    graphql`
      fragment ReactionButtonContainer_viewer on User {
        id
      }
    `,
    viewer
  );
  const commentData = useFragment(
    graphql`
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
    comment
  );
  const settingsData = useFragment(
    graphql`
      fragment ReactionButtonContainer_settings on Settings {
        reaction {
          label
          labelActive
          icon
          iconActive
        }
      }
    `,
    settings
  );

  const { window } = useCoralContext();
  const showAuthPopup = useMutation(ShowAuthPopupMutation);
  const createCommentReaction = useMutation(CreateCommentReactionMutation);
  const removeCommentReaction = useMutation(RemoveCommentReactionMutation);
  const refreshViewer = useFetch(RefreshViewerFetch);
  const isLoggedIn = !!viewerData;
  const handleClick = useCallback(async () => {
    if (!isLoggedIn) {
      return showAuthPopup({ view: "SIGN_IN" });
    }

    const input = {
      commentID: commentData.id,
      // Can assume revision is not null as we tombstone when comment revisions
      // don't exist.
      commentRevisionID: commentData.revision!.id,
      author: commentData.author,
    };

    const alreadyReacted = !!commentData.viewerActionPresence?.reaction;

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
          const el = window.document.getElementById(VIEWER_STATUS_CONTAINER_ID);
          if (el) {
            el.scrollIntoView();
          }
        }
      }
    }
  }, [
    commentData.author,
    commentData.id,
    commentData.revision,
    commentData.viewerActionPresence?.reaction,
    createCommentReaction,
    isLoggedIn,
    refreshViewer,
    removeCommentReaction,
    showAuthPopup,
    window.document,
  ]);

  const {
    actionCounts: {
      reaction: { total: totalReactions },
    },
  } = commentData;

  if (readOnly && totalReactions === 0) {
    return null;
  }

  const {
    reaction: { label, labelActive, icon, iconActive },
  } = settingsData;

  const reacted = !!commentData.viewerActionPresence?.reaction;

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
      author={commentData.author?.username}
    />
  );
};

export default ReactionButtonContainer;
