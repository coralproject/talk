import { useEffect } from "react";

import { useEffectWhenChanged } from "coral-framework/hooks";
import { useCoralContext } from "coral-framework/lib/bootstrap";
import { getMessage } from "coral-framework/lib/i18n";

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
  commentCount: number
) {
  const { eventEmitter, localeBundles } = useCoralContext();
  const callback = () => {
    eventEmitter.emit("commentCount", {
      number: commentCount,
      text: getMessage(localeBundles, "comment-count-text", "Comment", {
        count: commentCount,
      }),
      storyID,
      storyURL,
    });
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
