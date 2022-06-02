import { FluentBundle } from "@fluent/bundle/compat";
import { useEffect } from "react";
import { graphql } from "react-relay";

import { useEffectWhenChanged } from "coral-framework/hooks";
import { useCoralContext } from "coral-framework/lib/bootstrap";
import { getMessage } from "coral-framework/lib/i18n";
import { GQLFEATURE_FLAG } from "coral-framework/schema";

import { FEATURE_FLAG } from "coral-stream/__generated__/useCommentCountEvent_settings.graphql";
import { STORY_MODE } from "coral-stream/__generated__/useCommentCountEvent_story.graphql";

// eslint-disable-next-line no-unused-expressions
graphql`
  fragment useCommentCountEvent_story on Story {
    id
    url
    settings {
      mode
    }
  }
`;

// eslint-disable-next-line no-unused-expressions
graphql`
  fragment useCommentCountEvent_settings on Settings {
    featureFlags
  }
`;

function getCountText(
  storyMode: STORY_MODE | undefined,
  localeBundles: FluentBundle[],
  count: number
) {
  if (storyMode === "RATINGS_AND_REVIEWS") {
    return getMessage(localeBundles, "comment-count-text-ratings", "Ratings", {
      count,
    });
  } else {
    return getMessage(localeBundles, "comment-count-text", "Comment", {
      count,
    });
  }
}

function getUnreadCountText(localeBundles: FluentBundle[], count: number) {
  return getMessage(localeBundles, "comment-count-text-unread", "Comment", {
    count,
  });
}

/**
 * useCommentCountEvent is a React hook that will
 * emit `commentCount` events.
 *
 * @param storyID story id of the comment count
 * @param storyURL story url of the comment count
 * @param commentCount number of total published comments
 */
function useCommentCountEvent(
  storyID: string,
  storyURL: string,
  storyMode: STORY_MODE | undefined,
  commentCount: number,
  seenCount: number,
  featureFlags: Readonly<FEATURE_FLAG[]>
) {
  const { eventEmitter, localeBundles } = useCoralContext();

  const callback = () => {
    eventEmitter.emit("commentCount", {
      number: commentCount,
      text: getCountText(storyMode, localeBundles, commentCount),
      storyID,
      storyURL,
    });

    if (
      storyMode === "COMMENTS" &&
      featureFlags.includes(GQLFEATURE_FLAG.COMMENT_SEEN) &&
      featureFlags.includes(GQLFEATURE_FLAG.Z_KEY)
    ) {
      let unreadCount = commentCount - seenCount;
      if (unreadCount < 0) {
        unreadCount = 0;
      }
      eventEmitter.emit("unreadCommentCount", {
        number: unreadCount,
        text: getUnreadCountText(localeBundles, unreadCount),
        storyID,
        storyURL,
      });
    }
  };
  useEffect(callback, []);
  useEffectWhenChanged(callback, [
    eventEmitter,
    commentCount,
    localeBundles,
    storyID,
    storyURL,
  ]);
}

export default useCommentCountEvent;
