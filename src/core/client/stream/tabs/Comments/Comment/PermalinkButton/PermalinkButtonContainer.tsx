import React, { FunctionComponent } from "react";
import { graphql, useFragment } from "react-relay";

import { getURLWithCommentID } from "coral-framework/helpers";

import { PermalinkButtonContainer_story$key as StoryData } from "coral-stream/__generated__/PermalinkButtonContainer_story.graphql";

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
  const storyData = useFragment(
    graphql`
      fragment PermalinkButtonContainer_story on Story {
        url
      }
    `,
    story
  );

  return (
    <PermalinkButton
      className={className}
      commentID={commentID}
      url={getURLWithCommentID(storyData.url, commentID)}
      author={author}
    />
  );
};

export default PermalinkButtonContainer;
