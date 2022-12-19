import React, { FunctionComponent } from "react";
import { graphql } from "react-relay";

import { withFragmentContainer } from "coral-framework/lib/relay";

import { StoryStatusContainer_story } from "coral-admin/__generated__/StoryStatusContainer_story.graphql";

import StoryStatusText from "./StoryStatusText";

interface Props {
  story: StoryStatusContainer_story;
}

const StoryStatusContainer: FunctionComponent<Props> = (props) => {
  return (
    <StoryStatusText
      isArchived={props.story.isArchived}
      isArchiving={props.story.isArchiving}
      isUnarchiving={props.story.isUnarchiving}
    >
      {props.story.status}
    </StoryStatusText>
  );
};

const enhanced = withFragmentContainer<Props>({
  story: graphql`
    fragment StoryStatusContainer_story on Story {
      id
      status
      isArchiving
      isArchived
      isUnarchiving
    }
  `,
})(StoryStatusContainer);

export default enhanced;
