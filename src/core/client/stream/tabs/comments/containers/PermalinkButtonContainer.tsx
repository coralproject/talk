import React, { StatelessComponent } from "react";
import { graphql } from "react-relay";
import { getURLWithCommentID } from "talk-framework/helpers";
import { withFragmentContainer } from "talk-framework/lib/relay";
import { PermalinkButtonContainer_story as StoryData } from "talk-stream/__generated__/PermalinkButtonContainer_story.graphql";

import PermalinkButton from "../components/PermalinkButton";

interface InnerProps {
  story: StoryData;
  commentID: string;
}

export const PermalinkButtonContainerProps: StatelessComponent<InnerProps> = ({
  story,
  commentID,
}) => {
  return (
    <PermalinkButton
      commentID={commentID}
      url={getURLWithCommentID(story.url, commentID)}
    />
  );
};

const enhanced = withFragmentContainer<InnerProps>({
  story: graphql`
    fragment PermalinkButtonContainer_story on Story {
      url
    }
  `,
})(PermalinkButtonContainerProps);

export default enhanced;
