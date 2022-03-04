import { clearLongTimeout } from "long-settimeout";
import { FunctionComponent, useEffect } from "react";
import { graphql, useFragment } from "react-relay";

import { createTimeoutAt } from "coral-common/utils";
import { useMutation } from "coral-framework/lib/relay";

import { StoryClosedTimeoutContainer_story$key as StoryData } from "coral-stream/__generated__/StoryClosedTimeoutContainer_story.graphql";

import SetStoryClosedMutation from "./SetStoryClosedMutation";

interface Props {
  story: StoryData;
}

const StoryClosedTimeoutContainer: FunctionComponent<Props> = ({ story }) => {
  const storyData = useFragment(
    graphql`
      fragment StoryClosedTimeoutContainer_story on Story {
        id
        closedAt
      }
    `,
    story
  );

  const setStoryClosed = useMutation(SetStoryClosedMutation);

  // Whenever the story is updated, or the mutation is updated, reapply the
  // timer.
  useEffect(() => {
    if (!storyData.closedAt) {
      return;
    }

    // Create a timer to update the story status after this happens.
    const timer = createTimeoutAt(async () => {
      await setStoryClosed({
        storyID: storyData.id,
        isClosed: true,
      });
    }, storyData.closedAt);

    // When this component is disposed, dispose this timer.
    return () => {
      if (timer) {
        clearLongTimeout(timer);
      }
    };
  }, [storyData, setStoryClosed]);

  return null;
};

export default StoryClosedTimeoutContainer;
