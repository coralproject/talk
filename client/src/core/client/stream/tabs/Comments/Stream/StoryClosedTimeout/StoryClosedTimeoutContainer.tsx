import { clearLongTimeout } from "long-settimeout";
import { FunctionComponent, useEffect } from "react";
import { graphql } from "react-relay";

import { createTimeoutAt } from "coral-common/utils";
import { useMutation, withFragmentContainer } from "coral-framework/lib/relay";

import { StoryClosedTimeoutContainer_story as StoryData } from "coral-stream/__generated__/StoryClosedTimeoutContainer_story.graphql";

import SetStoryClosedMutation from "./SetStoryClosedMutation";

interface Props {
  story: StoryData;
}

const StoryClosedTimeoutContainer: FunctionComponent<Props> = ({ story }) => {
  const setStoryClosed = useMutation(SetStoryClosedMutation);

  // Whenever the story is updated, or the mutation is updated, reapply the
  // timer.
  useEffect(() => {
    if (!story.closedAt) {
      return;
    }

    // Create a timer to update the story status after this happens.
    const timer = createTimeoutAt(async () => {
      await setStoryClosed({
        storyID: story.id,
        isClosed: true,
      });
    }, story.closedAt);

    // When this component is disposed, dispose this timer.
    return () => {
      if (timer) {
        clearLongTimeout(timer);
      }
    };
  }, [story, setStoryClosed]);

  return null;
};

const enhanced = withFragmentContainer<Props>({
  story: graphql`
    fragment StoryClosedTimeoutContainer_story on Story {
      id
      closedAt
    }
  `,
})(StoryClosedTimeoutContainer);

export default enhanced;
