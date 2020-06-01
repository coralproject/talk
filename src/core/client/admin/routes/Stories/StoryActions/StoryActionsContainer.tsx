import React, { FunctionComponent, useCallback } from "react";
import { graphql } from "react-relay";

import {
  MutationProp,
  withFragmentContainer,
  withMutation,
} from "coral-framework/lib/relay";

import { StoryActionsContainer_story } from "coral-admin/__generated__/StoryActionsContainer_story.graphql";

import RescrapeStoryMutation from "./RescrapeStoryMutation";
import StoryActions from "./StoryActions";

interface Props {
  scrapeStory: MutationProp<typeof RescrapeStoryMutation>;
  story: StoryActionsContainer_story;
}

const StoryActionsContainer: FunctionComponent<Props> = (props) => {
  const onRescrape = useCallback(() => {
    props.scrapeStory({ id: props.story.id });
  }, [props.scrapeStory, props.story.id]);
  return <StoryActions onRescrape={onRescrape} />;
};

const enhanced = withMutation(RescrapeStoryMutation)(
  withFragmentContainer<Props>({
    story: graphql`
      fragment StoryActionsContainer_story on Story {
        id
      }
    `,
  })(StoryActionsContainer)
);

export default enhanced;
