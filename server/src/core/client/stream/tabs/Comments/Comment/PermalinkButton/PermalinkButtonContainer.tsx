import React, { FunctionComponent } from "react";
import { graphql } from "react-relay";

import { getURLWithCommentID } from "coral-framework/helpers";
import { withFragmentContainer } from "coral-framework/lib/relay";

import { PermalinkButtonContainer_story as StoryData } from "coral-stream/__generated__/PermalinkButtonContainer_story.graphql";

import PermalinkButton from "./PermalinkButton";

interface Props {
  story: StoryData;
  commentID: string;
  className?: string;
  author?: string | null;
}

export const PermalinkButtonContainer: FunctionComponent<Props> = ({
  story,
  commentID,
  className,
  author,
}) => {
  return (
    <PermalinkButton
      className={className}
      commentID={commentID}
      url={getURLWithCommentID(story.url, commentID)}
      author={author}
    />
  );
};

const enhanced = withFragmentContainer<Props>({
  story: graphql`
    fragment PermalinkButtonContainer_story on Story {
      url
    }
  `,
})(PermalinkButtonContainer);

export default enhanced;
