import { FluentBundle } from "@fluent/bundle/compat";
import { useEffect } from "react";
import { graphql } from "react-relay";

import { useEffectWhenChanged } from "coral-framework/hooks";
import { useCoralContext } from "coral-framework/lib/bootstrap";
import { getMessage } from "coral-framework/lib/i18n";

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

function getText(
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

/**
 * useCommentCountEvent is a React hook that will
 * emit `commentCount` events internally. Data events are dispatched to the light DOM
 * only when enabled via the `dataListeners` configuration option.
 * @param storyID story id of the comment count
 * @param storyURL story url of the comment count
 * @param storyMode story mode (regular, QA, ratings, etc.)
 * @param commentCount number of total published comments
 */
function useCommentCountEvent(
  storyID: string,
  storyURL: string,
  storyMode: STORY_MODE | undefined,
  commentCount: number
) {
  const { eventEmitter, dataEventEmitter, localeBundles } = useCoralContext();

  const callback = () => {
    const eventData = {
      number: commentCount,
      text: getText(storyMode, localeBundles, commentCount),
      storyID,
      storyURL,
    };

    // Emit internally for Coral's own use (e.g., updating comment count displays)
    eventEmitter.emit("commentCount", eventData);

    // Emit to dataEventEmitter for dataListeners if available
    if (dataEventEmitter) {
      dataEventEmitter.emit("commentCount", eventData);
    }
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(callback, []);
  useEffectWhenChanged(callback, [
    eventEmitter,
    dataEventEmitter,
    commentCount,
    localeBundles,
    storyID,
    storyURL,
  ]);
}

export default useCommentCountEvent;
